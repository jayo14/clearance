import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { AppNotification } from '../types';
import { notificationService } from '../services/notificationService';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { currentUser } = useAuth();

  const refreshNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
        const data = await notificationService.getNotifications();
        setNotifications(data.map(notificationService.transformNotification));
    } catch (err) {
        console.error('Failed to fetch notifications:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshNotifications();
    // Poll every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addToast = (type: ToastType, message: string, title?: string, duration = 5000) => {
    switch (type) {
        case 'success':
            toast.success(title || 'Success', { description: message, duration });
            break;
        case 'error':
            toast.error(title || 'Error', { description: message, duration });
            break;
        case 'warning':
            toast.warning(title || 'Warning', { description: message, duration });
            break;
        case 'info':
            toast.info(title || 'Info', { description: message, duration });
            break;
        default:
            toast(title || 'Notification', { description: message, duration });
    }
  };

  const removeToast = (id: string) => {
     toast.dismiss(id);
  };
  const markAsRead = async (id: string) => {
    try {
        await notificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
        console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
        console.error('Failed to mark all as read:', err);
    }
  };

  const sendTestNotification = async () => {
    try {
        await notificationService.sendTestNotification();
        await refreshNotifications();
    } catch (err) {
        console.error('Failed to send test notification:', err);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addToast,
      removeToast,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};