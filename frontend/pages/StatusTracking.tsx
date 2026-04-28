import React from 'react';
import { 
  CheckCircle, Clock, AlertCircle,
  ArrowRight, ShieldCheck, FileText,
  Calendar, Building, Info, ChevronRight,
  Download, ExternalLink, MessageCircle
} from 'lucide-react';
import { Student, ClearanceRecord, OverallStatus, OfficeType, ClearanceStatus } from '../types';
import { Card, Button, StatusBadge, PageHeader } from '../components/UI';
import { OFFICE_CONFIG } from './OfficeView';

interface Props {
  student: Student;
  clearanceRecord: ClearanceRecord;
  onNavigate: (view: any, office?: OfficeType) => void;
}

export default function StatusTracking({ student, clearanceRecord, onNavigate }: Props) {
  const getStatusColor = (status: OverallStatus) => {
    switch (status) {
      case OverallStatus.APPROVED: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case OverallStatus.IN_PROGRESS: return 'text-blue-600 bg-blue-50 border-blue-200';
      case OverallStatus.REJECTED: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: OverallStatus) => {
    switch (status) {
      case OverallStatus.APPROVED: return <CheckCircle size={24} />;
      case OverallStatus.IN_PROGRESS: return <Clock size={24} />;
      case OverallStatus.REJECTED: return <AlertCircle size={24} />;
      default: return <Info size={24} />;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500">
      <PageHeader
        title="Clearance Status"
        breadcrumbs={['Dashboard', 'Status Tracking']}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Status Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-none bg-gradient-to-br from-primary/10 to-transparent shadow-none relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${getStatusColor(clearanceRecord.overall_status)} border`}>
                  {getStatusIcon(clearanceRecord.overall_status)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground">Overall Progress</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Application Status</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Completion</span>
                    <span className="text-sm font-black text-primary">
                        {Math.round((clearanceRecord.items.filter(i => i.status === ClearanceStatus.APPROVED).length / OFFICE_CONFIG.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${(clearanceRecord.items.filter(i => i.status === ClearanceStatus.APPROVED).length / OFFICE_CONFIG.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-sm font-medium text-muted-foreground italic">
                      "Keep track of your departmental and administrative clearances in real-time."
                   </p>
                </div>
              </div>
            </div>

            {/* Background design elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground px-1">Office Breakdown</h3>
            <div className="grid gap-4">
              {OFFICE_CONFIG.map((office) => {
                const item = clearanceRecord.items.find(i => i.office_type === office.id);
                const status = item?.status || ClearanceStatus.EMPTY;

                return (
                  <Card key={office.id} className="p-4 hover:shadow-md transition-all group border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${office.color} shrink-0`}>
                          <Building size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{office.label}</h4>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={status} size="sm" />
                            {item?.updated_at && (
                                <span className="text-[10px] text-muted-foreground font-medium uppercase">
                                   Updated {new Date(item.updated_at).toLocaleDateString()}
                                </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         {status === ClearanceStatus.REJECTED && (
                             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold animate-pulse">
                                <MessageCircle size={14} /> View Feedback
                             </div>
                         )}
                         <Button
                            variant="secondary"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => onNavigate('office', office.id as OfficeType)}
                         >
                            {status === ClearanceStatus.APPROVED ? 'View Record' : 'Continue'} <ChevronRight size={16} />
                         </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <aside className="space-y-6">
            <Card className="bg-slate-900 border-none text-white p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500 rounded-lg text-white">
                        <ShieldCheck size={20} />
                    </div>
                    <h3 className="font-bold">Next Steps</h3>
                </div>
                <ul className="space-y-4 text-sm">
                    {[
                        "Complete all office clearances listed.",
                        "Wait for officer verification (24-48h).",
                        "Respond to any rejection feedback immediately.",
                        "Generate certificate once 100% complete."
                    ].map((step, i) => (
                        <li key={i} className="flex gap-3 text-slate-300">
                            <span className="text-emerald-500 font-black">0{i+1}.</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <div className="bg-primary/5 rounded-2xl p-6 border-2 border-dashed border-primary/20">
                <div className="flex items-center gap-2 mb-3 text-primary">
                    <Info size={18} />
                    <h4 className="font-bold text-sm">Need Assistance?</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    If you encounter any issues with your clearance, please contact the help desk or visit the physical office during working hours.
                </p>
                <Button variant="outline" className="w-full text-xs" onClick={() => onNavigate('help')}>
                    Support Center
                </Button>
            </div>
        </aside>
      </div>
    </div>
  );
}
