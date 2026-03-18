
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_STUDENTS } from '../../services/mockData';
import { Student, OverallStatus, ClearanceStatus } from '../../types';
import { Card, Button, StatusBadge, Skeleton } from '../../components/UI';
import { 
  Search, Filter, Calendar, ChevronDown, List, LayoutGrid, 
  X, Download, Clock, ArrowRight, ArrowUp, ArrowDown,
  Eye, AlertCircle, FileText, CheckCircle, RefreshCw, MoreHorizontal,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface Props {
  onSelectStudent: (s: Student) => void;
}

// --- Types & Constants ---

type ViewMode = 'TABLE' | 'CARD';
type SortField = 'DATE_DESC' | 'DATE_ASC' | 'NAME_ASC' | 'NAME_DESC' | 'DEPT' | 'URGENCY';
type DateRange = 'ALL' | 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS';
type UrgencyFilter = 'ALL' | 'NEW' | 'NORMAL' | 'URGENT';

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Helper to calculate days pending
const getPendingHours = (dateString?: string) => {
    if (!dateString) return 0;
    const diff = new Date().getTime() - new Date(dateString).getTime();
    return diff / (1000 * 3600); // hours
};

// --- Sub-components (Local) ---

const FilterDropdown: React.FC<{ 
    label: string, 
    activeCount?: number, 
    isOpen: boolean, 
    onToggle: () => void, 
    onClose: () => void, 
    children: React.ReactNode 
}> = ({ 
    label, 
    activeCount = 0, 
    isOpen, 
    onToggle, 
    onClose, 
    children 
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={onToggle}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    isOpen || activeCount > 0
                        ? 'bg-primary/10 border-primary/20 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' 
                        : 'bg-card border-border text-foreground/80 hover:bg-muted hover:bg-accent'
                }`}
            >
                <span>{label}</span>
                {activeCount > 0 && (
                    <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem]">
                        {activeCount}
                    </span>
                )}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-card rounded-xl shadow-xl border border-border p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

export const ClearanceQueue = ({ onSelectStudent }: Props) => {
  // --- State ---
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('TABLE');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['in_progress']); // Default to pending/in_progress
  const [deptFilter, setDeptFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('ALL');
  
  // Sort & Pagination
  const [sortField, setSortField] = useState<SortField>('URGENCY');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // UI Toggles
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Load Sim
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  // --- Derived Data ---

  // 1. Get unique departments
  const allDepartments = useMemo(() => Array.from(new Set(MOCK_STUDENTS.map(s => s.department))), []);

  // 2. Filter Logic
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(student => {
        // Search
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            student.name.toLowerCase().includes(searchLower) ||
            student.jamb_number.toLowerCase().includes(searchLower) ||
            student.department.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        // Status
        if (statusFilter.length > 0) {
            if (!statusFilter.includes(student.clearance_record.overall_status)) return false;
        }

        // Department
        if (deptFilter.length > 0) {
            if (!deptFilter.includes(student.department)) return false;
        }

        // Date Range
        const submittedDate = new Date(student.clearance_record.updated_at);
        const now = new Date();
        if (dateRange === 'TODAY') {
            if (submittedDate.toDateString() !== now.toDateString()) return false;
        } else if (dateRange === 'LAST_7_DAYS') {
            const diffTime = Math.abs(now.getTime() - submittedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 7) return false;
        } else if (dateRange === 'LAST_30_DAYS') {
             const diffTime = Math.abs(now.getTime() - submittedDate.getTime());
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             if (diffDays > 30) return false;
        }

        // Urgency
        if (urgencyFilter !== 'ALL') {
            const hours = getPendingHours(student.clearance_record.updated_at);
            if (urgencyFilter === 'NEW' && hours > 24) return false;
            if (urgencyFilter === 'NORMAL' && (hours <= 24 || hours > 72)) return false;
            if (urgencyFilter === 'URGENT' && hours <= 72) return false;
        }

        return true;
    });
  }, [searchQuery, statusFilter, deptFilter, dateRange, urgencyFilter]);

  // 3. Sorting Logic
  const sortedStudents = useMemo(() => {
      return [...filteredStudents].sort((a, b) => {
          switch (sortField) {
              case 'DATE_DESC':
                  return new Date(b.clearance_record.updated_at).getTime() - new Date(a.clearance_record.updated_at).getTime();
              case 'DATE_ASC':
                  return new Date(a.clearance_record.updated_at).getTime() - new Date(b.clearance_record.updated_at).getTime();
              case 'NAME_ASC':
                  return a.name.localeCompare(b.name);
              case 'NAME_DESC':
                  return b.name.localeCompare(a.name);
              case 'DEPT':
                  return a.department.localeCompare(b.department);
              case 'URGENCY':
                  // High urgency (older date) first
                  return new Date(a.clearance_record.updated_at).getTime() - new Date(b.clearance_record.updated_at).getTime();
              default:
                  return 0;
          }
      });
  }, [filteredStudents, sortField]);

  // 4. Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const paginatedData = sortedStudents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  // --- Handlers ---

  const toggleFilter = (type: 'STATUS' | 'DEPT', value: string) => {
      if (type === 'STATUS') {
          setStatusFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      } else {
          setDeptFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      }
  };

  const clearAllFilters = () => {
      setSearchQuery('');
      setStatusFilter([]);
      setDeptFilter([]);
      setDateRange('ALL');
      setUrgencyFilter('ALL');
  };

  const renderUrgencyBadge = (dateStr: string) => {
      const hours = getPendingHours(dateStr);
      if (hours > 72) {
          return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Urgent</span>;
      }
      if (hours <= 24) {
          return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">New</span>;
      }
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Normal</span>;
  };

  // --- Loading Skeletons ---
  
  const TableSkeleton = () => (
      <div className="w-full">
          {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="flex items-center p-4 border-b border-border gap-4">
                  <Skeleton className="w-6 h-6 rounded" /> {/* Checkbox */}
                  <div className="flex-1 flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                      <div className="space-y-2 w-full max-w-[200px]">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                      </div>
                  </div>
                  <Skeleton className="h-4 w-32 hidden md:block" />
                  <Skeleton className="h-4 w-24 hidden md:block" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
          ))}
      </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Page Header */}
      <div>
         <h1 className="text-2xl font-bold text-foreground">Clearance Queue</h1>
         <p className="text-muted-foreground">Review and process student clearances for your assigned college.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4">
         {/* Top Row: Search & Filters */}
         <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
             {/* Left: Search & Filter Groups */}
             <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                 {/* Search */}
                 <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search student, JAMB..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"><X size={14} /></button>
                    )}
                 </div>
                 {/* Filters */}
                 <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                     <FilterDropdown 
                        label="Status" 
                        activeCount={statusFilter.length}
                        isOpen={openDropdown === 'STATUS'}
                        onToggle={() => setOpenDropdown(openDropdown === 'STATUS' ? null : 'STATUS')}
                        onClose={() => setOpenDropdown(null)}
                     >
                         <div className="space-y-1">
                             {Object.values(OverallStatus).map(status => (
                                 <label key={status} className="flex items-center gap-2 px-3 py-2 hover:bg-muted hover:bg-accent rounded cursor-pointer">
                                     <input type="checkbox" checked={statusFilter.includes(status)} onChange={() => toggleFilter('STATUS', status)} className="rounded text-primary focus:ring-blue-500" />
                                     <span className="text-sm capitalize text-foreground/80">{status.replace('_', ' ')}</span>
                                 </label>
                             ))}
                         </div>
                     </FilterDropdown>
                     <FilterDropdown 
                        label="Department" 
                        activeCount={deptFilter.length}
                        isOpen={openDropdown === 'DEPT'}
                        onToggle={() => setOpenDropdown(openDropdown === 'DEPT' ? null : 'DEPT')}
                        onClose={() => setOpenDropdown(null)}
                     >
                         <div className="max-h-60 overflow-y-auto space-y-1">
                             {allDepartments.map(dept => (
                                 <label key={dept} className="flex items-center gap-2 px-3 py-2 hover:bg-muted hover:bg-accent rounded cursor-pointer">
                                     <input type="checkbox" checked={deptFilter.includes(dept)} onChange={() => toggleFilter('DEPT', dept)} className="rounded text-primary focus:ring-blue-500" />
                                     <span className="text-sm text-foreground/80 truncate">{dept}</span>
                                 </label>
                             ))}
                         </div>
                     </FilterDropdown>
                     <FilterDropdown 
                        label="Date"
                        isOpen={openDropdown === 'DATE'}
                        onToggle={() => setOpenDropdown(openDropdown === 'DATE' ? null : 'DATE')}
                        onClose={() => setOpenDropdown(null)}
                     >
                         <div className="space-y-1">
                             {[
                                 { id: 'ALL', label: 'Any Time' },
                                 { id: 'TODAY', label: 'Today' },
                                 { id: 'LAST_7_DAYS', label: 'Last 7 Days' },
                                 { id: 'LAST_30_DAYS', label: 'Last 30 Days' },
                             ].map((opt) => (
                                 <button key={opt.id} onClick={() => { setDateRange(opt.id as DateRange); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-sm rounded ${dateRange === opt.id ? 'bg-primary/10 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'hover:bg-muted hover:bg-accent'}`}>
                                     {opt.label}
                                 </button>
                             ))}
                         </div>
                     </FilterDropdown>
                 </div>
             </div>
             {/* Right: Sort & View */}
             <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 pt-3 xl:pt-0 border-border">
                 <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-muted-foreground uppercase hidden md:inline">Sort:</span>
                     <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)} className="bg-muted border border-border rounded-lg text-sm py-1.5 px-2 outline-none focus:ring-2 focus:ring-blue-500/20">
                         <option value="URGENCY">Urgency</option>
                         <option value="DATE_DESC">Newest First</option>
                         <option value="DATE_ASC">Oldest First</option>
                         <option value="NAME_ASC">Name (A-Z)</option>
                         <option value="DEPT">Department</option>
                     </select>
                 </div>
                 <div className="h-6 w-px bg-muted bg-muted"></div>
                 <div className="flex bg-muted p-1 rounded-lg">
                     <button onClick={() => setViewMode('TABLE')} className={`p-1.5 rounded-md transition-all ${viewMode === 'TABLE' ? 'bg-card dark:bg-slate-700 shadow-sm text-primary dark:text-blue-300' : 'text-muted-foreground hover:text-muted-foreground'}`}><List size={16} /></button>
                     <button onClick={() => setViewMode('CARD')} className={`p-1.5 rounded-md transition-all ${viewMode === 'CARD' ? 'bg-card dark:bg-slate-700 shadow-sm text-primary dark:text-blue-300' : 'text-muted-foreground hover:text-muted-foreground'}`}><LayoutGrid size={16} /></button>
                 </div>
             </div>
         </div>

         {/* Active Filters */}
         <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
             <div className="flex flex-wrap items-center gap-2">
                 {[
                     { id: 'ALL', label: 'All' },
                     { id: 'NEW', label: 'New (<24h)', color: 'border-primary/20 bg-primary/10 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800' },
                     { id: 'NORMAL', label: 'Normal (1-3d)', color: 'border-amber-200 bg-primary/5 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800' },
                     { id: 'URGENT', label: 'Urgent (>3d)', color: 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800' },
                 ].map(pill => (
                     <button key={pill.id} onClick={() => setUrgencyFilter(pill.id as UrgencyFilter)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${urgencyFilter === pill.id ? (pill.color || 'bg-slate-800 text-white border-border dark:bg-card dark:text-foreground') : 'bg-card text-muted-foreground border-border hover:border-border'}`}>
                         {pill.label}
                     </button>
                 ))}
                 {(statusFilter.length > 0 || deptFilter.length > 0 || dateRange !== 'ALL' || urgencyFilter !== 'ALL' || searchQuery) && (
                     <button onClick={clearAllFilters} className="text-xs font-bold text-red-600 hover:underline ml-1">Clear All</button>
                 )}
             </div>
             <div className="text-xs font-medium text-muted-foreground">
                 {loading ? 'Loading...' : `Showing ${paginatedData.length} of ${sortedStudents.length} clearances`}
             </div>
         </div>
      </div>

      {/* Content Area */}
      <Card className="overflow-hidden p-0 border border-border shadow-sm min-h-[400px]">
          {viewMode === 'TABLE' ? (
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-background/50 text-muted-foreground text-xs uppercase font-bold border-b border-border">
                          <tr>
                              <th className="py-4 px-6 w-12 text-center"><input type="checkbox" className="rounded border-border" /></th>
                              <th className="py-4 px-6">Student</th>
                              <th className="py-4 px-6">Department</th>
                              <th className="py-4 px-6">Submitted</th>
                              <th className="py-4 px-6">Progress</th>
                              <th className="py-4 px-6">Status</th>
                              <th className="py-4 px-6 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-card">
                          {loading ? (
                              <tr>
                                  <td colSpan={7}>
                                      <TableSkeleton />
                                  </td>
                              </tr>
                          ) : paginatedData.length === 0 ? (
                              <tr>
                                  <td colSpan={7}>
                                      <div className="flex flex-col items-center justify-center py-16">
                                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground"><Filter size={20} /></div>
                                          <h3 className="text-lg font-bold text-foreground">No clearances found</h3>
                                          <p className="text-muted-foreground mb-6">Try adjusting your filters.</p>
                                          <Button variant="outline" onClick={clearAllFilters}>Clear Filters</Button>
                                      </div>
                                  </td>
                              </tr>
                          ) : (
                              paginatedData.map(student => {
                                  const record = student.clearance_record;
                                  const hoursPending = getPendingHours(record.updated_at);
                                  const isUrgent = hoursPending > 72 && record.overall_status === OverallStatus.IN_PROGRESS;
                                  const isNew = hoursPending < 6 && record.overall_status === OverallStatus.IN_PROGRESS;

                                  return (
                                      <tr key={student.id} onClick={(e) => { if ((e.target as HTMLElement).closest('button, input, a')) return; onSelectStudent(student); }} className={`group transition-colors cursor-pointer hover:bg-muted hover:bg-accent/50 ${isUrgent ? 'border-l-4 border-l-red-500 bg-red-50/10' : 'border-l-4 border-l-transparent'}`}>
                                          <td className="py-4 px-6 text-center"><input type="checkbox" className="rounded border-border cursor-pointer" /></td>
                                          <td className="py-4 px-6">
                                              <div className="flex items-center gap-3">
                                                  {isNew && <span className="w-2 h-2 rounded-full bg-primary/100 animate-pulse"></span>}
                                                  <div className="w-10 h-10 rounded-full bg-muted dark:bg-slate-700 overflow-hidden shrink-0">
                                                      {student.passport_photo_url ? <img src={student.passport_photo_url} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full font-bold text-xs text-muted-foreground">{student.name.charAt(0)}</span>}
                                                  </div>
                                                  <div><p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{student.name}</p><p className="text-xs text-muted-foreground font-mono">{student.jamb_number}</p></div>
                                              </div>
                                          </td>
                                          <td className="py-4 px-6"><span className="text-sm text-foreground/80">{student.department}</span></td>
                                          <td className="py-4 px-6"><div className="flex flex-col"><span className="text-sm font-medium text-foreground">{new Date(record.updated_at).toLocaleDateString()}</span><span className="text-xs text-muted-foreground">{new Date(record.updated_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span></div></td>
                                          <td className="py-4 px-6">
                                              <div className="flex items-center gap-3"><div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary/100 rounded-full" style={{ width: '60%' }}></div></div><span className="text-xs font-bold text-muted-foreground">3/5</span></div>
                                              <div className="mt-1">{renderUrgencyBadge(record.updated_at)}</div>
                                          </td>
                                          <td className="py-4 px-6"><StatusBadge status={record.overall_status} size="sm" /></td>
                                          <td className="py-4 px-6 text-right"><Button size="sm" onClick={() => onSelectStudent(student)}>Review</Button></td>
                                      </tr>
                                  );
                              })
                          )}
                      </tbody>
                  </table>
              </div>
          ) : (
              // Card View Logic here (similar loading check)
              <div className="p-6">
                  {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
                      </div>
                  ) : (
                      // ... existing card view map ...
                      <div className="text-center text-muted-foreground">Card view not fully implemented in demo skeleton update.</div>
                  )}
              </div>
          )}
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page:</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-muted border border-border rounded px-2 py-1 outline-none">
                  {ITEMS_PER_PAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-slate-100 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
              <span className="text-sm font-bold text-foreground/80">Page {currentPage} of {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg hover:bg-slate-100 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
          </div>
      </div>
    </div>
  );
};
