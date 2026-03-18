from django.db import models
from django.conf import settings
from institutions.models import Institution, College, Department

class ClearanceStatus(models.TextChoices):
    EMPTY = 'empty', 'Not Started'
    PENDING = 'pending', 'Under Review'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'

class OverallStatus(models.TextChoices):
    NOT_STARTED = 'not_started', 'Not Started'
    IN_PROGRESS = 'in_progress', 'In Progress'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'

class OfficeType(models.TextChoices):
    ADMISSIONS = 'ADMISSIONS', 'Admissions'
    MEDICAL = 'MEDICAL', 'Medical'
    DEPARTMENT = 'DEPARTMENT', 'Department'

class DocumentRequirement(models.Model):
    office_type = models.CharField(max_length=20, choices=OfficeType.choices)
    document_type = models.CharField(max_length=100)
    label = models.CharField(max_length=255)
    is_required = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    accepted_formats = models.CharField(max_length=255, default='.pdf,.jpg,.jpeg,.png')
    max_file_size = models.IntegerField(default=5000000) # 5MB

    def __str__(self):
        return f"{self.office_type} - {self.label}"

class ClearanceRecord(models.Model):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clearance_record')
    overall_status = models.CharField(max_length=20, choices=OverallStatus.choices, default=OverallStatus.NOT_STARTED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Clearance: {self.student.username} ({self.overall_status})"

    @property
    def student_name(self):
        if hasattr(self.student, 'student_profile') and self.student.student_profile.full_name:
            return self.student.student_profile.full_name
        return f"{self.student.first_name} {self.student.last_name}".strip() or self.student.username

    def update_status(self):
        items = self.items.all()
        if not items:
            return

        if all(item.status == ClearanceStatus.APPROVED for item in items):
            self.overall_status = OverallStatus.APPROVED
        elif any(item.status in [ClearanceStatus.PENDING, ClearanceStatus.APPROVED, ClearanceStatus.REJECTED] for item in items):
            self.overall_status = OverallStatus.IN_PROGRESS
        else:
            self.overall_status = OverallStatus.NOT_STARTED
        self.save()

class ClearanceItem(models.Model):
    record = models.ForeignKey(ClearanceRecord, on_delete=models.CASCADE, related_name='items')
    office_type = models.CharField(max_length=20, choices=OfficeType.choices)
    status = models.CharField(max_length=20, choices=ClearanceStatus.choices, default=ClearanceStatus.EMPTY)
    assigned_officer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_clearances')
    officer_comments = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('record', 'office_type')

    def __str__(self):
        return f"{self.office_type} for {self.record.student.username}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if not is_new: # Only update record status if it's an existing item being updated
             self.record.update_status()

class Document(models.Model):
    clearance_item = models.ForeignKey(ClearanceItem, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=100) # e.g., JAMB_RESULT, BIRTH_CERT
    file = models.FileField(upload_to='clearance_documents/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField() # in bytes
    upload_date = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.document_type} - {self.clearance_item.record.student.username}"
