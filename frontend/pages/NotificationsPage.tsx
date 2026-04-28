import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle, AlertCircle, Info, Clock,
  Trash2, MailOpen, ArrowLeft, Search, Filter,
  ChevronRight, Star, MoreVertical
} from 'lucide-react';
import { AppNotification } from '../types';
import { Card, Button, PageHeader, LoadingSpinner } from '../components/UI';
import { notificationService } from '../services/notificationService';

interface Props {
  onNavigate: (view: any) => void;
}

export default function NotificationsPage({ onNavigate }: Props) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');

  const fetchNotifications = async () => {
    try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
    } catch (err) {
        console.error('Failed to fetch notifications:', err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
      try {
          await notificationService.markAsRead(id);
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      } catch (err) {
          console.error('Failed to mark as read:', err);
      }
  };

  const deleteNotification = async (id: string) => {
      if (confirm("Delete this notification?")) {
          try {
              await notificationService.deleteNotification(id);
              setNotifications(prev => prev.filter(n => n.id !== id));
          } catch (err) {
              console.error('Failed to delete notification:', err);
          }
      }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
      if (filter === 'unread') return !n.isRead;
      return true;
  });

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 pb-12">
      <PageHeader 
        title="Notifications"
        breadcrumbs={['Dashboard', 'Notifications']}
        actions={
            <Button variant="outline" size="sm" onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}>
                Mark all as read
            </Button>
        }
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-2">
            {[
                { id: 'all', label: 'All Notifications', icon: Bell, count: notifications.length },
                { id: 'unread', label: 'Unread', icon: MailOpen, count: notifications.filter(n => !n.isRead).length },
                { id: 'important', label: 'Important', icon: Star, count: 0 },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setFilter(item.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm ${
                        filter === item.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        {item.label}
                    </div>
                    {item.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === item.id ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                            {item.count}
                        </span>
                    )}
                </button>
            ))}
        </aside>

        {/* Notifications List */}
        <div className="lg:col-span-3 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">
                    <Filter size={16} /> Filtered by: {filter}
                </div>
                <div className="relative group">
                    <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                        <MoreVertical size={20} className="text-muted-foreground" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-12 flex justify-center"><LoadingSpinner text="Fetching notifications..." /></div>
            ) : filteredNotifications.length === 0 ? (
                <Card className="p-20 text-center flex flex-col items-center border-none bg-muted/30">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 opacity-40">
                        <Bell size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">No notifications found</h3>
                    <p className="text-muted-foreground mt-2">When you have updates, they'll appear here.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((n) => (
                        <Card
                            key={n.id}
                            className={`p-0 overflow-hidden transition-all hover:shadow-md border-border ${!n.isRead ? 'border-l-4 border-l-primary' : ''}`}
                        >
                            <div className="flex items-start gap-4 p-5">
                                <div className="mt-1 p-2 bg-muted rounded-xl shrink-0">
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <h4 className={`font-bold text-foreground ${!n.isRead ? 'text-primary' : ''}`}>{n.title}</h4>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap flex items-center gap-1">
                                            <Clock size={10} /> {new Date(n.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                        {n.message}
                                    </p>

                                    <div className="flex items-center gap-4 mt-4">
                                        {n.actionLabel && (
                                            <Button size="sm" variant="secondary" onClick={() => onNavigate('status')}>
                                                {n.actionLabel}
                                            </Button>
                                        )}
                                        {!n.isRead && (
                                            <button
                                                onClick={() => markAsRead(n.id)}
                                                className="text-[10px] font-black uppercase text-primary hover:underline tracking-widest"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(n.id)}
                                            className="text-[10px] font-black uppercase text-muted-foreground hover:text-red-500 transition-colors tracking-widest ml-auto"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
