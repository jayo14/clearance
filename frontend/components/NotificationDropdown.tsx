
import React, { useRef, useState, useEffect } from 'react';
import { Bell, Check, Trash2, X, ChevronRight, Inbox } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { AppNotification } from '../types';
import { StatusBadge, Button } from './UI';

interface Props {
  onNavigate: (view: string) => void;
}

export const NotificationDropdown = ({ onNavigate }: Props) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link) {
      // Parse link if needed, for simplicity passing exact string or mapping
      // Assuming onNavigate handles internal route strings like '/status' or 'status'
      const view = notif.link.replace('/', '');
      // Very basic routing assumption for demo:
      if (view.includes('office')) {
          onNavigate('office'); // In real app, would pass ID
      } else {
          onNavigate(view);
      }
      setIsOpen(false);
    }
  };

  const groupNotifications = (notifs: AppNotification[]) => {
    const groups: { [key: string]: AppNotification[] } = {
      'Today': [],
      'Yesterday': [],
      'Older': []
    };

    notifs.forEach(n => {
      const date = new Date(n.timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        groups['Today'].push(n);
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups['Yesterday'].push(n);
      } else {
        groups['Older'].push(n);
      }
    });

    return groups;
  };

  const grouped = groupNotifications(notifications.slice(0, 10)); // Show max 10 in dropdown

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return 'bg-primary/20 text-primary';
          case 'error': return 'bg-red-100 text-red-600';
          case 'warning': return 'bg-amber-100 text-amber-600';
          default: return 'bg-blue-100 text-primary';
      }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-full relative transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            isOpen ? 'bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-400' : 'text-muted-foreground dark:text-muted-foreground hover:bg-slate-100 hover:bg-accent'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card dark:bg-secondary rounded-xl shadow-xl border border-border dark:border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 origin-top-right">
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-border bg-muted/50 dark:bg-slate-950/30">
            <div>
                <h3 className="font-bold text-sm text-foreground dark:text-white">Notifications</h3>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
                <button 
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                    <Check size={12} /> Mark all read
                </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground/80 mb-2">
                        <Inbox size={24} />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
                </div>
            ) : (
                Object.entries(grouped).map(([label, items]) => (
                    items.length > 0 && (
                        <div key={label}>
                            <div className="px-4 py-2 bg-muted dark:bg-secondary/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider sticky top-0 backdrop-blur-sm border-y border-border dark:border-border/50">
                                {label}
                            </div>
                            <div>
                                {items.map(notif => (
                                    <div 
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-4 border-b border-border dark:border-border hover:bg-muted hover:bg-accent/50 cursor-pointer transition-colors relative group ${!notif.isRead ? 'bg-primary/10/30 dark:bg-blue-900/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-primary/100' : 'bg-transparent'}`}></div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-sm ${!notif.isRead ? 'font-bold text-foreground dark:text-white' : 'font-medium text-foreground/80 dark:text-muted-foreground/80'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                        {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground dark:text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                {notif.actionLabel && (
                                                    <span className="inline-block mt-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-blue-100 dark:border-blue-900/30">
                                                        {notif.actionLabel}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))
            )}
          </div>

          <div className="p-2 border-t border-border dark:border-border bg-muted/50 dark:bg-slate-950/30">
            <button 
                onClick={() => { setIsOpen(false); onNavigate('notifications'); }}
                className="w-full py-2 text-xs font-bold text-muted-foreground dark:text-muted-foreground/80 hover:bg-card hover:bg-accent rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm border border-border"
            >
                View Full History <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
