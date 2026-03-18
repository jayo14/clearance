
import React, { useState, useEffect } from 'react';
import { MOCK_STUDENTS } from '../../services/mockData';
import { Card, Button, StatusBadge, Skeleton } from '../../components/UI';
import { AdminUser, Student, OverallStatus } from '../../types';
import { 
  Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, 
  Timer, ArrowRight, FileText, AlertTriangle, Play,
  BarChart2, FileSpreadsheet, X, Search
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

interface DashboardProps {
  onNavigate: (view: string) => void;
  user: AdminUser;
}

export const DashboardHome = ({ onNavigate, user }: DashboardProps) => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Mock Data Calculation
  const pendingStudents = MOCK_STUDENTS.filter(s => s.clearance_record.overall_status === OverallStatus.IN_PROGRESS);
  const pendingCount = pendingStudents.length;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    const interval = setInterval(() => setCurrentTime(new Date()), 60000); // Update minutely
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const chartData = [
    { day: 'Mon', approved: 12, rejected: 2, pending: 5 },
    { day: 'Tue', approved: 19, rejected: 3, pending: 8 },
    { day: 'Wed', approved: 15, rejected: 1, pending: 4 },
    { day: 'Thu', approved: 22, rejected: 4, pending: 10 },
    { day: 'Fri', approved: 30, rejected: 5, pending: 7 },
    { day: 'Sat', approved: 8, rejected: 0, pending: 2 },
    { day: 'Sun', approved: 5, rejected: 0, pending: 1 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
           <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
           </div>
           <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
           <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
           <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const getDaysPendingColor = (dateString: string) => {
      const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
      if (days > 3) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      if (days >= 1) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      return 'bg-primary/20 text-primary dark:bg-emerald-900/30 dark:text-emerald-300';
  };

  const getDaysPendingText = (dateString: string) => {
      const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
      if (days === 0) return 'Today';
      if (days === 1) return '1 day ago';
      return `${days} days ago`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Announcement Banner */}
      {showAnnouncement && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white flex items-start sm:items-center justify-between shadow-lg shadow-primary/20 animate-slide-up-fade">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg backdrop-blur-sm animate-pulse-slow">
                      <AlertTriangle size={20} className="text-white" />
                  </div>
                  <div>
                      <h4 className="font-bold text-sm">System Maintenance Scheduled</h4>
                      <p className="text-xs text-blue-100">The portal will be undergoing maintenance on Saturday, 10 PM - 12 AM.</p>
                  </div>
              </div>
              <button onClick={() => setShowAnnouncement(false)} className="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors">
                  <X size={18} />
              </button>
          </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
         <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
               {getGreeting()}, {(user?.name || 'Officer').split(' ')[0]}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground font-medium">
               <Clock size={16} />
               <span>
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               </span>
               <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
               <span>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
            </div>
            <p className="mt-1 text-sm text-primary font-medium">
               You have <span className="font-bold">{pendingCount}</span> pending clearances to review.
            </p>
         </div>
         <div className="flex gap-3">
             <Button variant="outline" onClick={() => onNavigate('students')}>
                 <Search size={16} /> Search Student
             </Button>
             <Button onClick={() => onNavigate('queue')}>
                 Review Queue <ArrowRight size={16} />
             </Button>
         </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Pending */}
         <Card 
            className="border-l-4 border-l-amber-500 hover:shadow-md transition-all cursor-pointer animate-slide-up-fade" 
            style={{ animationDelay: '0.2s' }}
            onClick={() => onNavigate('queue')}
         >
             <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-primary/5 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                     <Clock size={24} />
                 </div>
                 <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-primary/5 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                     <TrendingUp size={12} /> +5
                 </span>
             </div>
             <h3 className="text-3xl font-bold text-foreground mb-1">{pendingCount}</h3>
             <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
         </Card>

         {/* Approved */}
         <Card 
            className="border-l-4 border-l-emerald-500 hover:shadow-md transition-all animate-slide-up-fade"
            style={{ animationDelay: '0.3s' }}
         >
             <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-primary/10 text-primary rounded-xl">
                     <CheckCircle size={24} />
                 </div>
                 <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                     <TrendingUp size={12} /> +12%
                 </span>
             </div>
             <h3 className="text-3xl font-bold text-foreground mb-1">28</h3>
             <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
         </Card>

         {/* Rejected */}
         <Card 
            className="border-l-4 border-l-red-500 hover:shadow-md transition-all animate-slide-up-fade"
            style={{ animationDelay: '0.4s' }}
         >
             <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                     <XCircle size={24} />
                 </div>
                 <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                     <TrendingDown size={12} /> -2%
                 </span>
             </div>
             <h3 className="text-3xl font-bold text-foreground mb-1">3</h3>
             <p className="text-sm font-medium text-muted-foreground">Rejected Today</p>
         </Card>

         {/* Avg Time */}
         <Card 
            className="border-l-4 border-l-blue-500 hover:shadow-md transition-all animate-slide-up-fade"
            style={{ animationDelay: '0.5s' }}
         >
             <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-primary/10 text-primary rounded-xl">
                     <Timer size={24} />
                 </div>
                 <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                     ~ Same
                 </span>
             </div>
             <h3 className="text-3xl font-bold text-foreground mb-1">2.4h</h3>
             <p className="text-sm font-medium text-muted-foreground">Avg. Processing Time</p>
         </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Queue & Actions (Span 2) */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
              
              {/* Quick Actions */}
              <div>
                  <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                          { icon: Play, label: 'Start Reviewing', desc: 'Oldest first', action: () => onNavigate('queue'), color: 'text-primary bg-primary/10' },
                          { icon: AlertTriangle, label: 'Urgent Cases', desc: '>3 days pending', action: () => onNavigate('queue'), color: 'text-amber-600 bg-primary/5 dark:bg-amber-900/20' },
                          { icon: FileSpreadsheet, label: 'Reports', desc: 'Download CSV', action: () => alert('Report generating...'), color: 'text-primary bg-primary/10' },
                          { icon: BarChart2, label: 'Analytics', desc: 'View insights', action: () => onNavigate('analytics'), color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                      ].map((item, i) => (
                          <button 
                             key={i}
                             onClick={item.action}
                             className="flex flex-col items-center justify-center p-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
                          >
                              <div className={`p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                                  <item.icon size={20} />
                              </div>
                              <h4 className="font-bold text-sm text-foreground">{item.label}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                          </button>
                      ))}
                  </div>
              </div>

              {/* Recent Queue Table */}
              <Card className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                          <h3 className="font-bold text-lg text-foreground">Recent Submissions</h3>
                          <p className="text-sm text-muted-foreground">Latest clearances pending your review</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => onNavigate('queue')}>View Full Queue</Button>
                  </div>
                  
                  {pendingStudents.length === 0 ? (
                      <div className="p-12 text-center flex flex-col items-center">
                          <div className="w-16 h-16 bg-primary/20 dark:bg-emerald-900/30 text-primary rounded-full flex items-center justify-center mb-4 animate-scale-in">
                              <CheckCircle size={32} />
                          </div>
                          <h3 className="text-lg font-bold text-foreground">All Caught Up!</h3>
                          <p className="text-muted-foreground max-w-xs mx-auto mt-1">There are no pending clearances to review at the moment. Great job!</p>
                      </div>
                  ) : (
                      <div className="overflow-x-auto">
                          <table className="w-full text-left">
                              <thead className="bg-muted/50 text-xs font-bold uppercase text-muted-foreground border-b border-border">
                                  <tr>
                                      <th className="px-6 py-4">Student</th>
                                      <th className="px-6 py-4">Department</th>
                                      <th className="px-6 py-4">Submitted</th>
                                      <th className="px-6 py-4">Status</th>
                                      <th className="px-6 py-4 text-right">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                  {pendingStudents.slice(0, 5).map((student) => {
                                      const submittedDate = student.clearance_record.updated_at;
                                      return (
                                          <tr key={student.id} className="hover:bg-muted/50 transition-colors group">
                                              <td className="px-6 py-4">
                                                  <div className="flex items-center gap-3">
                                                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                                                          {student.passport_photo_url ? (
                                                              <img src={student.passport_photo_url} alt="" className="w-full h-full object-cover" />
                                                          ) : (
                                                              <span className="flex items-center justify-center h-full font-bold text-xs text-muted-foreground">{student.name.charAt(0)}</span>
                                                          )}
                                                      </div>
                                                      <div>
                                                          <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                                                          <p className="text-xs text-muted-foreground font-mono">{student.jamb_number}</p>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                                  {student.department}
                                              </td>
                                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                                  {getDaysPendingText(submittedDate)}
                                              </td>
                                              <td className="px-6 py-4">
                                                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${getDaysPendingColor(submittedDate)}`}>
                                                      {Math.floor((new Date().getTime() - new Date(submittedDate).getTime()) / (1000 * 3600 * 24)) > 1 ? 'Delayed' : 'New'}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-4 text-right">
                                                  <Button size="sm" variant="secondary" onClick={() => onNavigate('queue')}>Review</Button>
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  )}
              </Card>
          </div>

          {/* Right Column: Chart (Span 1) */}
          <div className="space-y-8 animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
              <Card className="h-full min-h-[400px]">
                  <h3 className="font-bold text-lg text-foreground mb-2">Review Activity</h3>
                  <p className="text-sm text-muted-foreground mb-6">Performance over the last 7 days</p>
                  
                  <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                              <Tooltip 
                                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                              />
                              <Area type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorApproved)" />
                              <Area type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRejected)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 flex justify-center gap-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <span className="w-3 h-3 rounded-full bg-primary/100"></span> Approved
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <span className="w-3 h-3 rounded-full bg-red-500"></span> Rejected
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};
