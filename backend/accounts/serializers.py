from rest_framework import serializers
from .models import User, StudentProfile, OfficerProfile, Invitation
from institutions.models import Institution, College, Department

class StudentProfileSerializer(serializers.ModelSerializer):
    institution_id = serializers.PrimaryKeyRelatedField(
        source='institution', 
        queryset=Institution.objects.all(),
        required=False, 
        allow_null=True
    )
    college_id = serializers.PrimaryKeyRelatedField(
        source='college_entity', 
        queryset=College.objects.all(),
        required=False, 
        allow_null=True
    )
    department_id = serializers.PrimaryKeyRelatedField(
        source='department_entity', 
        queryset=Department.objects.all(),
        required=False, 
        allow_null=True
    )

    class Meta:
        model = StudentProfile
        fields = [
            'full_name', 'jamb_number', 'institution_id', 'college_id', 'department_id',
            'course', 'admission_year', 'passport_photo_url'
        ]
        read_only_fields = ['jamb_number', 'institution_id', 'college_id', 'department_id', 'course', 'admission_year']

class OfficerProfileSerializer(serializers.ModelSerializer):
    institution_id = serializers.PrimaryKeyRelatedField(
        source='institution', 
        queryset=Institution.objects.all(),
        required=False, 
        allow_null=True
    )
    college_id = serializers.PrimaryKeyRelatedField(
        source='college', 
        queryset=College.objects.all(),
        required=False, 
        allow_null=True
    )
    department_id = serializers.PrimaryKeyRelatedField(
        source='department', 
        queryset=Department.objects.all(),
        required=False, 
        allow_null=True
    )

    class Meta:
        model = OfficerProfile
        fields = ['institution_id', 'college_id', 'department_id', 'office_type', 'is_active', 'is_onboarded']

class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(required=False)
    officer_profile = OfficerProfileSerializer(read_only=True)
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'name',
            'role', 'phone', 'qualifications', 'is_email_verified',
            'student_profile', 'officer_profile', 'last_login'
        ]
        read_only_fields = ['id', 'username', 'role', 'is_email_verified', 'last_login', 'name']

    def get_name(self, obj):
        if obj.role == 'STUDENT' and hasattr(obj, 'student_profile') and obj.student_profile.full_name:
            return obj.student_profile.full_name
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

    def update(self, instance, validated_data):
        student_profile_data = validated_data.pop('student_profile', None)
        
        # Update User fields
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        # Update StudentProfile fields if applicable
        if student_profile_data and hasattr(instance, 'student_profile'):
            profile = instance.student_profile
            profile.full_name = student_profile_data.get('full_name', profile.full_name)
            # Add other updateable profile fields here
            profile.save()

        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class AdminRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=User.Role.INSTITUTION_ADMIN
        )
        return user

class InvitationSerializer(serializers.ModelSerializer):
    institution = serializers.PrimaryKeyRelatedField(queryset=Institution.objects.all())
    college = serializers.PrimaryKeyRelatedField(queryset=College.objects.all(), required=False, allow_null=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=False, allow_null=True)
    
    class Meta:
        model = Invitation
        fields = ['email', 'institution', 'college', 'department', 'role', 'office_type']
        read_only_fields = ['token', 'invited_by', 'created_at', 'is_used']

class OnboardOfficerSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    qualifications = serializers.CharField()
    phone = serializers.CharField(required=False)

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)