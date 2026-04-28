from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile, OfficerProfile, Invitation

class UserAccountAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'phone', 'qualifications', 'is_email_verified')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'phone')}),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'jamb_number', 'institution', 'college_entity', 'department_entity')
    search_fields = ('full_name', 'jamb_number', 'user__username', 'user__email')
    list_filter = ('institution', 'college_entity')

@admin.register(OfficerProfile)
class OfficerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'office_type', 'is_active', 'is_onboarded')
    search_fields = ('user__username', 'user__email')
    list_filter = ('office_type', 'institution', 'is_active', 'is_onboarded')

@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('email', 'role', 'office_type', 'institution', 'is_used', 'created_at')
    search_fields = ('email', 'token')
    list_filter = ('role', 'office_type', 'is_used', 'institution')
    readonly_fields = ('token', 'created_at')

admin.site.register(User, UserAccountAdmin)
