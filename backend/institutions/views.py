from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Institution, College, Department
from .serializers import (
    InstitutionSerializer, InstitutionRegistrationSerializer, 
    CollegeSerializer, DepartmentSerializer
)

class IsInstitutionAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Check if user is authenticated and is an Institution Admin
        return request.user.is_authenticated and request.user.role == 'INSTITUTION_ADMIN'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        user_profile = getattr(request.user, 'officer_profile', None)
        if not user_profile:
            return False

        # Check if the object belongs to the admin's institution
        if hasattr(obj, 'institution'):
            return obj.institution == user_profile.institution
        if hasattr(obj, 'college'):
             return obj.college.institution == user_profile.institution
        # For Institution object itself
        if isinstance(obj, Institution):
            return obj == user_profile.institution
        return False

class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InstitutionRegistrationSerializer
        return InstitutionSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()] # Allow public registration
        return [IsInstitutionAdminOrReadOnly()] # Only admin can update, everyone can read

class CollegeViewSet(viewsets.ModelViewSet):
    serializer_class = CollegeSerializer
    permission_classes = [IsInstitutionAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = College.objects.all()
        institution_id = self.request.query_params.get('institution_id')
        if institution_id:
            queryset = queryset.filter(institution_id=institution_id)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role == 'INSTITUTION_ADMIN':
            serializer.save(institution=self.request.user.officer_profile.institution)
        else:
            serializer.save()

class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [IsInstitutionAdminOrReadOnly]

    def get_queryset(self):
        queryset = Department.objects.all()
        college_id = self.request.query_params.get('college_id')
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        return queryset