from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import ClearanceRecord, ClearanceItem, Document, OfficeType, ClearanceStatus, OverallStatus, DocumentRequirement
from .serializers import ClearanceRecordSerializer, ClearanceItemSerializer, DocumentSerializer, DocumentRequirementSerializer
from notifications.models import Notification
import django.utils.timezone as timezone

class DocumentRequirementListView(views.APIView):
    permission_classes = [AllowAny] # Requirements can be public or at least accessible to all auth users

    def get(self, request):
        requirements = DocumentRequirement.objects.all()
        serializer = DocumentRequirementSerializer(requirements, many=True)
        return Response(serializer.data)

class StudentClearanceRecordView(views.APIView):
    def get(self, request):
        if request.user.role != 'STUDENT':
            return Response({"error": "Only students can access this"}, status=status.HTTP_403_FORBIDDEN)
        
        record, created = ClearanceRecord.objects.get_or_create(student=request.user)
        
        # Ensure all office types have items
        for office in OfficeType:
            ClearanceItem.objects.get_or_create(record=record, office_type=office)
        
        record.update_status()
            
        serializer = ClearanceRecordSerializer(record)
        return Response(serializer.data)

class DocumentUploadView(views.APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        office_type = request.data.get('office_type')
        document_type = request.data.get('document_type')
        file_obj = request.FILES.get('file')

        if not all([office_type, document_type, file_obj]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            record = ClearanceRecord.objects.get(student=request.user)
            item = ClearanceItem.objects.get(record=record, office_type=office_type)
        except (ClearanceRecord.DoesNotExist, ClearanceItem.DoesNotExist):
            return Response({"error": "Clearance record not initialized"}, status=status.HTTP_400_BAD_REQUEST)

        # Create Document
        doc = Document.objects.create(
            clearance_item=item,
            document_type=document_type,
            file=file_obj,
            file_name=file_obj.name,
            file_size=file_obj.size
        )

        # Update item status to PENDING if it was EMPTY
        if item.status == ClearanceStatus.EMPTY:
            item.status = ClearanceStatus.PENDING
            item.save()

        # Create Notification
        Notification.create(
            user=request.user,
            title="Document Uploaded",
            message=f"You have uploaded {file_obj.name} to {office_type} office.",
            notification_type='success',
            category='submission'
        )

        return Response(DocumentSerializer(doc).data, status=status.HTTP_201_CREATED)

class SubmitClearanceView(views.APIView):
    def post(self, request):
        office_type = request.data.get('office_type')
        if not office_type:
            return Response({"error": "Office type is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            record = ClearanceRecord.objects.get(student=request.user)
            item = ClearanceItem.objects.get(record=record, office_type=office_type)
        except (ClearanceRecord.DoesNotExist, ClearanceItem.DoesNotExist):
            return Response({"error": "Clearance record or item not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if all requirements are met (simple check for now)
        # In a real app, you'd verify all required DocumentRequirement types have at least one Document
        
        item.status = ClearanceStatus.PENDING
        item.save()
        
        # Create Notification
        Notification.create(
            user=request.user,
            title="Clearance Submitted",
            message=f"Your clearance for {office_type} has been submitted for review.",
            notification_type='success',
            category='submission'
        )
        
        return Response({"message": f"Clearance for {office_type} submitted successfully", "status": item.status})

class OfficerClearanceListView(views.APIView):
    def get(self, request):
        if request.user.role != 'OFFICER':
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        office_type = request.user.officer_profile.office_type
        items = ClearanceItem.objects.filter(office_type=office_type)
        
        # Filtering
        status_filter = request.query_params.get('status')
        if status_filter:
            items = items.filter(status=status_filter)
            
        serializer = ClearanceItemSerializer(items, many=True)
        return Response(serializer.data)

class OfficerClearanceDetailView(views.APIView):
    def get(self, request, pk):
        item = get_object_or_404(ClearanceItem, pk=pk)
        if request.user.role != 'OFFICER' or item.office_type != request.user.officer_profile.office_type:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ClearanceItemSerializer(item)
        return Response(serializer.data)

    def patch(self, request, pk):
        item = get_object_or_404(ClearanceItem, pk=pk)
        if request.user.role != 'OFFICER' or item.office_type != request.user.officer_profile.office_type:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        comments = request.data.get('officer_comments')
        
        if new_status:
            item.status = new_status
        if comments:
            item.officer_comments = comments
            
        import django.utils.timezone as timezone
        item.reviewed_at = timezone.now()
        item.assigned_officer = request.user
        item.save()
        
        # Create Notification for student
        Notification.create(
            user=item.record.student,
            title=f"Clearance Update: {item.office_type}",
            message=f"Your clearance for {item.office_type} has been {item.status}.",
            notification_type='success' if item.status == 'approved' else 'error',
            category='approval' if item.status == 'approved' else 'rejection'
        )
        
        return Response(ClearanceItemSerializer(item).data)

class ConfirmSubmissionView(views.APIView):
    """
    Confirms that a clearance record submission is complete after all office reviews are done.
    This marks the overall clearance as approved and ready for certificate generation.
    """
    def post(self, request):
        if request.user.role not in ['OFFICER', 'INSTITUTION_ADMIN', 'SUPER_ADMIN']:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        record_id = request.data.get('record_id')
        if not record_id:
            return Response({"error": "Record ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            record = ClearanceRecord.objects.get(id=record_id)
        except ClearanceRecord.DoesNotExist:
            return Response({"error": "Clearance record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if all items are approved
        items = record.items.all()
        if not items:
            return Response({"error": "No clearance items found"}, status=status.HTTP_400_BAD_REQUEST)
        
        unapproved_items = items.exclude(status=ClearanceStatus.APPROVED)
        if unapproved_items.exists():
            unapproved_list = [item.office_type for item in unapproved_items]
            return Response({
                "error": "Not all clearance items are approved",
                "unapproved_offices": unapproved_list
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark record as fully approved
        record.overall_status = OverallStatus.APPROVED
        record.save()
        
        # Create Notification for student
        Notification.create(
            user=record.student,
            title="Clearance Completed! 🎉",
            message="Congratulations! Your clearance has been fully approved. You can now download your certificate.",
            notification_type='success',
            category='approval'
        )
        
        return Response({
            "message": "Clearance submission confirmed successfully",
            "record": ClearanceRecordSerializer(record).data
        }, status=status.HTTP_200_OK)

class GlobalStudentSearchView(views.APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response([])

        from accounts.models import User
        from accounts.serializers import UserSerializer

        students = User.objects.filter(
            role='STUDENT',
            student_profile__full_name__icontains=query
        ) | User.objects.filter(
            role='STUDENT',
            student_profile__jamb_number__icontains=query
        )

        return Response(UserSerializer(students.distinct()[:10], many=True).data)
