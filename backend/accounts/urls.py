from django.urls import path
from .views import (
    LoginView, UserProfileView, RegisterAdminView, 
    VerifyEmailView, InviteOfficerView, OnboardOfficerView,
    ForgotPasswordView, ResetPasswordView, OfficerListView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('register-admin/', RegisterAdminView.as_view(), name='register-admin'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('invite-officer/', InviteOfficerView.as_view(), name='invite-officer'),
    path('onboard-officer/', OnboardOfficerView.as_view(), name='onboard-officer'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('list-officers/', OfficerListView.as_view(), name='list-officers'),
]
