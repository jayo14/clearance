import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Card, Button } from '../../components/UI';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Bell, Shield, HelpCircle, Smartphone, Mail, 
  Camera, AlertTriangle, FileText, MessageSquare, LogOut, Check, Loader2
} from 'lucide-react';

interface Props {
  student: Student;
}

type TabID = 'profile' | 'notifications' | 'privacy' | 'help';

export const Settings = ({ student }: Props) => {
  const [activeTab, setActiveTab] = useState<TabID>('profile');
  const { addToast, sendTestNotification } = useNotification();
  const { updateProfile } = useAuth();
  const [isDirty, setIsDirty] = useState(false);

  // Profile State
  const [phone, setPhone] = useState(student.phone || '');
  const [email, setEmail] = useState(student.email || '');
  const [isSaving, setIsSaving] = useState(false);

  // Notification State
  const [emailNotifs, setEmailNotifs] = useState({
    approved: true,
    rejected: true,
    complete: true,
    system: true
  });
  const [frequency, setFrequency] = useState('instant');

  useEffect(() => {
    setPhone(student.phone || '');
    setEmail(student.email || '');
  }, [student]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
        await updateProfile({
            phone,
            email,
        });
        setIsDirty(false);
        addToast('success', 'Profile updated successfully');
    } catch (err: any) {
        addToast('error', err.message || 'Failed to update profile');
    } finally {
        setIsSaving(false);
    }
  };

  const handleNotifToggle = (key: keyof typeof emailNotifs) => {
      setEmailNotifs(prev => ({ ...prev, [key]: !prev[key] }));
      addToast('info', 'Preference updated');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-1/4 shrink-0">
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible bg-card rounded-xl border border-border p-1.5 lg:p-2 sticky top-24 shadow-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabID)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap lg:whitespace-normal ${
                            activeTab === tab.id 
                            ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20' 
                            : 'text-muted-foreground dark:text-muted-foreground hover:bg-muted hover:bg-accent'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-6">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in">
                    {/* Passport Section */}
                    <Card>
                        <h3 className="font-bold text-foreground mb-6 border-b border-border pb-2">Passport Photograph</h3>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group shrink-0">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border shadow-inner">
                                    {student.passport_photo_url ? (
                                        <img src={student.passport_photo_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-2xl">
                                            {student.full_name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg border-2 border-white dark:border-slate-900">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <p className="font-medium text-foreground">Clearance Photo</p>
                                <p className="text-xs text-muted-foreground max-w-sm mx-auto sm:mx-0 leading-relaxed">
                                    This photo will appear on your final clearance certificate. Ensure it is a recent passport-style photo with a white background.
                                    <br/><span className="font-semibold">Max 5MB (JPG/PNG)</span>
                                </p>
                                <Button variant="outline" size="sm" className="mt-2">Upload New Photo</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Personal Info (Read Only) */}
                    <Card>
                        <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
                            <h3 className="font-bold text-foreground">Personal Information</h3>
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-[10px] uppercase font-bold rounded border border-border">Read Only</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Full Name', value: student.full_name },
                                { label: 'JAMB Reg. Number', value: student.jamb_number },
                                { label: 'Admission Year', value: student.admission_year },
                                { label: 'Course', value: student.course },
                            ].map((field, i) => (
                                <div key={i}>
                                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">{field.label}</label>
                                    <div className="w-full p-2.5 bg-background/30 border border-border rounded-lg text-sm text-foreground/80 font-medium cursor-not-allowed select-all">
                                        {field.value || '---'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-3 bg-primary/10 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg text-xs text-primary flex gap-2 items-start">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            <span>To update these details, please contact the Admissions Office directly with supporting documents (Birth Certificate, JAMB Slip).</span>
                        </div>
                    </Card>

                    {/* Contact Preferences */}
                    <Card>
                        <h3 className="font-bold text-foreground mb-6 border-b border-border pb-2">Contact Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Preferred Phone</label>
                                <div className="relative">
                                    <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input 
                                        type="tel" 
                                        value={phone} 
                                        onChange={(e) => { setPhone(e.target.value); setIsDirty(true); }}
                                        className="w-full pl-9 p-2.5 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Preferred Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => { setEmail(e.target.value); setIsDirty(true); }}
                                        className="w-full pl-9 p-2.5 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-border">
                            <Button onClick={handleSaveProfile} disabled={isSaving || !isDirty}>
                                {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in">
                    <Card>
                        <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
                            <h3 className="font-bold text-foreground">Email Notifications</h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => addToast('success', 'All notifications enabled')}>Enable All</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { key: 'approved', label: 'Document approved', desc: 'Get notified when an officer approves a document.' },
                                { key: 'rejected', label: 'Document rejected', desc: 'Get notified immediately if a document is rejected.' },
                                { key: 'complete', label: 'Clearance complete', desc: 'Receive an email when you are fully cleared.' },
                                { key: 'system', label: 'System announcements', desc: 'Maintenance and deadline alerts.' }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 hover:bg-muted hover:bg-accent rounded-lg transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-foreground/80">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={emailNotifs[item.key as keyof typeof emailNotifs]} 
                                            onChange={() => handleNotifToggle(item.key as keyof typeof emailNotifs)} 
                                        />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-foreground mb-4 border-b border-border pb-2">Notification Frequency</h3>
                        <div className="space-y-2">
                            {[
                                { id: 'instant', label: 'Instant (Recommended)', desc: 'Receive emails as soon as events happen.' },
                                { id: 'daily', label: 'Daily Digest', desc: 'One email per day with all updates.' },
                                { id: 'weekly', label: 'Weekly Summary', desc: 'One email per week (not recommended for clearance).' }
                            ].map((opt) => (
                                <label key={opt.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${frequency === opt.id ? 'border-primary bg-primary/10 dark:bg-blue-900/10' : 'border-border hover:bg-muted hover:bg-accent'}`}>
                                    <input 
                                        type="radio" 
                                        name="frequency" 
                                        checked={frequency === opt.id}
                                        onChange={() => { setFrequency(opt.id); addToast('info', 'Frequency updated'); }}
                                        className="w-4 h-4 text-primary" 
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-foreground dark:text-foreground/80 block">{opt.label}</span>
                                        <span className="text-xs text-muted-foreground block">{opt.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                            <Button size="sm" variant="secondary" onClick={sendTestNotification}>Send Test Notification</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'privacy' && (
                <div className="space-y-6 animate-in fade-in">
                    <Card>
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-primary" /> Data Privacy
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-4 leading-relaxed">
                            Your data is collected solely for the purpose of academic clearance and record-keeping in accordance with university regulations. 
                            We retain your clearance records for 10 years after graduation. Access is restricted to authorized personnel only.
                        </p>
                        <Button variant="outline" size="sm">Download Personal Data Report</Button>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-foreground mb-4">Active Sessions</h3>
                        <div className="space-y-3">
                            {[
                                { device: 'Chrome on Windows', loc: 'Lagos, NG', time: 'Current Session', active: true },
                                { device: 'Safari on iPhone', loc: 'Lagos, NG', time: 'Active 2 hours ago', active: false },
                            ].map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${session.active ? 'bg-primary/100' : 'bg-slate-300'}`}></div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{session.device}</p>
                                            <p className="text-xs text-muted-foreground">{session.loc} • {session.time}</p>
                                        </div>
                                    </div>
                                    {!session.active && (
                                        <button className="text-xs text-red-600 hover:underline font-medium">Revoke</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 border-red-200">
                            Log Out All Devices
                        </Button>
                    </Card>

                    <Card className="border-red-100 dark:border-red-900/30">
                        <h3 className="font-bold text-red-600 mb-2 flex items-center gap-2"><LogOut size={18} /> Delete Account</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Requesting account deletion will remove all your uploaded documents. This action cannot be undone and may significantly delay your graduation or NYSC mobilization.
                        </p>
                        <Button variant="danger">Request Account Deletion</Button>
                    </Card>
                </div>
            )}

            {/* HELP TAB */}
            {activeTab === 'help' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: FileText, label: 'User Guide', desc: 'Download PDF manual' },
                            { icon: MessageSquare, label: 'FAQs', desc: 'Common questions' },
                            { icon: AlertTriangle, label: 'Report a Bug', desc: 'System issues' },
                            { icon: Mail, label: 'Contact Support', desc: 'Get help' },
                        ].map((item, i) => (
                            <Card key={i} className="hover:shadow-md transition-all cursor-pointer group hover:border-blue-300 dark:hover:border-blue-700">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 dark:group-hover:bg-blue-900/20 group-hover:text-primary transition-colors">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{item.label}</h4>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <h3 className="font-bold text-foreground mb-4">Submit Feedback</h3>
                        <textarea 
                            className="w-full h-32 p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
                            placeholder="Tell us how we can improve your clearance experience..."
                        ></textarea>
                        <Button onClick={() => addToast('success', 'Thank you! Your feedback has been submitted.')}>
                            <Check size={16} /> Submit Feedback
                        </Button>
                    </Card>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};