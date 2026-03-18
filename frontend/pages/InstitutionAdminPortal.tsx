import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { Officer, Institution, College, Department, UserRole, OfficeType, ClearanceStatus } from '../types';
import { MOCK_INSTITUTIONS, MOCK_OFFICERS, MOCK_COLLEGES, MOCK_DEPARTMENTS, OFFICE_CONFIG } from '../services/mockData';
import { Card, Button, ThemeToggle, StatusBadge, Skeleton, LoadingSpinner } from '../components/UI';
import { useNotification } from '../context/NotificationContext';
import { 
  LayoutDashboard, Users, Building2, Library, Settings, 
  Menu, X, LogOut, ChevronRight, BarChart3, ShieldCheck,
  Plus, Search, Edit2, Trash2, Globe, Palette, Upload,
  Briefcase, GraduationCap, Clock, TrendingUp, Filter,
  MoreVertical, CheckCircle2, AlertTriangle, UserPlus, Info, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';

interface Props {
  user: Officer;
  onLogout: () => void;
}

export default function InstitutionAdminPortal({ user, onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { addToast } = useNotification();

  const handleNavigate = (view: string) => {
    if (view === 'overview') navigate('/dashboard');
    else navigate(`/dashboard/${view}`);
  };

  const activeView = location.pathname.split('/').pop() as string || 'overview';

  // White Labeling & Scoped Data Logic
  const initialInstitution = useMemo(() => 
    MOCK_INSTITUTIONS.find(i => i.id === user.institution_id) || MOCK_INSTITUTIONS[0],
  [user.institution_id]);

  const [institution, setInstitution] = useState<Institution>(initialInstitution);

  // Sync state if institution changes in settings (simulated)
  const handleUpdateBranding = (updates: Partial<Institution>) => {
      setInstitution(prev => ({ ...prev, ...updates }));
      addToast('success', 'School branding updated successfully');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'staff', label: 'Clearance Staff', icon: Users },
    { id: 'structure', label: 'Academic Hierarchy', icon: Building2 },
    { id: 'analytics', label: 'Performance Metrics', icon: BarChart3 },
    { id: 'settings', label: 'School Branding', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar with White Labeling */}
      <aside 
        className={`bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col z-30 shadow-2xl ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        style={{ borderRight: `4px solid ${institution.primary_color || '#2563eb'}` }}
      >
         <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
            <div 
              className="h-9 w-9 rounded-xl flex items-center justify-center font-bold mr-3 shrink-0 shadow-lg"
              style={{ backgroundColor: institution.primary_color || '#2563eb' }}
            >
               {institution.logo_url ? (
                 <img src={institution.logo_url} alt="" className="w-full h-full object-contain p-1" />
               ) : (
                 institution.short_name.charAt(0)
               )}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <span className="font-bold block truncate text-sm">{institution.name}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Admin Portal</span>
              </div>
            )}
         </div>

         <nav className="flex-1 p-4 space-y-1.5">
            {navItems.map(item => (
               <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                    activeView === item.id 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
               >
                  <item.icon size={20} className={activeView === item.id ? 'text-primary' : ''} />
                  {isSidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
                  {activeView === item.id && (
                    <div 
                      className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full" 
                      style={{ backgroundColor: institution.primary_color || '#2563eb' }}
                    />
                  )}
               </button>
            ))}
         </nav>

         <div className="p-4 border-t border-sidebar-border space-y-4">
            <button onClick={onLogout} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all ${!isSidebarOpen ? 'justify-center' : ''}`}>
               <LogOut size={20} />
               {isSidebarOpen && <span className="text-sm font-semibold">Sign Out</span>}
            </button>
         </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
         <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                   <Menu size={20} />
                </button>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe size={14} />
                    <span className="font-medium">{institution.location}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
               <ThemeToggle />
               <div className="h-8 w-px bg-border" />
               <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                     <p className="text-xs font-bold leading-none mb-0.5 text-foreground">{user.name}</p>
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Institution Manager</p>
                  </div>
                  <div className="h-9 w-9 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground border border-border">
                     {user.name.charAt(0)}
                  </div>
               </div>
            </div>
         </header>

         <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                <Routes>
                    <Route path="/" element={<OverviewDashboard institution={institution} onNavigate={handleNavigate} />} />
                    <Route path="staff" element={<StaffManager institution={institution} />} />
                    <Route path="structure" element={<StructureManager institution={institution} />} />
                    <Route path="analytics" element={<AnalyticsDashboard institution={institution} />} />
                    <Route path="settings" element={<SchoolSettings institution={institution} onUpdate={handleUpdateBranding} />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
         </main>
      </div>
    </div>
  );
}

// --- VIEW COMPONENTS ---

/**
 * OVERVIEW DASHBOARD
 */
const OverviewDashboard = ({ institution, onNavigate }: { institution: Institution, onNavigate: (v: string) => void }) => {
    const stats = [
        { label: 'Registered Faculties', val: '6', icon: Building2, color: 'text-secondary bg-secondary/10' },
        { label: 'Active Departments', val: '24', icon: Library, color: 'text-primary bg-primary/10' },
        { label: 'Authorized Officers', val: '42', icon: Users, color: 'text-primary bg-primary/10' },
        { label: 'Avg. Processing', val: '1.8d', icon: Clock, color: 'text-amber-600 bg-primary/5 dark:bg-amber-900/20' },
    ];

    const recentActivity = [
        { type: 'staff', text: 'New officer added: Dr. Michael S.', time: '2h ago' },
        { type: 'structure', text: 'Department of Robotics added to Engineering', time: '5h ago' },
        { type: 'settings', text: 'Primary brand color updated', time: 'Yesterday' },
        { type: 'staff', text: 'Access revoked for Officer: James Bond', time: '2 days ago' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Institutional Overview</h1>
                <p className="text-muted-foreground mt-1">Global management for {institution.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="hover:shadow-lg transition-all cursor-default group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${s.color} group-hover:scale-110 transition-transform`}>
                                <s.icon size={24} />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">+4%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">{s.val}</h3>
                        <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-0 overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Quick Academic Links</h3>
                            <p className="text-xs text-muted-foreground">Jump to specific faculty management</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onNavigate('structure')}>Manage Hierarchy</Button>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_COLLEGES.filter(c => c.institution_id === institution.id).map(college => (
                            <div key={college.id} className="p-4 border border-border rounded-2xl hover:bg-muted hover:bg-accent/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:text-primary transition-colors">
                                        <Building2 size={18} />
                                    </div>
                                    <h4 className="font-bold text-sm truncate">{college.name}</h4>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Dean: {college.dean_name || 'N/A'}</span>
                                    <span className="font-bold text-primary">4 Depts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-bold text-lg">Audit Log</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {recentActivity.map((act, i) => (
                            <div key={i} className="p-4 flex gap-3 items-start hover:bg-muted hover:bg-accent/50 transition-colors">
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${act.type === 'staff' ? 'bg-primary/100' : 'bg-primary/100'}`} />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-foreground dark:text-foreground/80">{act.text}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3 text-xs font-bold text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors bg-muted/50 bg-muted/20">View Detailed System Logs</button>
                </Card>
            </div>
        </div>
    );
};

/**
 * STAFF MANAGER
 */
const StaffManager = ({ institution }: { institution: Institution }) => {
    const [search, setSearch] = useState('');
    const [officeFilter, setOfficeFilter] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { addToast } = useNotification();
    const [inviteData, setInviteData] = useState({
        email: '',
        office_type: 'ADMISSIONS',
        college: '',
        department: ''
    });
    const [isInviting, setIsInviting] = useState(false);

    const filteredStaff = useMemo(() => {
        return MOCK_OFFICERS.filter(o => 
            o.institution_id === institution.id &&
            (officeFilter === 'ALL' || o.office_type === officeFilter) &&
            (o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()))
        );
    }, [institution.id, search, officeFilter]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        try {
            const response = await fetch('http://localhost:8000/api/accounts/invite-officer/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
                },
                body: JSON.stringify({
                    email: inviteData.email,
                    office_type: inviteData.office_type,
                    institution: parseInt(institution.id) || institution.id,
                    role: 'OFFICER'
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Invite failed");
            
            addToast('success', 'Invitation sent!', `Link: ${data.invitation_link}`);
            setIsAddModalOpen(false);
        } catch (err: any) {
            addToast('error', err.message);
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Clearance Officers</h2>
                    <p className="text-sm text-muted-foreground">Manage review personnel for {institution.short_name}</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="shadow-lg shadow-primary/20">
                    <UserPlus size={18} /> Register Staff Member
                </Button>
            </div>

            <Card className="flex flex-col md:flex-row items-center gap-4 p-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        className="w-full pl-10 pr-4 py-2.5 bg-muted border-none rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['ALL', 'ADMISSIONS', 'BURSARY', 'FACULTY', 'DEPARTMENT', 'LIBRARY'].map(f => (
                        <button
                            key={f}
                            onClick={() => setOfficeFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                officeFilter === f 
                                ? 'bg-secondary text-white dark:bg-card dark:text-foreground' 
                                : 'bg-card text-muted-foreground border border-border'
                            }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((s) => (
                    <Card key={s.id} className="relative group overflow-hidden border-t-4" style={{ borderTopColor: institution.primary_color }}>
                        <div className="absolute top-4 right-4">
                            <button className="p-1.5 text-muted-foreground hover:text-foreground dark:hover:text-white bg-muted rounded-lg">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center font-bold text-xl text-muted-foreground border border-border shadow-sm">
                                {s.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-foreground truncate">{s.name}</h4>
                                <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 bg-muted/50 p-4 rounded-2xl border border-border">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Briefcase size={12} /> Assigned Office
                                </span>
                                <span className="font-bold text-foreground dark:text-slate-100 bg-primary/10 dark:bg-blue-900/30 text-primary px-2 py-0.5 rounded-full">{s.office_type}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock size={12} /> Last Login
                                </span>
                                <span className="font-medium text-foreground/80">{s.last_login === '-' ? 'Never' : s.last_login}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" className="flex-1 rounded-xl h-10">
                                <Edit2 size={14} /> Edit Profile
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm" 
                                className="w-10 h-10 p-0 rounded-xl"
                                onClick={() => handleDelete(s.name)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
                
                {filteredStaff.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-border">
                            <Users size={24} className="text-muted-foreground/80" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No staff found</h3>
                        <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>

            {/* Add Staff Modal (Placeholder logic) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg p-0 overflow-hidden shadow-2xl relative">
                        <div className="bg-secondary p-6 text-secondary-foreground flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Register New Staff</h3>
                                <p className="text-xs text-secondary-foreground/80">Grant clearance review permissions</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-secondary-foreground/60 hover:text-secondary-foreground bg-secondary-foreground/10 p-2 rounded-xl transition-all"><X size={20}/></button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={handleInvite}>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="jane.doe@school.edu" 
                                    className="w-full p-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                                    value={inviteData.email}
                                    onChange={e => setInviteData({...inviteData, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Office Responsibility</label>
                                <select 
                                    className="w-full p-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                    value={inviteData.office_type}
                                    onChange={e => setInviteData({...inviteData, office_type: e.target.value})}
                                >
                                    <option value="ADMISSIONS">Admissions Office</option>
                                    <option value="BURSARY">Bursary (Finance)</option>
                                    <option value="DEPARTMENT">Departmental Clearance</option>
                                    <option value="FACULTY">Faculty Officer</option>
                                    <option value="LIBRARY">University Library</option>
                                </select>
                            </div>
                            <div className="p-4 bg-primary/5 dark:bg-amber-900/10 border border-primary/10 dark:border-amber-900/30 rounded-xl flex gap-3 items-start">
                                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground">An invitation email will be sent to the officer to set their secure password and complete their profile.</p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button variant="secondary" className="flex-1 h-12 rounded-xl" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button className="flex-1 h-12 rounded-xl" type="submit" disabled={isInviting}>
                                    {isInviting ? <Loader2 className="animate-spin" /> : "Send Invitation"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

/**
 * STRUCTURE MANAGER
 */
const StructureManager = ({ institution }: { institution: Institution }) => {
    const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
    const colleges = MOCK_COLLEGES.filter(c => c.institution_id === institution.id);
    const { addToast } = useNotification();

    const selectedCollege = useMemo(() => 
        colleges.find(c => c.id === selectedCollegeId) || colleges[0]
    , [colleges, selectedCollegeId]);

    const collegeDepts = useMemo(() => 
        MOCK_DEPARTMENTS.filter(d => d.college_id === selectedCollege?.id)
    , [selectedCollege]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Academic Structure</h2>
                    <p className="text-sm text-muted-foreground">Configure faculties and departments</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Plus size={18} /> Add Faculty
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Faculty List (4/12) */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
                        <Building2 size={14} /> Faculties / Colleges
                    </h3>
                    <div className="space-y-2">
                        {colleges.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedCollegeId(c.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                                    selectedCollege?.id === c.id 
                                    ? 'bg-card border-primary/20 dark:border-blue-900 shadow-md ring-2 ring-blue-500/10' 
                                    : 'bg-transparent border-border hover:border-border dark:hover:border-slate-700'
                                }`}
                            >
                                <div className="min-w-0">
                                    <p className={`font-bold text-sm truncate ${selectedCollege?.id === c.id ? 'text-primary' : 'text-foreground/80'}`}>{c.name}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">{MOCK_DEPARTMENTS.filter(d => d.college_id === c.id).length} Departments</p>
                                </div>
                                <ChevronRight size={16} className={`transition-transform ${selectedCollege?.id === c.id ? 'translate-x-1 text-primary' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Department Details (8/12) */}
                <Card className="lg:col-span-8 p-0 overflow-hidden bg-card/50 dark:bg-secondary/50 backdrop-blur-sm border-dashed">
                    {!selectedCollege ? (
                        <div className="p-20 text-center flex flex-col items-center justify-center h-full">
                            <Library size={48} className="text-muted-foreground/80 mb-4" strokeWidth={1} />
                            <p className="text-muted-foreground font-medium">Select a faculty to manage departments</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="p-6 bg-card border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-none mb-1">{selectedCollege.name}</h3>
                                        <p className="text-xs text-muted-foreground font-medium">Dean: {selectedCollege.dean_name || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="rounded-xl"><Edit2 size={14}/> Edit Faculty</Button>
                                    <Button size="sm" onClick={() => addToast('info', 'Feature coming soon')} className="rounded-xl"><Plus size={14}/> Add Department</Button>
                                </div>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {collegeDepts.map((d) => (
                                        <div key={d.id} className="p-4 bg-card bg-muted rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="p-2 bg-muted text-muted-foreground rounded-lg group-hover:text-primary transition-colors">
                                                    <Library size={18} />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:text-primary transition-colors"><Edit2 size={14}/></button>
                                                    <button className="p-1.5 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-foreground text-sm mb-1">{d.name}</h4>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                <Users size={10} /> HOD: {d.hod_name || 'Not Set'}
                                            </p>
                                            <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-700 mt-auto">
                                                <span className="text-[10px] font-bold text-muted-foreground">ID: {d.id.split('_')[1]}</span>
                                                <button className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-tight">View Students</button>
                                            </div>
                                        </div>
                                    ))}
                                    {collegeDepts.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl">
                                            No departments registered in this faculty yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

/**
 * ANALYTICS DASHBOARD
 */
const AnalyticsDashboard = ({ institution }: { institution: Institution }) => {
    const data = [
        { name: 'Mon', clearance: 45, volume: 120 },
        { name: 'Tue', clearance: 52, volume: 140 },
        { name: 'Wed', clearance: 38, volume: 110 },
        { name: 'Thu', clearance: 65, volume: 160 },
        { name: 'Fri', clearance: 48, volume: 130 },
        { name: 'Sat', clearance: 15, volume: 40 },
        { name: 'Sun', clearance: 10, volume: 30 },
    ];

    const pieData = [
        { name: 'Approved', value: 720, color: '#10b981' },
        { name: 'Rejected', value: 145, color: '#ef4444' },
        { name: 'Pending', value: 380, color: '#f59e0b' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Performance Analytics</h2>
                <p className="text-sm text-muted-foreground">Real-time processing trends for {institution.name}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-foreground">Clearance Activity</h3>
                            <p className="text-xs text-muted-foreground">Number of approvals per day</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                <TrendingUp size={12} /> +12%
                            </span>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorClr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={institution.primary_color || '#2563eb'} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={institution.primary_color || '#2563eb'} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="clearance" 
                                    stroke={institution.primary_color || '#2563eb'} 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorClr)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="font-bold text-foreground mb-6">Status Distribution</h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-foreground">1,245</span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Ops</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex justify-between items-center text-xs font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-muted-foreground dark:text-muted-foreground">{d.name}</span>
                                </div>
                                <span className="text-foreground font-bold">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            
            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="font-bold text-foreground">Unit Efficiency Breakdown</h3>
                    <p className="text-xs text-muted-foreground">Approval vs Rejection rates by office</p>
                </div>
                <div className="h-80 w-full p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { unit: 'Admissions', app: 85, rej: 15 },
                            { unit: 'Bursary', app: 92, rej: 8 },
                            { unit: 'Library', app: 98, rej: 2 },
                            { unit: 'Faculty', app: 75, rej: 25 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="unit" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '12px' }} />
                            <Bar dataKey="app" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="rej" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

/**
 * SCHOOL SETTINGS (WHITE LABELING)
 */
const SchoolSettings = ({ institution, onUpdate }: { institution: Institution, onUpdate: (updates: Partial<Institution>) => void }) => {
    // Fix: Added lookup for default institution values to resolve 'initialInstitution' not found error
    const defaultInstitution = MOCK_INSTITUTIONS.find(i => i.id === institution.id) || MOCK_INSTITUTIONS[0];

    const [formData, setFormData] = useState({
        name: institution.name,
        short_name: institution.short_name,
        logo_url: institution.logo_url || '',
        primary_color: institution.primary_color || '#2563eb'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            onUpdate(formData);
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-foreground">School Customization</h2>
                <p className="text-sm text-muted-foreground">Manage your institution's digital identity and branding.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Brand Preview */}
                <div className="md:col-span-1 space-y-6">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Brand Preview</h3>
                    <div className="p-8 rounded-3xl border-2 border-border bg-card flex flex-col items-center gap-6 shadow-sm sticky top-24">
                        <div 
                            className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500"
                            style={{ backgroundColor: formData.primary_color }}
                        >
                            {formData.logo_url ? (
                                <img src={formData.logo_url} alt="Logo" className="w-16 h-16 object-contain p-2" />
                            ) : (
                                <span className="text-3xl font-black text-white">{formData.short_name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-foreground">{formData.name}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">{formData.short_name}</p>
                        </div>
                        <div className="w-full h-px bg-muted" />
                        <div className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground">
                           <span>Primary Accent</span>
                           <div className="h-6 w-12 rounded-full border border-border" style={{ backgroundColor: formData.primary_color }} />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Card className="md:col-span-2">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Institution Name</label>
                                <input 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Short Name / Abbr.</label>
                                    <input 
                                        value={formData.short_name} 
                                        onChange={e => setFormData({...formData, short_name: e.target.value})}
                                        className="w-full p-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Color</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color"
                                            value={formData.primary_color} 
                                            onChange={e => setFormData({...formData, primary_color: e.target.value})}
                                            className="h-11 w-20 p-1 bg-muted rounded-xl border border-border cursor-pointer" 
                                        />
                                        <input 
                                            type="text"
                                            value={formData.primary_color} 
                                            onChange={e => setFormData({...formData, primary_color: e.target.value})}
                                            className="flex-1 p-3 bg-muted rounded-xl border border-border outline-none text-sm font-mono" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Logo Image URL</label>
                                <div className="relative">
                                    <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input 
                                        value={formData.logo_url} 
                                        onChange={e => setFormData({...formData, logo_url: e.target.value})}
                                        placeholder="https://example.com/logo.png"
                                        className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium" 
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Recommended: Square SVG or transparent PNG, min 128x128px.</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border flex justify-end gap-3">
                            {/* Fix: Use defaultInstitution for reset logic to resolve 'initialInstitution' error */}
                            <Button variant="secondary" type="button" onClick={() => setFormData({ 
                                name: defaultInstitution.name,
                                short_name: defaultInstitution.short_name,
                                logo_url: defaultInstitution.logo_url || '',
                                primary_color: defaultInstitution.primary_color || '#2563eb'
                            })}>Reset to Defaults</Button>
                            <Button 
                                type="submit" 
                                disabled={isSaving}
                                className="px-8 min-w-[140px]"
                                style={{ backgroundColor: institution.primary_color }}
                            >
                                {isSaving ? <LoadingSpinner variant="button" /> : 'Save Branding'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
            
            <Card className="bg-red-50/30 dark:bg-red-950/10 border-red-100 dark:border-red-900/30">
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">Danger Zone</h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mb-4 leading-relaxed">
                            Changes to the institution's ID or core academic mappings can disrupt active clearance processes. Please proceed with caution when modifying structural IDs.
                        </p>
                        <Button variant="danger" size="sm">Decommission System Access</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
