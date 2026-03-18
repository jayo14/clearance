from django.contrib import admin
from .models import Institution, College, Department

@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_name', 'type', 'location', 'created_at')
    search_fields = ('name', 'short_name')
    list_filter = ('type',)

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'institution', 'dean_name')
    search_fields = ('name', 'institution__name')
    list_filter = ('institution',)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'college', 'hod_name')
    search_fields = ('name', 'college__name')
    list_filter = ('college__institution', 'college')