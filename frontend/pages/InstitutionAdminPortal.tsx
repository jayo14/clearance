import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Building2,
  Settings, Bell, LogOut, Search, Menu, X,
  Briefcase, GraduationCap, School, MapPin
} from 'lucide-react';
import { Card, Button, StatusBadge, LoadingSpinner } from '../components/UI';
import { institutionService } from '../services/institutionService';

export default function InstitutionAdminPortal({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [inst, setInst] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInst = async () => {
        try {
            if (user.institution_id) {
                const data = await institutionService.getInstitution(user.institution_id);
                setInst(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchInst();
  }, [user.institution_id]);

  if (loading) return <LoadingSpinner variant="full-page" text="Loading admin portal..." />;

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Institution Admin</h1>
                <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
                    <School size={18} /> {inst?.name || 'Loading Institution...'}
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onLogout} className="text-destructive border-destructive/20 hover:bg-destructive/10">
                    <LogOut size={18} /> Logout
                </Button>
            </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Total Students', value: '0', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Officers', value: '0', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Pending Clearances', value: '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Total Faculties', value: '0', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
                <Card key={i} className="p-6 border-border hover:shadow-xl transition-all">
                    <div className={`p-3 w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} mb-4 flex items-center justify-center`}>
                        <stat.icon size={24} />
                    </div>
                    <h3 className="text-3xl font-black">{stat.value}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </Card>
            ))}
        </div>

        <Card className="p-20 text-center flex flex-col items-center bg-card border-border">
            <LayoutDashboard size={48} className="text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold">Administrative Controls</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-8">
                As an institutional admin, you can manage officers, view global analytics, and configure your institution's profile.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="primary">Manage Officers</Button>
                <Button variant="outline">View Reports</Button>
            </div>
        </Card>
      </div>
    </div>
  );
}

const Clock = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
