from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from institutions.models import Institution, College, Department
import uuid

class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'STUDENT', _('Student')
        OFFICER = 'OFFICER', _('Officer')
        INSTITUTION_ADMIN = 'INSTITUTION_ADMIN', _('Institution Admin')
        SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin')

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )
    
    # Common fields
    phone = models.CharField(max_length=15, blank=True, null=True)
    qualifications = models.CharField(max_length=255, blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=255, blank=True, null=True)
    jamb_number = models.CharField(max_length=12, unique=True)
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True)
    college_entity = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True)
    department_entity = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    
    course = models.CharField(max_length=255, blank=True, null=True)
    admission_year = models.CharField(max_length=4, blank=True, null=True)
    passport_photo_url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Student: {self.full_name or self.user.username} - {self.jamb_number}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

class OfficerProfile(models.Model):
    OFFICE_TYPES = [
        ('ADMISSIONS', 'Admissions'),
        ('MEDICAL', 'Medical'),
        ('DEPARTMENT', 'Department'),
        ('REGISTRY', 'Registry'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='officer_profile')
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True)
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    office_type = models.CharField(max_length=20, choices=OFFICE_TYPES)
    is_active = models.BooleanField(default=True)
    is_onboarded = models.BooleanField(default=False)

    def __str__(self):
        return f"Officer: {self.user.username} - {self.office_type}"

class Invitation(models.Model):
    email = models.EmailField()
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    role = models.CharField(max_length=20, choices=User.Role.choices)
    office_type = models.CharField(max_length=20, choices=OfficerProfile.OFFICE_TYPES, default='REGISTRY')
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Invitation for {self.email} ({self.role})"