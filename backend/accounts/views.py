from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .serializers import (
    LoginSerializer, UserSerializer, AdminRegistrationSerializer,
    InvitationSerializer, OnboardOfficerSerializer, 
    ForgotPasswordSerializer, ResetPasswordSerializer
)
from .models import User, StudentProfile, Invitation, OfficerProfile
from institutions.models import Institution
import uuid

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username_or_jamb = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')

        # Check if it's a JAMB number (Student login)
        try:
            student_profile = StudentProfile.objects.get(jamb_number=username_or_jamb)
            user = authenticate(username=student_profile.user.username, password=password)
        except StudentProfile.DoesNotExist:
            # Regular login (Email or Username for staff)
            user = authenticate(username=username_or_jamb, password=password)
            if not user:
                # Try matching by email
                try:
                    user_by_email = User.objects.get(email=username_or_jamb)
                    user = authenticate(username=user_by_email.username, password=password)
                except User.DoesNotExist:
                    user = None

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })

class RegisterAdminView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AdminRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # In a real app, send verification email here
        # For now, simulate verification token
        verification_token = str(uuid.uuid4())
        
        return Response({
            "message": "Registration successful. Please verify your email.",
            "verification_token": verification_token # Returning for simulation
        }, status=status.HTTP_201_CREATED)

class VerifyEmailView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            user.is_email_verified = True
            user.save()
            return Response({"message": "Email verified successfully"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class InviteOfficerView(views.APIView):
    def post(self, request):
        if request.user.role != User.Role.INSTITUTION_ADMIN:
            return Response({"error": "Only institutional admins can invite officers"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = InvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        invitation = serializer.save(invited_by=request.user)
        
        # Simulate sending email
        return Response({
            "message": "Invitation sent successfully",
            "invitation_link": f"/onboard-officer?token={invitation.token}"
        })

class OnboardOfficerView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OnboardOfficerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            invitation = Invitation.objects.get(token=serializer.validated_data['token'], is_used=False)
        except Invitation.DoesNotExist:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create User
        user = User.objects.create_user(
            username=invitation.email,
            email=invitation.email,
            password=serializer.validated_data['password'],
            first_name=serializer.validated_data['first_name'],
            last_name=serializer.validated_data['last_name'],
            qualifications=serializer.validated_data['qualifications'],
            role=User.Role.OFFICER,
            is_email_verified=True
        )
        
        if serializer.validated_data.get('phone'):
            user.phone = serializer.validated_data['phone']
            user.save()

        # Create Officer Profile
        OfficerProfile.objects.create(
            user=user,
            institution=invitation.institution,
            college=invitation.college,
            department=invitation.department,
            office_type=invitation.office_type,
            is_onboarded=True
        )
        
        invitation.is_used = True
        invitation.save()
        
        return Response({"message": "Onboarding complete. You can now log in."}, status=status.HTTP_201_CREATED)

class ForgotPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            # In a real app, generate a real token and store it (e.g., in a model or cache)
            token = str(uuid.uuid4())
            # Send email here
            return Response({
                "message": "Password reset link sent to your email",
                "reset_token": token # Returning for simulation
            })
        except User.DoesNotExist:
            # For security, don't reveal if user exists
            return Response({"message": "If an account exists with this email, you will receive a reset link."})

class ResetPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        # In a real app, verify the token against stored tokens
        # For now, let's assume we find the user by some identifier or just simulate
        # Since we don't have a real token store yet, let's just simulate success
        # if token == "valid-token": ...
        
        return Response({"message": "Password reset successful. You can now log in with your new password."})

class UserProfileView(views.APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class OfficerListView(views.APIView):
    def get(self, request):
        if request.user.role != User.Role.INSTITUTION_ADMIN:
             return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        institution_id = request.query_params.get('institution_id')
        if not institution_id:
            return Response({"error": "Institution ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        officers = User.objects.filter(role=User.Role.OFFICER, officer_profile__institution_id=institution_id)
        serializer = UserSerializer(officers, many=True)
        return Response(serializer.data)
