from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile, OfficerProfile

class UserAccountAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'phone')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'phone')}),
    )

admin.site.register(User, UserAccountAdmin)
admin.site.register(StudentProfile)
admin.site.register(OfficerProfile)