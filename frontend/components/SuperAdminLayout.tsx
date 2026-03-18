
import React, { useState } from 'react';
import { Officer } from '../types';
import { 
  LayoutDashboard, Shield, Building2, Users, Settings, 
  Menu, X, LogOut, ChevronLeft, ChevronRight, Globe
} from 'lucide-react';
import { ThemeToggle, Button } from './UI';

interface Props {
  children: React.ReactNode;
  user: Officer;
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const SuperAdminLayout = ({ children, user, activeView, onNavigate, onLogout }: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
    { id: 'institutions', label: 'Institutions', icon: Globe },
    { id: 'structure', label: 'Academic Structure', icon: Building2 },
    { id: 'officers', label: 'Officer Directory', icon: Users },
    { id: 'settings', label: 'Global Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-muted dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 bg-secondary text-white transition-all duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>
             {!isSidebarCollapsed && <span className="font-bold tracking-tight">Super Admin</span>}
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden"><X size={20}/></button>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === item.id ? 'bg-secondary text-white shadow-lg shadow-indigo-900/20' : 'text-muted-foreground hover:bg-slate-800 hover:text-white'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={20} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/10 transition-all">
                <LogOut size={20} />
                {!isSidebarCollapsed && <span>Logout</span>}
            </button>
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:flex mt-4 mx-auto p-2 text-muted-foreground hover:text-white">
                {isSidebarCollapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
            </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card dark:bg-secondary border-b border-slate-200 dark:border-border flex items-center justify-between px-6">
           <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden"><Menu size={24}/></button>
           <div className="flex-1"></div>
           <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                {user.name.charAt(0)}
              </div>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
           {children}
        </main>
      </div>
    </div>
  );
};
