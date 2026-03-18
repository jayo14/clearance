from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification, PushSubscription
from .serializers import NotificationSerializer, PushSubscriptionSerializer

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

    @action(detail=False, methods=['post'])
    def send_test_notification(self, request):
        Notification.create(
            user=request.user,
            title="Test Notification",
            message="This is a test notification from the settings page.",
            notification_type='info',
            category='system'
        )
        return Response({'status': 'test notification sent'})

class PushSubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = PushSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['post', 'delete']

    def get_queryset(self):
        return PushSubscription.objects.filter(user=self.request.user)