
import React, { useState, useMemo } from 'react';
import { Student, ClearanceRecord, OfficeType, ClearanceStatus } from '../types';
import { OFFICE_CONFIG, REQUIREMENTS } from '../services/mockData';
import { Button, Card, StatusBadge, PageHeader } from '../components/UI';
import { 
  CheckCircle, Clock, XCircle, AlertCircle, ArrowRight, Filter, 
  Calendar, User, FileText, Bell, ChevronDown, ChevronUp, History, SortAsc
} from 'lucide-react';

interface Props {
  student: Student;
  clearanceRecord: ClearanceRecord;
  onNavigate: (view: 'dashboard' | 'office' | 'status', office?: OfficeType) => void;
}

type SortOrder = 'SEQUENCE' | 'RECENT';

export default function StatusTracking({ student, clearanceRecord, onNavigate }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('SEQUENCE');
  const [showNotifications, setShowNotifications] = useState(true); // Collapsible on mobile

  // --- Derived Data ---

  // Merge Config with Record Items
  const timelineItems = useMemo(() => {
    let items = OFFICE_CONFIG.map((office, index) => {
      const recordItem = clearanceRecord.items.find(i => i.office_type === office.id);
      const status = recordItem?.status || ClearanceStatus.EMPTY;
      const documents = recordItem?.documents || [];
      
      // Mock Officer data if approved/rejected
      const officerName = recordItem?.assigned_officer || (status === 'approved' || status === 'rejected' ? 'Dr. Sarah Johnson' : undefined);
      
      return {
        ...office,
        sequenceIndex: index,
        status,
        updatedAt: recordItem?.updated_at,
        recordItem,
        documents,
        officerName,
        docCount: documents.length,
        reqCount: REQUIREMENTS.filter(r => r.office_type === office.id).length
      };
    });

    // Filtering
    if (activeFilter !== 'ALL') {
      items = items.filter(i => i.status === activeFilter);
    }

    // Sorting
    if (sortOrder === 'RECENT') {
      items.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return items;
  }, [clearanceRecord, activeFilter, sortOrder]);

  // Counts for Filter Pills
  const counts = useMemo(() => {
    const all = OFFICE_CONFIG.length;
    const pending = OFFICE_CONFIG.filter(o => clearanceRecord.items.find(i => i.office_type === o.id)?.status === 'pending').length;
    const approved = OFFICE_CONFIG.filter(o => clearanceRecord.items.find(i => i.office_type === o.id)?.status === 'approved').length;
    const rejected = OFFICE_CONFIG.filter(o => clearanceRecord.items.find(i => i.office_type === o.id)?.status === 'rejected').length;
    const empty = all - pending - approved - rejected;
    return { all, pending, approved, rejected, empty };
  }, [clearanceRecord]);

  // Mock Notifications based on record state
  const notifications = useMemo(() => {
    const notifs = [];
    clearanceRecord.items.forEach(item => {
      const office = OFFICE_CONFIG.find(o => o.id === item.office_type);
      if (item.status === 'approved') {
        notifs.push({
          id: `notif_${item.id}_app`,
          office: office?.label,
          message: 'Documents approved',
          time: '2 hours ago',
          type: 'success'
        });
      } else if (item.status === 'rejected') {
        notifs.push({
          id: `notif_${item.id}_rej`,
          office: office?.label,
          message: 'Documents rejected - Action required',
          time: '1 day ago',
          type: 'error'
        });
      } else if (item.status === 'pending') {
        notifs.push({
          id: `notif_${item.id}_pen`,
          office: office?.label,
          message: 'Submission received',
          time: '3 days ago',
          type: 'info'
        });
      }
    });
    return notifs.sort(() => 0.5 - Math.random()); // Shuffle for demo
  }, [clearanceRecord]);

  // --- Render Helpers ---

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-primary/100 border-emerald-500 text-white';
      case 'rejected': return 'bg-red-500 border-red-500 text-white';
      case 'pending': return 'bg-primary/50 border-amber-500 text-white animate-pulse';
      default: return 'bg-muted border-border text-muted-foreground bg-muted dark:border-slate-700';
    }
  };

  const getLineColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-primary/100';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-primary/50';
      default: return 'bg-muted bg-muted';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <PageHeader 
          title="Clearance Status" 
          breadcrumbs={['Dashboard', 'Status & Timeline']}
          actions={<StatusBadge status={clearanceRecord.overall_status} size="lg" />}
          onBreadcrumbClick={(index: number) => {
              if (index === 0) onNavigate('dashboard');
          }}
        />

        {/* Filters & Controls */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ALL', label: 'All Offices', count: counts.all },
                  { id: 'pending', label: 'Pending', count: counts.pending },
                  { id: 'approved', label: 'Approved', count: counts.approved },
                  { id: 'rejected', label: 'Rejected', count: counts.rejected },
                  { id: 'empty', label: 'Not Started', count: counts.empty },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      activeFilter === filter.id 
                        ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20' 
                        : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {filter.label} <span className="opacity-70 ml-1">({filter.count})</span>
                  </button>
                ))}
            </div>

            {/* Sort Toggle */}
            <div className="flex bg-card rounded-lg border border-border p-1">
                <button 
                   onClick={() => setSortOrder('SEQUENCE')}
                   className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors ${sortOrder === 'SEQUENCE' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground/80 dark:hover:text-muted-foreground/80'}`}
                >
                   <SortAsc size={14} /> Sequence
                </button>
                <button 
                   onClick={() => setSortOrder('RECENT')}
                   className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors ${sortOrder === 'RECENT' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground/80 dark:hover:text-muted-foreground/80'}`}
                >
                   <History size={14} /> Recent
                </button>
            </div>
        </div>

        {/* Timeline */}
        {timelineItems.length === 0 ? (
           <div className="text-center py-20 bg-card rounded-2xl border border-border border-dashed">
               <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                   <Filter size={24} />
               </div>
               <h3 className="text-lg font-bold text-foreground">No items match your filter</h3>
               <p className="text-muted-foreground mb-6">Try selecting "All Offices" to see everything.</p>
               <Button variant="outline" onClick={() => setActiveFilter('ALL')}>Reset Filters</Button>
           </div>
        ) : (
           <div className="relative pl-0 md:pl-4 space-y-8 md:space-y-0">
               {/* Vertical Line (Desktop) */}
               <div className="hidden md:block absolute left-[31px] top-4 bottom-4 w-0.5 bg-muted -z-10"></div>

               {timelineItems.map((item, index) => {
                   const isLast = index === timelineItems.length - 1;
                   return (
                       <div key={item.id} className="relative md:pl-12 md:pb-12 group">
                           {/* Connecting Line Segment (Dynamic Color) */}
                           {!isLast && (
                               <div className={`hidden md:block absolute left-[31px] top-10 bottom-0 w-0.5 z-0 ${getLineColor(item.status)}`}></div>
                           )}

                           {/* Timeline Node */}
                           <div className={`hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full border-4 border-slate-50 dark:border-slate-950 items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 ${getStatusColor(item.status)}`}>
                               <item.icon size={24} />
                           </div>

                           {/* Mobile Icon */}
                           <div className="md:hidden flex items-center gap-3 mb-2">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${getStatusColor(item.status).replace('border-4', 'border-2')}`}>
                                   <item.icon size={18} />
                               </div>
                               <h3 className="font-bold text-lg text-foreground">{item.label}</h3>
                           </div>

                           {/* Content Card */}
                           <Card className={`relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.status === 'rejected' ? 'border-red-200 dark:border-red-900/50' : ''}`}>
                               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                   <div className="hidden md:block">
                                       <h3 className="font-bold text-lg text-foreground">{item.label}</h3>
                                   </div>
                                   <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                       <StatusBadge status={item.status} />
                                       {item.updatedAt && (
                                           <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                               <Calendar size={12} /> {new Date(item.updatedAt).toLocaleDateString()}
                                           </span>
                                       )}
                                   </div>
                               </div>

                               <div className="space-y-4">
                                   {/* Status Context Messages */}
                                   {item.status === 'approved' && (
                                       <div className="bg-primary/10 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3">
                                           <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                                           <div className="text-sm">
                                               <p className="text-emerald-800 dark:text-emerald-200 font-medium">Clearance Approved</p>
                                               <p className="text-primary text-xs mt-0.5">Verified by {item.officerName}</p>
                                           </div>
                                       </div>
                                   )}

                                   {item.status === 'rejected' && (
                                       <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30 flex items-start gap-3">
                                           <XCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                                           <div className="text-sm">
                                               <p className="text-red-800 dark:text-red-200 font-medium">Submission Rejected</p>
                                               {item.recordItem?.officer_comments && (
                                                  <p className="text-red-600 dark:text-red-300 mt-1 italic">"{item.recordItem.officer_comments}"</p>
                                               )}
                                           </div>
                                       </div>
                                   )}

                                   {item.status === 'pending' && (
                                       <div className="bg-primary/5 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
                                           <Clock size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                           <div className="text-sm">
                                               <p className="text-amber-800 dark:text-amber-200 font-medium">Under Review</p>
                                               <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">Estimated completion: 24-48 hours</p>
                                           </div>
                                       </div>
                                   )}

                                   {item.status === 'empty' && (
                                       <p className="text-sm text-muted-foreground">
                                           You haven't uploaded any documents for this office yet.
                                       </p>
                                   )}

                                   {/* Footer Info & Actions */}
                                   <div className="pt-4 border-t border-border flex items-center justify-between">
                                       <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                           <FileText size={14} />
                                           {item.docCount}/{item.reqCount} Documents
                                       </div>
                                       
                                       <Button 
                                          size="sm" 
                                          variant={item.status === 'rejected' ? 'danger' : item.status === 'empty' ? 'primary' : 'outline'}
                                          onClick={() => onNavigate('office', item.id as OfficeType)}
                                       >
                                           {item.status === 'rejected' ? 'Fix Issues' : item.status === 'empty' ? 'Start Upload' : 'View Details'} <ArrowRight size={14} />
                                       </Button>
                                   </div>
                               </div>
                           </Card>
                       </div>
                   );
               })}
           </div>
        )}
      </div>

      {/* Notification Panel (Right Sidebar) */}
      <div className={`lg:w-80 shrink-0 ${showNotifications ? 'block' : 'hidden lg:block'}`}>
         <div className="sticky top-24 space-y-6">
             {/* Mobile Collapse Toggle */}
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="lg:hidden w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border font-bold text-foreground mb-4"
             >
                 <span className="flex items-center gap-2"><Bell size={18} /> Notifications</span>
                 {showNotifications ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
             </button>

             <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                 <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50 dark:bg-slate-950/30">
                     <h3 className="font-bold text-foreground flex items-center gap-2">
                         <Bell size={16} className="text-primary" /> Recent Updates
                     </h3>
                     <button className="text-xs font-bold text-primary hover:underline">Mark all read</button>
                 </div>
                 
                 <div className="max-h-[400px] overflow-y-auto">
                     {notifications.length === 0 ? (
                         <div className="p-8 text-center text-muted-foreground text-sm">No new notifications</div>
                     ) : (
                         <div className="divide-y divide-border">
                             {notifications.map((notif, i) => (
                                 <div key={notif.id} className="p-4 hover:bg-muted hover:bg-accent/50 transition-colors relative group cursor-pointer">
                                     {i < 2 && <div className="absolute top-4 right-4 w-2 h-2 bg-primary/100 rounded-full ring-2 ring-white dark:ring-slate-900"></div>}
                                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{notif.office}</p>
                                     <p className="text-sm font-medium text-foreground mb-1 leading-snug">{notif.message}</p>
                                     <p className="text-xs text-muted-foreground">{notif.time}</p>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
                 <div className="p-3 border-t border-border text-center">
                     <button className="text-xs font-bold text-muted-foreground hover:text-foreground dark:hover:text-foreground/80">View All Notifications</button>
                 </div>
             </div>

             {/* Help Widget */}
             <div className="bg-secondary rounded-2xl p-6 text-secondary-foreground text-center">
                 <div className="w-12 h-12 bg-secondary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                     <AlertCircle size={24} />
                 </div>
                 <h4 className="font-bold mb-1 text-secondary-foreground">Need Assistance?</h4>
                 <p className="text-secondary-foreground/80 text-xs mb-4">Contact the student help desk for issues with your clearance.</p>
                 <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-none shadow-none">Contact Support</Button>
             </div>
         </div>
      </div>
    </div>
  );
}
