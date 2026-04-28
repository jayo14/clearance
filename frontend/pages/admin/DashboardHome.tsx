import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CheckCircle, Clock, AlertCircle,
  ArrowUpRight, BarChart2, Calendar, FileSpreadsheet,
  ChevronRight, Search, Bell, Settings
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { AdminUser, OverallStatus, ClearanceItem } from '../../types';
import { Card, Button, StatusBadge, LoadingSpinner } from '../../components/UI';
import { recordService } from '../../services/recordService';

interface Props {
  user: AdminUser;
  onNavigate: (view: string) => void;
}

const getDaysPendingText = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 3600 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
};

const getDaysPendingColor = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 3600 * 24));
    if (days > 3) return 'bg-red-100 text-red-700';
    if (days > 1) return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
};

export const DashboardHome = ({ user, onNavigate }: Props) => {
  const [items, setItems] = useState<ClearanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchItems = async () => {
          try {
              const data = await recordService.getOfficerClearanceList();
              setItems(data);
          } catch (err) {
              console.error('Failed to fetch dashboard items:', err);
          } finally {
              setLoading(false);
          }
      };
      fetchItems();
  }, []);

  const pendingItems = items.filter(i => i.status === 'pending');
  const approvedItems = items.filter(i => i.status === 'approved');
  const rejectedItems = items.filter(i => i.status === 'rejected');

  const stats = [
    { label: 'Pending Review', value: pendingItems.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+12%' },
    { label: 'Approved Today', value: approvedItems.filter(i => getDaysPendingText(i.updated_at || i.created_at) === 'Today').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%' },
    { label: 'Total Handled', value: items.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%' },
    { label: 'Action Required', value: rejectedItems.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', trend: 'Critical' },
  ];

  const chartData = [
    { day: 'Mon', approved: 40, rejected: 10 },
    { day: 'Tue', approved: 30, rejected: 15 },
    { day: 'Wed', approved: 60, rejected: 5 },
    { day: 'Thu', approved: 45, rejected: 12 },
    { day: 'Fri', approved: 80, rejected: 8 },
    { day: 'Sat', approved: 35, rejected: 4 },
    { day: 'Sun', approved: 25, rejected: 2 },
  ];

  if (loading) return <div className="p-12 flex justify-center"><LoadingSpinner text="Loading dashboard..." /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome back, {user.first_name || user.name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground mt-1 font-medium flex items-center gap-2">
                  <Calendar size={16} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
          </div>
          <div className="flex gap-3">
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                  <FileSpreadsheet size={18} /> Export Data
              </Button>
              <Button variant="primary" className="shadow-lg shadow-primary/20" onClick={() => onNavigate('queue')}>
                  View Queue <ChevronRight size={18} />
              </Button>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
              <Card key={i} className="p-6 hover:shadow-xl transition-all duration-300 group border-border">
                  <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                          <stat.icon size={24} />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {stat.trend}
                      </span>
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-1">{stat.value}</h3>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </Card>
          ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content: Table (Span 2) */}
          <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="bg-muted/30 rounded-[2rem] p-8 border border-border">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <ArrowUpRight size={20} className="text-primary" />
                      Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                          { icon: Users, label: 'Students', desc: 'View Directory', action: () => onNavigate('students'), color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                          { icon: Clock, label: 'Queue', desc: 'Pending Items', action: () => onNavigate('queue'), color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
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
                  
                  {pendingItems.length === 0 ? (
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
                                      <th className="px-6 py-4">Status</th>
                                      <th className="px-6 py-4">Submitted</th>
                                      <th className="px-6 py-4 text-right">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                  {pendingItems.slice(0, 5).map((item) => {
                                      const submittedDate = item.updated_at || item.created_at;
                                      return (
                                          <tr key={item.id} className="hover:bg-muted/50 transition-colors group">
                                              <td className="px-6 py-4">
                                                  <div className="flex items-center gap-3">
                                                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                                          <span className="font-bold text-xs text-muted-foreground">{item.student_name ? item.student_name.charAt(0) : '?'}</span>
                                                      </div>
                                                      <div>
                                                          <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.student_name}</p>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4">
                                                  <StatusBadge status={item.status} size="sm" />
                                              </td>
                                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                                  {getDaysPendingText(submittedDate)}
                                              </td>
                                              <td className="px-6 py-4 text-right">
                                                  <Button size="sm" variant="secondary" onClick={() => onNavigate(`review/${item.id}`)}>Review</Button>
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
