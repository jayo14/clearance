from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, PushSubscriptionViewSet

router = DefaultRouter()
router.register(r'push-subscribe', PushSubscriptionViewSet, basename='push-subscription')
router.register(r'', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
