import React, { useState, useMemo } from 'react';
import { AdminUser, OverallStatus } from '../../types';
import { Card, Button, StatusBadge, Skeleton } from '../../components/UI';
import { useNotification } from '../../context/NotificationContext';
import { MOCK_COLLEGES } from '../../services/mockData';
import { 
  Calendar, ChevronDown, Download, Filter, 
  ClipboardCheck, CheckCircle2, Clock, Hourglass, Star,
  TrendingUp, TrendingDown, AlertCircle, FileText, Share2, Mail,
  ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';

interface Props {
  user: AdminUser;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#94a3b8']; // Green, Red, Amber, Slate

// --- Mock Data Generators ---

const generateDailyActivity = () => {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    data.push({
      day: days[i],
      approved: Math.floor(Math.random() * 20) + 10,
      rejected: Math.floor(Math.random() * 5),
      total: 0 // calculated later
    });
    data[i].total = data[i].approved + data[i].rejected + Math.floor(Math.random() * 5);
  }
  return data;
};

const DEPT_DATA = [
  { name: 'Computer Sci', approved: 45, rejected: 5, total: 50 },
  { name: 'Mass Comm', approved: 38, rejected: 8, total: 46 },
  { name: 'Accounting', approved: 42, rejected: 2, total: 44 },
  { name: 'Biochem', approved: 30, rejected: 4, total: 34 },
  { name: 'Physics', approved: 25, rejected: 1, total: 26 },
];

const REJECTION_REASONS = [
  { reason: 'Blurred Document', count: 24, percentage: 35 },
  { reason: 'Wrong Document', count: 18, percentage: 26 },
  { reason: 'Expired validity', count: 10, percentage: 14 },
  { reason: 'Missing Signature', count: 9, percentage: 13 },
  { reason: 'Other', count: 8, percentage: 12 },
];

const TIME_DISTRIBUTION = [
  { range: '<1h', count: 15 },
  { range: '1-3h', count: 35 },
  { range: '3-6h', count: 25 },
  { range: '6-12h', count: 12 },
  { range: '12-24h', count: 8 },
  { range: '>24h', count: 5 },
];

const RECENT_CLEARANCES = Array(10).fill(0).map((_, i) => ({
    id: `cl_${i}`,
    student: `Student ${i + 1}`,
    dept: DEPT_DATA[i % 5].name,
    date: new Date(Date.now() - i * 3600000).toLocaleString(),
    status: i % 5 === 0 ? 'rejected' : i % 3 === 0 ? 'pending' : 'approved',
    officer: i % 2 === 0 ? 'Dr. Sarah' : 'Mr. James',
    time: `${(Math.random() * 5 + 1).toFixed(1)}h`
}));

export const Analytics = ({ user }: Props) => {
  const [dateRange, setDateRange] = useState('LAST_7_DAYS');
  const [loading, setLoading] = useState(false);

  // Simulate loading on filter change
  const handleRangeChange = (range: string) => {
      setLoading(true);
      setDateRange(range);
      setTimeout(() => setLoading(false), 800);
  };

  // Fix: Access college name via lookup as property doesn't exist on user
  const collegeName = MOCK_COLLEGES.find(c => c.id === user.college_id)?.name || 'N/A';

  if (loading) {
      return (
          <div className="space-y-6 animate-pulse">
              <div className="flex justify-between">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-10 w-64" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
                  <Skeleton className="h-80 rounded-xl" />
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
              {/* Fix: Use looked up college name */}
              <p className="text-muted-foreground">Performance metrics for {collegeName}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-2 px-3 py-2 border-r border-border">
                  <Calendar size={16} className="text-muted-foreground" />
                  <select 
                    value={dateRange}
                    onChange={(e) => handleRangeChange(e.target.value)}
                    className="bg-transparent text-sm font-medium text-foreground/80 outline-none cursor-pointer"
                  >
                      <option value="LAST_7_DAYS">Last 7 Days</option>
                      <option value="LAST_30_DAYS">Last 30 Days</option>
                      <option value="LAST_3_MONTHS">Last 3 Months</option>
                      <option value="CUSTOM">Custom Range</option>
                  </select>
              </div>
              <Button size="sm" variant="secondary" className="border-none shadow-none">Apply</Button>
          </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Processed */}
          <Card className="relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <ClipboardCheck size={20} />
                  </div>
                  <span className="flex items-center text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      <TrendingUp size={10} className="mr-1" /> 15%
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">1,248</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">Clearances Processed</p>
          </Card>

          {/* Approval Rate */}
          <Card>
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <CheckCircle2 size={20} />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">Target: 85%</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">87%</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">Approval Rate</p>
              <div className="w-full h-1 bg-muted rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary/100 w-[87%]"></div>
              </div>
          </Card>

          {/* Avg Time */}
          <Card>
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                      <Clock size={20} />
                  </div>
                  <span className="flex items-center text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      <ArrowDownRight size={10} className="mr-1" /> 12m
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">4.2h</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">Avg. Processing Time</p>
          </Card>

          {/* Pending Backlog */}
          <Card className="border-l-4 border-l-amber-500">
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-primary/5 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                      <Hourglass size={20} />
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                      5 Urgent
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">42</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">Pending Review</p>
          </Card>

          {/* Satisfaction */}
          <Card>
              <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg">
                      <Star size={20} />
                  </div>
                  <span className="flex items-center text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      <TrendingUp size={10} className="mr-1" /> 0.2
                  </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">4.5<span className="text-sm text-muted-foreground font-normal">/5</span></h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">Student Satisfaction</p>
          </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Review Activity */}
          <Card className="lg:col-span-2 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="font-bold text-foreground text-lg">Daily Review Activity</h3>
                      <p className="text-xs text-muted-foreground">Submissions processed over the last 7 days</p>
                  </div>
                  <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-primary/100"></span> Approved
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected
                      </div>
                  </div>
              </div>
              <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateDailyActivity()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                          <Area type="monotone" dataKey="approved" stackId="1" stroke="#10b981" fill="url(#colorApproved)" />
                          <Area type="monotone" dataKey="rejected" stackId="1" stroke="#ef4444" fill="url(#colorRejected)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          {/* Status Distribution */}
          <Card className="min-h-[400px]">
              <div className="mb-6">
                  <h3 className="font-bold text-foreground text-lg">Clearance Outcomes</h3>
                  <p className="text-xs text-muted-foreground">Distribution of decisions</p>
              </div>
              <div className="h-[250px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={[
                                  { name: 'Approved', value: 87 },
                                  { name: 'Rejected', value: 8 },
                                  { name: 'Pending', value: 5 }
                              ]}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {COLORS.map((color, index) => (
                                  <Cell key={`cell-${index}`} fill={color} />
                              ))}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-3xl font-bold text-foreground">1.2k</span>
                      <span className="text-xs text-muted-foreground">Total</span>
                  </div>
              </div>
              <div className="mt-4 space-y-2">
                  {[
                      { label: 'Approved', value: '87%', color: 'bg-primary/100' },
                      { label: 'Rejected', value: '8%', color: 'bg-red-500' },
                      { label: 'Pending', value: '5%', color: 'bg-primary/50' },
                  ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                              <span className="text-muted-foreground dark:text-muted-foreground/80">{item.label}</span>
                          </div>
                          <span className="font-bold text-foreground">{item.value}</span>
                      </div>
                  ))}
              </div>
          </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Department Breakdown */}
          <Card>
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-foreground text-lg">Performance by Department</h3>
                  <Button variant="outline" size="sm" className="h-8 text-xs">View All</Button>
              </div>
              <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={DEPT_DATA} margin={{ top: 0, right: 30, left: 40, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 11}} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                          <Legend />
                          <Bar dataKey="approved" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                          <Bar dataKey="rejected" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                   </ResponsiveContainer>
              </div>
          </Card>

          {/* Processing Time Histogram */}
          <Card>
               <div className="mb-6">
                  <h3 className="font-bold text-foreground text-lg">Time to Clearance</h3>
                  <p className="text-xs text-muted-foreground">Distribution of processing times</p>
               </div>
               <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={TIME_DISTRIBUTION}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                           <Tooltip contentStyle={{borderRadius: '8px'}} />
                           <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                       </BarChart>
                   </ResponsiveContainer>
               </div>
          </Card>
      </div>

      {/* Bottom Section: Rejections & Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Top Rejection Reasons */}
          <Card className="xl:col-span-1">
              <h3 className="font-bold text-foreground text-lg mb-4">Top Rejection Reasons</h3>
              <div className="space-y-4">
                  {REJECTION_REASONS.map((item, i) => (
                      <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                              <span className="font-medium text-foreground/80">{item.reason}</span>
                              <span className="text-muted-foreground">{item.percentage}% ({item.count})</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-400 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
              <Button variant="outline" className="w-full mt-6 text-xs">Download Report</Button>
          </Card>

          {/* Recent Clearances Table */}
          <Card className="xl:col-span-2 overflow-hidden p-0">
              <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="font-bold text-foreground text-lg">Recent History</h3>
                  <Button size="sm" variant="outline"><Download size={14} /> Export CSV</Button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-background/30 text-muted-foreground font-bold uppercase text-xs">
                          <tr>
                              <th className="px-6 py-3">Student</th>
                              <th className="px-6 py-3">Dept</th>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Time</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                          {RECENT_CLEARANCES.map((row, i) => (
                              <tr key={i} className="hover:bg-muted hover:bg-accent/50 transition-colors">
                                  <td className="px-6 py-3 font-medium text-foreground">{row.student}</td>
                                  <td className="px-6 py-3 text-muted-foreground">{row.dept}</td>
                                  <td className="px-6 py-3 text-muted-foreground">{row.date.split(',')[0]}</td>
                                  <td className="px-6 py-3">
                                      <StatusBadge status={row.status} size="sm" />
                                  </td>
                                  <td className="px-6 py-3 text-right font-mono text-muted-foreground">{row.time}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </Card>
      </div>

      {/* Insights Section */}
      <div className="bg-secondary rounded-2xl p-6 text-secondary-foreground shadow-lg">
          <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-foreground/10 rounded-xl backdrop-blur-sm">
                  <Star size={24} className="text-primary" fill="currentColor" />
              </div>
              <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">AI Insights</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-secondary-foreground/5 rounded-lg p-3 backdrop-blur-sm">
                          <p className="text-sm font-medium">⚡ Processing Speed</p>
                          <p className="text-xs text-secondary-foreground/80 mt-1">Your team's processing time improved by 20% compared to last week.</p>
                      </div>
                      <div className="bg-secondary-foreground/5 rounded-lg p-3 backdrop-blur-sm">
                          <p className="text-sm font-medium">⚠️ Common Error</p>
                          <p className="text-xs text-secondary-foreground/80 mt-1">35% of rejections in Computer Science are due to blurred documents.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};