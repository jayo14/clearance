from rest_framework import serializers
from .models import Notification, PushSubscription

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'category', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']

class PushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushSubscription
        fields = ['endpoint', 'p256dh', 'auth']

    def create(self, validated_data):
        user = self.context['request'].user
        subscription, created = PushSubscription.objects.update_or_create(
            endpoint=validated_data['endpoint'],
            defaults={
                'user': user,
                'p256dh': validated_data['p256dh'],
                'auth': validated_data['auth']
            }
        )
        return subscription
