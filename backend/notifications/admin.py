from django.contrib import admin
from .models import Notification, PushSubscription

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'notification_type', 'category', 'is_read', 'created_at')
    list_filter = ('notification_type', 'category', 'is_read', 'created_at')
    search_fields = ('user__username', 'title', 'message')
    readonly_fields = ('created_at',)

@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'endpoint', 'created_at')
    search_fields = ('user__username', 'endpoint')
    readonly_fields = ('created_at',)
