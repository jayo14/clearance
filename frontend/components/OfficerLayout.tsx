import React, { useState, useEffect, useRef } from 'react';
import { AdminUser, UserRole, Student, Institution } from '../types';
import { 
  LayoutDashboard, FileCheck, ClipboardList, BarChart3, Settings, 
  Menu, X, Search, ChevronDown, ChevronLeft, LogOut,
  Building2, AlertCircle, ChevronRight, Shield, Command
} from 'lucide-react';
import { ThemeToggle, Button, LoadingSpinner } from './UI';
import { NotificationDropdown } from './NotificationDropdown';
import { OfficerSearch } from './OfficerSearch';
import { institutionService } from '../services/institutionService';

interface OfficerLayoutProps {
  children: React.ReactNode;
  user: AdminUser;
  onLogout: () => void;
  activeView: string;
  onNavigate: (view: string, params?: any) => void;
  onSelectStudent?: (studentId: string) => void;
}

export const OfficerLayout: React.FC<OfficerLayoutProps> = ({ children, user, onLogout, activeView, onNavigate, onSelectStudent }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [institution, setInstitution] = useState<Institution | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
        if (user && user.role === UserRole.OFFICER) {
          setIsAuthenticated(true);
          if (user.institution_id) {
              try {
                  const data = await institutionService.getInstitution(user.institution_id);
                  setInstitution(data);
              } catch (err) {
                  console.error(err);
              }
          }
        } else {
          setIsAuthenticated(false);
        }
        setIsCheckingAuth(false);
    };
    checkAuth();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isCheckingAuth) {
    return <LoadingSpinner variant="full-page" text="Verifying officer credentials..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted dark:bg-slate-950 p-4 text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-6">
           <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-foreground dark:text-white mb-2">Unauthorized Access</h1>
        <p className="text-muted-foreground mb-8 max-w-md">You do not have permission to view this portal. Please log in with an authorized officer account.</p>
        <Button onClick={onLogout}>Return to Login</Button>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Clearance Queue', icon: FileCheck },
    { id: 'students', label: 'Review', icon: ClipboardList }, 
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (query: string) => {
      onNavigate('search', query);
      setShowMobileSearch(false);
  };

  const handleStudentSelect = (studentId: string) => {
      if (onSelectStudent) {
          onSelectStudent(studentId);
      }
      setShowMobileSearch(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground dark:text-slate-100 transition-colors duration-300">
      {showMobileSearch && (
          <div className="fixed inset-0 z-50 bg-background p-4 animate-in slide-in-from-top duration-200 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground dark:text-white">Search</h2>
                  <button onClick={() => setShowMobileSearch(false)} className="p-2 text-muted-foreground bg-muted rounded-full">
                      <X size={20} />
                  </button>
              </div>
              <OfficerSearch 
                  onSearch={handleSearch} 
                  onSelectStudent={handleStudentSelect}
                  mobile={true}
                  onCloseMobile={() => setShowMobileSearch(false)}
              />
          </div>
      )}

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl md:shadow-none transform transition-all duration-300 ease-in-out md:transform-none flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-[72px]' : 'md:w-[240px]'}`}
        style={institution?.primary_color ? { borderRight: `4px solid ${institution.primary_color}` } : {}}
      >
        <div className={`h-16 flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'} border-b border-sidebar-border transition-all duration-300`}>
           <div className="flex items-center gap-3 overflow-hidden">
             <div
                className="h-8 w-8 rounded-lg flex items-center justify-center font-bold shrink-0"
                style={institution?.primary_color ? { backgroundColor: institution.primary_color, color: '#fff' } : { backgroundColor: '#2563eb', color: '#fff' }}
             >
                {institution?.logo_url ? <img src={institution.logo_url} className="w-6 h-6 object-contain" /> : <Shield size={18} />}
             </div>
             <div className={`flex flex-col transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
               <span className="font-bold text-base leading-none truncate w-32">{institution?.short_name || 'LASUSTECH'}</span>
               <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">Officer Portal</span>
             </div>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <Icon size={20} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-current'} />
                {!isSidebarCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex p-4 border-t border-sidebar-border justify-end">
            <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
            >
                {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-lg md:hidden">
              <Menu size={24} />
            </button>
            <div className="hidden md:block w-full max-w-lg">
                <OfficerSearch onSearch={handleSearch} onSelectStudent={handleStudentSelect} />
            </div>
            <button onClick={() => setShowMobileSearch(true)} className="md:hidden p-2 text-muted-foreground bg-accent rounded-lg">
                <Search size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <NotificationDropdown onNavigate={onNavigate} />
            <div className="h-8 w-px bg-border hidden md:block"></div>
            <div className="relative" ref={profileRef}>
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pl-3 pr-2 rounded-full border border-border hover:bg-accent transition-all"
                >
                    <div className="text-right hidden lg:block">
                        <p className="text-xs font-bold text-foreground leading-none mb-0.5">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user?.role || 'Officer'}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || '?'}
                    </div>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50">
                        <div className="px-4 py-4 bg-muted border-b">
                             <p className="font-bold text-foreground truncate">{user?.name || 'User'}</p>
                             <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                        </div>
                        <div className="border-t p-2">
                             <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-sm font-bold hover:bg-destructive/20">
                                 <LogOut size={16} /> Logout
                             </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth max-w-[1400px] w-full mx-auto">
            {children}
        </main>
      </div>
    </div>
  );
};
