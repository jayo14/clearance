
import React, { useState, useEffect, useRef } from 'react';
import { Student, OfficeType } from '../types';
import { 
  GraduationCap, Menu, X, ChevronDown, 
  LogOut, HelpCircle, LayoutDashboard, ChevronRight, History, Settings
} from 'lucide-react';
import { ThemeToggle, LoadingSpinner } from './UI';
import { NotificationDropdown } from './NotificationDropdown';

interface StudentLayoutProps {
  children: React.ReactNode;
  user: Student;
  onLogout: () => void;
  onNavigate?: (view: 'dashboard' | 'office' | 'status' | 'certificate' | 'help' | 'notifications' | 'settings', office?: OfficeType) => void;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auth Check Simulation
  useEffect(() => {
    const checkAuth = () => {
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      }, 800);
    };
    checkAuth();
  }, [user]);

  // Scroll Shadow Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click Outside Listener for Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <LoadingSpinner variant="full-page" text="Verifying session..." />;
  }

  if (!isAuthenticated) {
     return null; 
  }

  const handleNavClick = (view: any) => {
      if (onNavigate) {
          onNavigate(view);
          setIsMobileMenuOpen(false);
          setIsUserDropdownOpen(false);
      }
  };

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-300 flex flex-col">
      {/* Navbar */}
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled 
            ? 'bg-background/90 backdrop-blur-md shadow-sm border-b border-border' 
            : 'bg-background border-b border-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleNavClick('dashboard')}>
            <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20" aria-hidden="true">
               <GraduationCap size={20} />
            </div>
            <div>
               <h1 className="text-base font-bold text-foreground leading-none">LASUSTECH</h1>
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Clearance Portal</span>
            </div>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 px-8" aria-label="Main Navigation">
              <button 
                onClick={() => handleNavClick('dashboard')} 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                  Dashboard
              </button>
              <button 
                onClick={() => handleNavClick('status')} 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                  Status & Timeline
              </button>
          </nav>

          {/* Right: Actions & User Menu */}
          <div className="flex items-center gap-4">
             <ThemeToggle />
             
             {/* Notifications */}
             <NotificationDropdown onNavigate={handleNavClick} />
             
             {/* Desktop User Menu */}
             <div className="hidden md:block relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={isUserDropdownOpen}
                  aria-label="User menu"
                  className="flex items-center gap-3 p-1.5 pl-3 pr-2 rounded-full border border-border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                   <div className="text-right hidden lg:block">
                      <p className="text-xs font-bold text-foreground/80 dark:text-foreground/80 leading-none mb-0.5">{(user?.full_name || 'Student').split(' ')[0]}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{user?.jamb_number}</p>
                   </div>
                   <div className="h-8 w-8 rounded-full bg-muted overflow-hidden border border-border">
                      {user?.passport_photo_url ? (
                        <img src={user.passport_photo_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground font-bold">{user?.full_name?.charAt(0) || '?'}
</div>
                      )}
                   </div>
                   <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {/* Dropdown Content */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-card rounded-xl shadow-xl border border-border py-2 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                      <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-bold text-foreground truncate">{user?.full_name || 'Student'}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">{user?.jamb_number}</p>
                          <p className="text-xs text-primary mt-1 truncate">{user?.department}</p>
                      </div>
                      
                      <div className="py-2">
                          <button 
                            onClick={() => handleNavClick('dashboard')}
                            className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-muted flex items-center gap-2"
                          >
                             <LayoutDashboard size={16} /> Dashboard
                          </button>
                          <button 
                            onClick={() => handleNavClick('status')}
                            className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-muted flex items-center gap-2"
                          >
                             <History size={16} /> Status & Timeline
                          </button>
                          <button 
                            onClick={() => handleNavClick('settings')}
                            className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-muted flex items-center gap-2"
                          >
                             <Settings size={16} /> Settings
                          </button>
                          <button 
                            onClick={() => handleNavClick('help')}
                            className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-muted flex items-center gap-2"
                          >
                             <HelpCircle size={16} /> Help & Support
                          </button>
                      </div>

                      <div className="border-t border-border py-2">
                          <button 
                            onClick={onLogout}
                            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                          >
                             <LogOut size={16} /> Logout
                          </button>
                      </div>
                  </div>
                )}
             </div>

             {/* Mobile Menu Toggle */}
             <button 
                className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
             >
                <Menu size={24} />
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-card shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between mb-8">
                    <span className="font-bold text-lg text-foreground">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-lg" aria-label="Close menu">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl mb-6 border border-border">
                    <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                      {user?.passport_photo_url ? (
                        <img src={user.passport_photo_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground font-bold">{user?.full_name?.charAt(0) || '?'}</div>
                      )}
                   </div>
                   <div className="overflow-hidden">
                       <p className="font-bold text-sm text-foreground truncate">{user?.full_name || 'Student'}</p>
                       <p className="text-xs text-muted-foreground font-mono truncate">{user?.jamb_number}</p>
                   </div>
                </div>

                <nav className="space-y-2 flex-1">
                    <button 
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 text-primary font-medium"
                    >
                        <span className="flex items-center gap-3"><LayoutDashboard size={18} /> Dashboard</span>
                        <ChevronRight size={16} />
                    </button>
                    <button 
                        onClick={() => handleNavClick('status')}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-muted-foreground hover:bg-muted font-medium transition-colors"
                    >
                        <span className="flex items-center gap-3"><History size={18} /> Status Timeline</span>
                        <ChevronRight size={16} />
                    </button>
                    <button 
                        onClick={() => handleNavClick('settings')}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-muted-foreground hover:bg-muted font-medium transition-colors"
                    >
                        <span className="flex items-center gap-3"><Settings size={18} /> Settings</span>
                        <ChevronRight size={16} />
                    </button>
                    <button 
                        onClick={() => handleNavClick('help')}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-muted-foreground hover:bg-muted font-medium transition-colors"
                    >
                        <span className="flex items-center gap-3"><HelpCircle size={18} /> Help & Support</span>
                        <ChevronRight size={16} />
                    </button>
                </nav>

                <div className="pt-6 border-t border-border">
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 focus:outline-none" tabIndex={-1}>
         {children}
      </main>
    </div>
  );
};
