import React from 'react';
import { 
  ArrowRight, ShieldCheck, FileText, CheckCircle,
  Clock, AlertCircle, Building, GraduationCap,
  Calendar, User, CreditCard, ExternalLink,
  ChevronRight, Info, BookOpen, HeartPulse, Library
} from 'lucide-react';
import { Student, ClearanceRecord, OverallStatus, OfficeType, ClearanceStatus } from '../types';
import { Card, Button, StatusBadge } from '../components/UI';
import { OFFICE_CONFIG } from './OfficeView';

interface Props {
  student: Student;
  clearanceRecord: ClearanceRecord;
  onNavigate: (view: any, office?: OfficeType) => void;
}

const QuickAction = ({ icon: Icon, label, desc, onClick, color }: any) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center justify-center p-6 bg-card border border-border rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300"
  >
    <div className={`p-4 rounded-2xl ${color} mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
      <Icon size={24} />
    </div>
    <span className="font-black text-foreground text-sm tracking-tight">{label}</span>
    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 opacity-60">{desc}</span>
  </button>
);

export default function StudentDashboard({ student, clearanceRecord, onNavigate }: Props) {
  const approvedCount = clearanceRecord.items.filter(i => i.status === ClearanceStatus.APPROVED).length;
  const totalOffices = OFFICE_CONFIG.length;
  const progressPercent = Math.round((approvedCount / totalOffices) * 100);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500 pb-12">
      {/* Header / Hero Section */}
      <section className="relative group">
         <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
         <Card className="relative p-8 md:p-12 border-none bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                       <ShieldCheck size={14} /> Official Student Portal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground leading-none tracking-tighter">
                        Hi, {student.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">
                        Track and manage your university clearance process effortlessly from one central dashboard.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20" onClick={() => onNavigate('status')}>
                            Track Progress <ArrowRight size={18} />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl border-2" onClick={() => onNavigate('help')}>
                            Need Help?
                        </Button>
                    </div>
                </div>
                
                <div className="hidden md:block relative">
                    <div className="bg-card border-4 border-white dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-8 space-y-6 rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-xl">Clearance ID</h3>
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">Full Name</p>
                            <p className="font-bold text-foreground truncate">{student.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">JAMB No.</p>
                                <p className="font-bold text-foreground text-sm">{student.jamb_number}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">Status</p>
                                <StatusBadge status={clearanceRecord.overall_status} size="sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </Card>
      </section>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Progress & Actions (Col 8) */}
          <div className="lg:col-span-8 space-y-10">

              {/* Progress Tracker */}
              <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                      <h2 className="text-xl font-black text-foreground">Completion Status</h2>
                      <p className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{progressPercent}% Completed</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {OFFICE_CONFIG.map((office) => {
                          const item = clearanceRecord.items.find(i => i.office_type === office.id);
                          const isComplete = item?.status === ClearanceStatus.APPROVED;
                          const isRejected = item?.status === ClearanceStatus.REJECTED;

                          return (
                              <button
                                key={office.id}
                                onClick={() => onNavigate('office', office.id as OfficeType)}
                                className={`relative p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center group ${
                                    isComplete
                                    ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'
                                    : isRejected
                                        ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'
                                        : 'bg-card border-border hover:border-primary'
                                }`}
                              >
                                  <div className={`p-3 rounded-2xl mb-3 ${office.color} group-hover:scale-110 transition-transform`}>
                                      <Building size={20} />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80 mb-1 leading-tight">{office.label.replace(' Office', '')}</span>
                                  {isComplete ? (
                                      <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
                                          <CheckCircle size={12} /> Done
                                      </div>
                                  ) : (
                                      <div className={`flex items-center gap-1 font-black text-[10px] uppercase ${isRejected ? 'text-red-600' : 'text-muted-foreground'}`}>
                                          <ArrowRight size={12} /> {isRejected ? 'Redo' : 'Pending'}
                                      </div>
                                  )}
                              </button>
                          );
                      })}
                  </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="space-y-4">
                  <h2 className="text-xl font-black text-foreground px-2">Essential Actions</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <QuickAction
                          icon={FileText}
                          label="Documents"
                          desc="Upload Req"
                          color="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          onClick={() => onNavigate('status')}
                      />
                      <QuickAction
                          icon={Clock}
                          label="Timeline"
                          desc="Recent History"
                          color="text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                          onClick={() => onNavigate('status')}
                      />
                      <QuickAction
                          icon={GraduationCap}
                          label="Certificate"
                          desc="Download Final"
                          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                          onClick={() => onNavigate('certificate')}
                      />
                      <QuickAction
                          icon={Info}
                          label="Help Center"
                          desc="Get Support"
                          color="text-purple-600 bg-purple-50 dark:bg-purple-900/20"
                          onClick={() => onNavigate('help')}
                      />
                  </div>
              </div>
          </div>

          {/* Right Column: Status & Notifications (Col 4) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              {/* Profile Card */}
              <Card className="p-6 overflow-hidden relative">
                  <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-muted border-4 border-card shadow-lg overflow-hidden shrink-0">
                          {student.passport_photo_url ? (
                              <img src={student.passport_photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                  <User size={32} />
                              </div>
                          )}
                      </div>
                      <div className="min-w-0">
                          <h3 className="font-black text-lg text-foreground truncate">{student.name}</h3>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{student.course}</p>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-2xl border border-border">
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                              <Building size={14} /> College
                          </div>
                          <span className="text-xs font-black text-foreground">{student.college || 'Physical Sciences'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-2xl border border-border">
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                              <Calendar size={14} /> Intake
                          </div>
                          <span className="text-xs font-black text-foreground">{student.admission_year || '2024'} Session</span>
                      </div>
                  </div>
              </Card>

              {/* Notification Teaser */}
              <Card className="p-6 border-none bg-slate-900 text-white shadow-2xl">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold flex items-center gap-2">
                          <Clock size={18} className="text-emerald-400" /> Recent Updates
                       </h3>
                       <button onClick={() => onNavigate('notifications')} className="text-[10px] font-black uppercase tracking-widest hover:text-emerald-400 transition-colors">View All</button>
                   </div>

                   <div className="space-y-4">
                       <div className="relative pl-6 pb-4 border-l border-white/10 last:pb-0">
                           <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                           <p className="text-xs font-bold text-white mb-1">Clearance Started</p>
                           <p className="text-[10px] text-slate-400">Your profile has been successfully onboarded.</p>
                       </div>
                       <div className="relative pl-6 pb-0 border-l border-white/10 last:border-0 last:pb-0">
                           <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                           <p className="text-xs font-bold text-slate-400 mb-1">Verification Pending</p>
                           <p className="text-[10px] text-slate-500">Awaiting document upload for Admissions.</p>
                       </div>
                   </div>
              </Card>
          </aside>
      </div>
    </div>
  );
}
