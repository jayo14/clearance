from rest_framework import serializers
from .models import ClearanceRecord, ClearanceItem, Document, DocumentRequirement

class DocumentRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentRequirement
        fields = ['id', 'office_type', 'document_type', 'label', 'is_required', 'description', 'accepted_formats', 'max_file_size']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'document_type', 'file', 'file_name', 'file_size', 'upload_date', 'is_verified']

class ClearanceItemSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    student_name = serializers.CharField(source='record.student_name', read_only=True)
    
    class Meta:
        model = ClearanceItem
        fields = [
            'id', 'office_type', 'status', 'assigned_officer', 
            'officer_comments', 'reviewed_at', 'created_at', 'updated_at',
            'documents', 'student_name'
        ]

class ClearanceRecordSerializer(serializers.ModelSerializer):

    items = ClearanceItemSerializer(many=True, read_only=True)

    student_name = serializers.ReadOnlyField()

    

    class Meta:

        model = ClearanceRecord

        fields = ['id', 'overall_status', 'created_at', 'updated_at', 'items', 'student_name']


