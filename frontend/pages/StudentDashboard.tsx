import React, { useState, useEffect } from 'react';
import { Student, ClearanceRecord, OfficeType, ClearanceStatus, OverallStatus, DocumentRequirement } from '../types';
import { OFFICE_CONFIG } from '../services/mockData';
import { Button, Card, Skeleton, StatusBadge, PageHeader } from '../components/UI';
import { 
  BookOpen, Building2, 
  CheckCircle, ArrowRight, Upload, Clock, Play
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { recordService } from '../services/recordService';

interface Props {
  student: Student;
  clearanceRecord: ClearanceRecord;
  onNavigate: (view: 'dashboard' | 'office' | 'status' | 'certificate', office?: OfficeType) => void;
}

export default function StudentDashboard({ student, clearanceRecord, onNavigate }: Props) {
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const reqs = await recordService.getRequirements();
            setRequirements(reqs);
        } catch (err) {
            console.error('Dashboard data fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [clearanceRecord]);

  // Calculations
  const totalOffices = OFFICE_CONFIG.length;
  const clearedOffices = OFFICE_CONFIG.filter(office => {
     const item = clearanceRecord.items.find(i => i.office_type === office.id);
     return item?.status === 'approved';
  }).length;
  
  const progressPercent = Math.round((clearedOffices / totalOffices) * 100);
  
  const chartData = [
    { name: 'Completed', value: clearedOffices, color: 'hsl(var(--primary))' },
    { name: 'Remaining', value: totalOffices - clearedOffices, color: 'hsl(var(--muted))' },
  ];

  // Action Button Logic
  let mainAction = { label: 'Start Clearance', action: () => onNavigate('office', 'ADMISSIONS'), variant: 'primary' };
  
  if (clearanceRecord.overall_status === OverallStatus.APPROVED) {
      mainAction = { label: 'Download Certificate', action: () => onNavigate('certificate'), variant: 'primary' };
  } else if (progressPercent > 0) {
      mainAction = { label: 'Continue Clearance', action: () => onNavigate('office', 'ADMISSIONS'), variant: 'primary' };
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-4 md:p-0">
        <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Section 1: Welcome Header */}
      <section className="flex flex-col gap-2 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
         <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {(student?.full_name || 'Student').split(' ')[0]}!
         </h1>
         <p className="text-muted-foreground">Here's what's happening with your application today.</p>
         
         <div className="mt-4 bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 hover:shadow-md transition-shadow duration-300">
            <div className="relative shrink-0">
               <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-muted shadow-lg">
                   {student?.passport_photo_url ? (
                       <img src={student.passport_photo_url} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                       <div className="w-full h-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                           {student?.full_name?.charAt(0) || '?'}
                       </div>
                   )}
               </div>
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary/100 border-4 border-card rounded-full animate-scale-in"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 w-full">
               <div>
                  <h2 className="text-xl font-bold text-foreground">{student?.full_name || 'Student'}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground mt-1 font-mono bg-muted rounded-md px-2 py-0.5 inline-flex w-fit mx-auto md:mx-0">
                     <span className="font-semibold text-foreground">{student?.jamb_number || '---'}</span>
                  </div>
               </div>
               <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex justify-center md:justify-start gap-2"><span className="font-semibold text-foreground w-16">Session:</span> {student?.admission_year || '---'}</p>
               </div>
               <div className="md:col-span-2 pt-2 border-t border-border flex flex-col md:flex-row gap-4 md:gap-8 text-xs text-muted-foreground">
                  <span>{student?.email || ''}</span>
                  <span className="hidden md:inline opacity-30">•</span>
                  <span>{student?.phone || ''}</span>
               </div>
            </div>
         </div>
      </section>

      {/* Section 2: Progress Overview */}
      <section className="animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
          <Card className="bg-secondary text-secondary-foreground border-none relative overflow-hidden p-8">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="relative w-32 h-32 shrink-0">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={chartData}
                              innerRadius={35}
                              outerRadius={50}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                              startAngle={90}
                              endAngle={-270}
                              animationDuration={1500}
                           >
                              {chartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                           </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center flex-col leading-none">
                        <span className="text-xl font-bold">{progressPercent}%</span>
                     </div>
                 </div>

                 <div className="flex-1 text-center md:text-left">
                     <StatusBadge status={clearanceRecord.overall_status} className="mb-3 bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground" />
                     <h3 className="text-2xl font-bold mb-1">
                        You have completed {clearedOffices} out of {totalOffices} clearances
                     </h3>
                     <p className="text-muted-foreground/80 text-sm mb-4">
                        {progressPercent === 100 
                           ? "Congratulations! You are fully cleared." 
                           : "Keep going! Upload pending documents to proceed."}
                     </p>
                     
                     <button 
                        onClick={() => onNavigate('status')}
                        className="text-xs font-bold text-primary hover:text-white underline underline-offset-4 transition-all"
                     >
                        View Full Timeline & Activity Log
                     </button>
                 </div>

                 <div className="shrink-0 w-full md:w-auto">
                     <Button 
                        size="lg" 
                        variant="primary" 
                        onClick={mainAction.action}
                        className="w-full md:w-auto shadow-xl"
                     >
                        {mainAction.label} <ArrowRight size={18} />
                     </Button>
                 </div>
             </div>
          </Card>
      </section>

      {/* Section 3: Office Grid */}
      <section>
         <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
            <Building2 size={20} className="text-primary" /> Clearance Progress by Office
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFICE_CONFIG.map((office, index) => {
                const item = clearanceRecord.items.find(i => i.office_type === office.id);
                const status = item?.status || 'empty';
                
                const reqs = requirements.filter(r => r.office_type === office.id);
                const uploadedCount = item?.documents.length || 0;
                const requiredCount = reqs.length;
                const progress = requiredCount > 0 ? (uploadedCount / requiredCount) * 100 : 0;
                
                let borderColor = 'border-l-transparent';
                if (status === 'approved') borderColor = 'border-l-emerald-500';
                if (status === 'rejected') borderColor = 'border-l-destructive';

                return (
                    <div 
                        key={office.id}
                        onClick={() => onNavigate('office', office.id as OfficeType)}
                        style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
                        className={`group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 ${borderColor} animate-slide-up-fade`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300`}>
                                <office.icon size={24} />
                            </div>
                            <StatusBadge status={status} size="sm" />
                        </div>

                        <h4 className="text-lg font-bold text-foreground mb-1">{office.label}</h4>
                        
                        <div className="mt-4 mb-4">
                            <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                                <span>Documents</span>
                                <span>{uploadedCount}/{requiredCount}</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${status === 'approved' ? 'bg-primary/100' : 'bg-primary'}`} 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {item?.updated_at && status !== 'empty' && (
                           <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-4">
                              <Clock size={10} /> Updated {new Date(item.updated_at).toLocaleDateString()}
                           </p>
                        )}

                        <div className="mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                             {status === 'empty' && (
                                <Button size="sm" variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5 shadow-none">
                                    <Upload size={14} /> Upload Documents
                                </Button>
                             )}
                             {status === 'pending' && (
                                <Button size="sm" variant="secondary" className="w-full">
                                    View Status
                                </Button>
                             )}
                             {status === 'approved' && (
                                <Button size="sm" variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 shadow-none pointer-events-none">
                                    <CheckCircle size={14} /> View Details
                                </Button>
                             )}
                             {status === 'rejected' && (
                                <Button size="sm" variant="outline" className="w-full border-destructive/20 text-destructive hover:bg-destructive/5">
                                    <AlertCircle size={14} /> Re-upload
                                </Button>
                             )}
                        </div>
                    </div>
                );
            })}
         </div>
      </section>
    </div>
  );
}