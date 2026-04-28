import { AppNotification } from '../types';

const API_URL = '/api/notifications';

export const notificationService = {
    getToken() {
        return localStorage.getItem('auth_token');
    },

    async getNotifications(): Promise<AppNotification[]> {
        const response = await fetch(`${API_URL}/`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data = await response.json();
        return data.map((n: any) => ({
            id: n.id.toString(),
            type: n.notification_type,
            category: n.category,
            title: n.title,
            message: n.message,
            timestamp: n.created_at,
            isRead: n.is_read
        }));
    },

    async markAsRead(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/${id}/mark-read/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to mark notification as read');
    },

    async deleteNotification(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete notification');
    }
};
