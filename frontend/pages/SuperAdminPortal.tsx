import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Officer } from '../types';
import { SuperAdminLayout } from '../components/SuperAdminLayout';
import { InstitutionManager } from './superadmin/InstitutionManager';
import { OfficerManager } from './superadmin/OfficerManager';
import { StructureManager } from './superadmin/StructureManager';
import { Card, Button } from '../components/UI';
import { Globe, Users, Building2, CheckCircle } from 'lucide-react';

interface Props {
  user: Officer;
  onLogout: () => void;
}

export default function SuperAdminPortal({ user, onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (view: string) => {
    if (view === 'overview') navigate('/dashboard');
    else navigate(`/dashboard/${view}`);
  };

  const activeView = location.pathname.split('/').pop() as string || 'overview';

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Dashboard</h1>
        <p className="text-muted-foreground">Global oversight of all clearance activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="border-l-4 border-indigo-500">
            <Globe className="text-indigo-500 mb-2" size={24} />
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-sm text-muted-foreground">Active Institutions</p>
         </Card>
         <Card className="border-l-4 border-primary">
            <Users className="text-primary mb-2" size={24} />
            <h3 className="text-2xl font-bold">148</h3>
            <p className="text-sm text-muted-foreground">Authorized Officers</p>
         </Card>
         <Card className="border-l-4 border-emerald-500">
            <CheckCircle className="text-emerald-500 mb-2" size={24} />
            <h3 className="text-2xl font-bold">2,490</h3>
            <p className="text-sm text-muted-foreground">Total Clearances</p>
         </Card>
         <Card className="border-l-4 border-purple-500">
            <Building2 className="text-purple-500 mb-2" size={24} />
            <h3 className="text-2xl font-bold">86</h3>
            <p className="text-sm text-muted-foreground">Departments Registered</p>
         </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         <Card>
            <h3 className="font-bold text-lg mb-4">Recent System Logs</h3>
            <div className="space-y-4">
               {[1,2,3,4].map(i => (
                  <div key={i} className="flex gap-4 p-3 bg-muted/50 rounded-xl text-sm">
                     <div className="w-2 h-2 rounded-full bg-primary/100 mt-1.5 shrink-0" />
                     <div>
                        <p className="font-medium text-foreground">Officer account created for UNILAG</p>
                        <p className="text-xs text-muted-foreground">10 minutes ago</p>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
         <Card>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
               <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => handleNavigate('institutions')}>
                  <Globe size={20} /> Add University
               </Button>
               <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => handleNavigate('officers')}>
                  <Users size={20} /> Manage Staff
               </Button>
            </div>
         </Card>
      </div>
    </div>
  );

  return (
    <SuperAdminLayout 
        user={user} 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        onLogout={onLogout}
    >
       <Routes>
          <Route path="/" element={renderOverview()} />
          <Route path="institutions" element={<InstitutionManager />} />
          <Route path="officers" element={<OfficerManager />} />
          <Route path="structure" element={<StructureManager />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
       </Routes>
    </SuperAdminLayout>
  );
}
