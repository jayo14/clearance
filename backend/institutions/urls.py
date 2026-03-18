from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstitutionViewSet, CollegeViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'institutions', InstitutionViewSet)
router.register(r'colleges', CollegeViewSet, basename='college')
router.register(r'departments', DepartmentViewSet, basename='department')

urlpatterns = [
    path('', include(router.urls)),
]
