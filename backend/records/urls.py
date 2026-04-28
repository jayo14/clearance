from django.urls import path
from .views import (
    StudentClearanceRecordView, DocumentUploadView, DocumentRequirementListView, 
    SubmitClearanceView, OfficerClearanceListView, OfficerClearanceDetailView,
    ConfirmSubmissionView, GlobalStudentSearchView
)

urlpatterns = [
    path('requirements/', DocumentRequirementListView.as_view(), name='document-requirements'),
    path('my-record/', StudentClearanceRecordView.as_view(), name='student-clearance-record'),
    path('upload-document/', DocumentUploadView.as_view(), name='document-upload'),
    path('submit-clearance/', SubmitClearanceView.as_view(), name='submit-clearance'),
    path('officer/list/', OfficerClearanceListView.as_view(), name='officer-clearance-list'),
    path('officer/detail/<int:pk>/', OfficerClearanceDetailView.as_view(), name='officer-clearance-detail'),
    path('confirm-submission/', ConfirmSubmissionView.as_view(), name='confirm-submission'),
    path('search-students/', GlobalStudentSearchView.as_view(), name='search-students'),
]
