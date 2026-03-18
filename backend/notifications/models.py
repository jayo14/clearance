from django.db import models
from django.conf import settings

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        SUCCESS = 'success', 'Success'
        ERROR = 'error', 'Error'
        WARNING = 'warning', 'Warning'
        INFO = 'info', 'Info'

    class Category(models.TextChoices):
        SUBMISSION = 'submission', 'Submission'
        APPROVAL = 'approval', 'Approval'
        REJECTION = 'rejection', 'Rejection'
        SYSTEM = 'system', 'System'
        REMINDER = 'reminder', 'Reminder'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.INFO)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.SYSTEM)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"

    @staticmethod
    def create(user, title, message, notification_type='info', category='system'):
        return Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            category=category
        )

class PushSubscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='push_subscriptions')
    endpoint = models.URLField(max_length=500, unique=True)
    p256dh = models.CharField(max_length=255)
    auth = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Subscription for {self.user.username}"