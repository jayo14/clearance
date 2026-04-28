from rest_framework import serializers
from .models import Institution, College, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'college', 'name', 'hod_name']
        read_only_fields = ['id']

class CollegeSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = College
        fields = ['id', 'institution', 'name', 'dean_name', 'departments']
        read_only_fields = ['id', 'institution']

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'short_name', 'type', 'location', 'logo_url', 'primary_color', 'created_at']
        read_only_fields = ['id', 'created_at']

class InstitutionRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new institution along with an admin user.
    """
    admin_email = serializers.EmailField(write_only=True)
    admin_username = serializers.CharField(write_only=True)
    admin_password = serializers.CharField(write_only=True)
    admin_first_name = serializers.CharField(write_only=True)
    admin_last_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = Institution
        fields = ['id', 'name', 'short_name', 'type', 'location', 'logo_url', 'primary_color', 
                  'admin_email', 'admin_username', 'admin_password', 'admin_first_name', 'admin_last_name']
        read_only_fields = ['id']

    def create(self, validated_data):
        from accounts.models import User, OfficerProfile
        
        # Extract admin data
        admin_data = {
            'email': validated_data.pop('admin_email'),
            'username': validated_data.pop('admin_username'),
            'password': validated_data.pop('admin_password'),
            'first_name': validated_data.pop('admin_first_name'),
            'last_name': validated_data.pop('admin_last_name'),
        }
        
        # Create Institution
        institution = Institution.objects.create(**validated_data)
        
        # Create Admin User
        user = User.objects.create_user(
            username=admin_data['username'],
            email=admin_data['email'],
            password=admin_data['password'],
            first_name=admin_data['first_name'],
            last_name=admin_data['last_name'],
            role=User.Role.INSTITUTION_ADMIN
        )
        
        # Create Officer Profile (as Admin)
        OfficerProfile.objects.create(
            user=user,
            institution=institution,
            office_type='REGISTRY', 
            is_active=True
        )
        
        return institution
