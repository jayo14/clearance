
import React, { useState, useMemo, useEffect } from 'react';
import { Student, OverallStatus } from '../../types';
import { MOCK_STUDENTS } from '../../services/mockData';
import { Card, Button, StatusBadge, Skeleton } from '../../components/UI';
import { Search, Filter, X, ArrowRight, User } from 'lucide-react';

interface Props {
  initialQuery: string;
  onSelectStudent: (s: Student) => void;
}

export const SearchResults = ({ initialQuery, onSelectStudent }: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [query, statusFilter, deptFilter]);

  const allDepartments = useMemo(() => Array.from(new Set(MOCK_STUDENTS.map(s => s.department))), []);

  const results = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    
    return MOCK_STUDENTS.filter(s => {
        const matchesSearch = 
            s.name.toLowerCase().includes(lowerQuery) ||
            s.jamb_number.toLowerCase().includes(lowerQuery) ||
            s.department.toLowerCase().includes(lowerQuery);
        
        const matchesStatus = statusFilter === 'ALL' || s.clearance_record.overall_status === statusFilter;
        const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;

        return matchesSearch && matchesStatus && matchesDept;
    });
  }, [query, statusFilter, deptFilter]);

  const highlightMatch = (text: string, highlight: string) => {
      if (!highlight.trim()) return text;
      const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
      return (
          <span>
              {parts.map((part, i) => 
                  part.toLowerCase() === highlight.toLowerCase() 
                  ? <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground px-0.5 rounded">{part}</span> 
                  : part
              )}
          </span>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div>
            <h1 className="text-2xl font-bold text-foreground">Search Results</h1>
            <p className="text-muted-foreground">
                Found {results.length} results for <span className="font-bold text-foreground">"{query}"</span>
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                            <Filter size={16} /> Filters
                        </h3>
                        {(statusFilter !== 'ALL' || deptFilter !== 'ALL') && (
                            <button 
                                onClick={() => { setStatusFilter('ALL'); setDeptFilter('ALL'); }}
                                className="text-xs text-primary hover:underline"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Status</label>
                            <div className="space-y-2">
                                {['ALL', ...Object.values(OverallStatus)].map(s => (
                                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status" 
                                            checked={statusFilter === s}
                                            onChange={() => setStatusFilter(s)}
                                            className="text-primary focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-foreground/80 capitalize">
                                            {s.replace('_', ' ').toLowerCase()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-border my-4"></div>

                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Department</label>
                            <select 
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                                className="w-full p-2 bg-muted border border-border rounded-lg text-sm outline-none"
                            >
                                <option value="ALL">All Departments</option>
                                {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Results List */}
            <div className="lg:col-span-3">
                <Card className="p-0 overflow-hidden min-h-[400px]">
                    <div className="p-4 border-b border-border bg-muted/50 dark:bg-slate-950/30 flex items-center gap-2">
                        <Search size={16} className="text-muted-foreground" />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium"
                            placeholder="Refine your search..."
                        />
                    </div>

                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No matches found</h3>
                            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
                            <Button variant="outline" onClick={() => { setQuery(''); setStatusFilter('ALL'); }}>Clear Search</Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {results.map(student => (
                                <div 
                                    key={student.id}
                                    className="p-6 hover:bg-muted hover:bg-accent/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                                    onClick={() => onSelectStudent(student)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-muted dark:bg-slate-700 overflow-hidden shrink-0">
                                            {student.passport_photo_url ? (
                                                <img src={student.passport_photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">{student.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                                                {highlightMatch(student.name, query)}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                                                <span className="font-mono">{highlightMatch(student.jamb_number, query)}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{highlightMatch(student.department, query)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 self-end sm:self-auto">
                                        <StatusBadge status={student.clearance_record.overall_status} />
                                        <Button size="sm" variant="outline" className="hidden sm:flex group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-blue-700 dark:group-hover:bg-blue-900/20 dark:group-hover:border-blue-800 dark:group-hover:text-blue-300">
                                            View <ArrowRight size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    </div>
  );
};
