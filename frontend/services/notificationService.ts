import { AppNotification } from '../types';

const API_URL = 'http://localhost:8000/api/notifications';

export const notificationService = {
    getToken() {
        return localStorage.getItem('auth_token');
    },

    async getNotifications(): Promise<any[]> {
        const response = await fetch(`${API_URL}/`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        return await response.json();
    },

    async markAsRead(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/${id}/mark_as_read/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to mark notification as read');
        }
    },

    async markAllAsRead(): Promise<void> {
        const response = await fetch(`${API_URL}/mark_all_as_read/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to mark all notifications as read');
        }
    },

    async sendTestNotification(): Promise<void> {
        const response = await fetch(`${API_URL}/send_test_notification/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to send test notification');
        }
    },

    async subscribePush(subscription: any): Promise<void> {
        const response = await fetch(`${API_URL}/push-subscribe/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')) as any)),
                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')) as any)),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to subscribe to push notifications');
        }
    },

    transformNotification(backendNotif: any): AppNotification {
        return {
            id: backendNotif.id.toString(),
            type: backendNotif.notification_type,
            category: backendNotif.category,
            title: backendNotif.title,
            message: backendNotif.message,
            timestamp: backendNotif.created_at,
            isRead: backendNotif.is_read,
        };
    }
};
