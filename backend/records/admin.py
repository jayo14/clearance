from django.contrib import admin
from .models import ClearanceRecord, ClearanceItem, Document, DocumentRequirement

@admin.register(DocumentRequirement)
class DocumentRequirementAdmin(admin.ModelAdmin):
    list_display = ('office_type', 'label', 'document_type', 'is_required', 'max_file_size')
    list_filter = ('office_type', 'is_required')
    search_fields = ('label', 'document_type', 'description')
    ordering = ('office_type', 'label')

@admin.register(ClearanceRecord)
class ClearanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'student', 'overall_status', 'created_at', 'updated_at')
    list_filter = ('overall_status', 'created_at')
    search_fields = ('student__username', 'student__email', 'student__student_profile__full_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-updated_at',)

@admin.register(ClearanceItem)
class ClearanceItemAdmin(admin.ModelAdmin):
    list_display = ('record', 'office_type', 'status', 'assigned_officer', 'reviewed_at', 'updated_at')
    list_filter = ('office_type', 'status', 'reviewed_at')
    search_fields = ('record__student__username', 'officer_comments')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-updated_at',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('document_type', 'clearance_item', 'file_name', 'file_size', 'is_verified', 'upload_date')
    list_filter = ('document_type', 'is_verified', 'upload_date')
    search_fields = ('file_name', 'document_type', 'clearance_item__record__student__username')
    readonly_fields = ('upload_date',)
    ordering = ('-upload_date',)
