
import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { PageHeader, Button, Card } from '../components/UI';
import { 
  Bell, Check, Trash2, Filter, Search, Inbox, 
  CheckCircle, AlertTriangle, AlertCircle, Info, ExternalLink
} from 'lucide-react';

interface Props {
    onNavigate?: (view: string) => void;
}

export default function NotificationsPage({ onNavigate }: Props) {
  const { notifications, markAsRead, markAllAsRead, clearAllNotifications } = useNotification();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [search, setSearch] = useState('');

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
        filter === 'ALL' ? true : 
        filter === 'UNREAD' ? !n.isRead : 
        n.isRead;
    
    const matchesSearch = 
        n.title.toLowerCase().includes(search.toLowerCase()) || 
        n.message.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
          case 'error': return <AlertCircle size={20} className="text-red-500" />;
          case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
          default: return <Info size={20} className="text-primary" />;
      }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <PageHeader 
          title="Notifications" 
          breadcrumbs={['Dashboard', 'Notifications']}
          onBreadcrumbClick={(index: number) => {
              if (index === 0 && onNavigate) onNavigate('dashboard');
          }}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex bg-slate-100 dark:bg-secondary p-1 rounded-xl w-full md:w-auto">
              {['ALL', 'UNREAD', 'READ'].map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setFilter(tab as any)}
                      className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                          filter === tab 
                          ? 'bg-card bg-muted text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground/80 dark:hover:text-muted-foreground/80'
                      }`}
                  >
                      {tab}
                  </button>
              ))}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                      type="text" 
                      placeholder="Search notifications..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
              <Button size="sm" variant="outline" onClick={markAllAsRead} title="Mark all as read">
                  <Check size={16} /> <span className="hidden sm:inline">Read All</span>
              </Button>
              <Button size="sm" variant="outline" onClick={clearAllNotifications} title="Clear history" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                  <Trash2 size={16} />
              </Button>
          </div>
      </div>

      <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground/80">
                      <Inbox size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No notifications found</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
              </div>
          ) : (
              filteredNotifications.map(notif => (
                  <Card 
                      key={notif.id} 
                      className={`flex gap-4 p-5 transition-all hover:shadow-md ${!notif.isRead ? 'border-l-4 border-l-blue-500 bg-primary/10/20 dark:bg-blue-900/5' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                  >
                      <div className="mt-1 shrink-0 bg-card bg-muted p-2 rounded-full shadow-sm border border-border dark:border-slate-700 h-fit">
                          {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-base ${!notif.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                                  {notif.title}
                              </h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                  {new Date(notif.timestamp).toLocaleString()}
                              </span>
                          </div>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground leading-relaxed mb-3 max-w-3xl">
                              {notif.message}
                          </p>
                          
                          <div className="flex gap-2">
                              {notif.actionLabel && (
                                  <Button size="sm" variant="primary" className="h-8 text-xs">
                                      {notif.actionLabel}
                                  </Button>
                              )}
                              {notif.link && (
                                  <Button size="sm" variant="outline" className="h-8 text-xs">
                                      View Details <ExternalLink size={12} className="ml-1" />
                                  </Button>
                              )}
                          </div>
                      </div>
                      {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary/100 shrink-0 self-center"></div>
                      )}
                  </Card>
              ))
          )}
      </div>
    </div>
  );
}
