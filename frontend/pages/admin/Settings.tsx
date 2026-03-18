import React, { useState, useEffect } from 'react';
import { AdminUser } from '../../types';
import { Card, Button, StatusBadge, LoadingSpinner } from '../../components/UI';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COLLEGES } from '../../services/mockData';
import { 
  User, Lock, Bell, Shield, BarChart2, Eye, Sun, Moon, Monitor, 
  CheckCircle, Calendar, Clock, LogOut, Smartphone, Loader2
} from 'lucide-react';

interface Props {
  user: AdminUser;
}

type TabID = 'profile' | 'display' | 'notifications' | 'performance' | 'security';

export const Settings = ({ user }: Props) => {
  const [activeTab, setActiveTab] = useState<TabID>('profile');
  const { addToast, sendTestNotification } = useNotification();
  const { updateProfile } = useAuth();
  const [theme, setTheme] = useState('system');
  const [isSaving, setIsSaving] = useState(false);

  // Profile State
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setName(user.name || '');
    setPhone(user.phone || '');
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'display', label: 'Display', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'performance', label: 'Performance', icon: BarChart2 },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
        await updateProfile({
            first_name: name.split(' ')[0] || '',
            last_name: name.split(' ').slice(1).join(' ') || '',
            phone,
        });
        setIsDirty(false);
        addToast('success', 'Profile updated successfully');
    } catch (err: any) {
        addToast('error', err.message || 'Failed to update profile');
    } finally {
        setIsSaving(false);
    }
  };

  // Fix: Access college name via lookup
  const collegeName = MOCK_COLLEGES.find(c => c.id === user.college_id)?.name || 'N/A';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Officer Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and workspace configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 shrink-0">
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible bg-card rounded-xl border border-border p-1.5 lg:p-2 sticky top-24 shadow-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabID)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap lg:whitespace-normal ${
                            activeTab === tab.id 
                            ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-6">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in">
                    <Card>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-sm">
                                {user?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">{user?.name || 'User'}</h3>
                                <p className="text-sm text-muted-foreground">{user?.role} • {collegeName}</p>
                                <button className="text-xs font-bold text-primary hover:underline mt-1">Upload New Picture</button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Display Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
                                    className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={phone} 
                                    onChange={(e) => { setPhone(e.target.value); setIsDirty(true); }}
                                    className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Office Responsibility</label>
                                <div className="w-full p-2.5 bg-background/30 border border-border rounded-lg text-sm text-foreground/80 font-medium cursor-not-allowed">
                                    {user.office_type}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-border">
                            <Button 
                                onClick={handleSaveProfile} 
                                disabled={isSaving || !isDirty}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <Lock size={18} /> Change Password
                        </h3>
                        <div className="space-y-4 max-w-md">
                            <input type="password" placeholder="Current Password" className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
                            <input type="password" placeholder="New Password" className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
                            <input type="password" placeholder="Confirm New Password" className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
                            
                            <div className="flex gap-1 h-1 mt-2">
                                <div className="flex-1 bg-destructive rounded-full"></div>
                                <div className="flex-1 bg-primary/50 rounded-full"></div>
                                <div className="flex-1 bg-muted rounded-full"></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Password strength: Medium</p>
                            
                            <Button variant="outline">Update Password</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in">
                    <Card>
                        <h3 className="font-bold text-foreground mb-4">Queue Alerts</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'New clearance submission', desc: 'Notify when a student submits documents' },
                                { label: 'Urgent clearance alert', desc: 'Notify when a submission is pending > 3 days' },
                                { label: 'Daily summary report', desc: 'Email digest of daily activities' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="text-xs text-muted-foreground cursor-pointer flex items-center"><input type="checkbox" className="mr-1.5 rounded text-primary focus:ring-primary" defaultChecked /> In-App</label>
                                        <label className="text-xs text-muted-foreground cursor-pointer flex items-center"><input type="checkbox" className="mr-1.5 rounded text-primary focus:ring-primary" defaultChecked /> Email</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-border">
                            <Button size="sm" variant="secondary" onClick={sendTestNotification}>Send Test Notification</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Processed', val: '1,248', icon: CheckCircle, color: 'text-primary bg-primary/100/10' },
                            { label: 'This Month', val: '142', icon:  Calendar, color: 'text-purple-600 bg-purple-500/10' },
                            { label: 'Approval Rate', val: '87%', icon:  BarChart2, color: 'text-primary bg-primary/100/10' },
                            { label: 'Avg Time', val: '4.2h', icon:  Clock, color: 'text-amber-600 bg-primary/50/10' },
                        ].map((stat, i) => (
                            <Card key={i} className="text-center p-4 border-l-4 border-l-transparent hover:border-l-primary transition-all">
                                <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <h4 className="text-2xl font-bold text-foreground">{stat.val}</h4>
                                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground">Two-Factor Authentication</h3>
                            <StatusBadge status="approved" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            2FA is currently enabled on your account via Authenticator App.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="outline">Disable 2FA</Button>
                            <Button variant="secondary">View Backup Codes</Button>
                        </div>
                    </Card>
                </div>
            )}

        </main>
      </div>
    </div>
  );
};