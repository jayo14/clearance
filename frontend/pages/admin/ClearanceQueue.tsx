import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Clock, CheckCircle, AlertCircle, FileText, Download,
  MoreVertical, ArrowUpDown, Calendar, RefreshCw
} from 'lucide-react';
import { ClearanceItem, OverallStatus } from '../../types';
import { Card, Button, StatusBadge, LoadingSpinner } from '../../components/UI';
import { recordService } from '../../services/recordService';

interface Props {
  onSelectStudent: (item: ClearanceItem) => void;
}

type UrgencyFilter = 'ALL' | 'NEW' | 'NORMAL' | 'URGENT';

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

const getPendingHours = (date: string) => {
    return (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600);
};

export const ClearanceQueue = ({ onSelectStudent }: Props) => {
  const [items, setItems] = useState<ClearanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['pending']);
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');

  const fetchItems = async () => {
      setLoading(true);
      try {
          const data = await recordService.getOfficerClearanceList();
          setItems(data);
      } catch (err) {
          console.error('Failed to fetch queue items:', err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
      return items.filter(item => {
          const matchesSearch = !searchQuery ||
              (item.student_name && item.student_name.toLowerCase().includes(searchQuery.toLowerCase()));

          const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status);

          let matchesUrgency = true;
          const hours = getPendingHours(item.updated_at || item.created_at);
          if (urgencyFilter === 'NEW') matchesUrgency = hours < 24;
          else if (urgencyFilter === 'NORMAL') matchesUrgency = hours >= 24 && hours <= 72;
          else if (urgencyFilter === 'URGENT') matchesUrgency = hours > 72;

          return matchesSearch && matchesStatus && matchesUrgency;
      });
  }, [items, searchQuery, statusFilter, urgencyFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedData = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearAllFilters = () => {
      setSearchQuery('');
      setStatusFilter(['pending']);
      setUrgencyFilter('ALL');
  };

  if (loading && items.length === 0) return <div className="p-12 flex justify-center"><LoadingSpinner text="Loading queue..." /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Clearance Queue</h1>
              <p className="text-sm text-muted-foreground">Manage and review pending student applications</p>
          </div>
          <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchItems} className="flex items-center gap-2">
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download size={14} /> Export CSV
              </Button>
          </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 space-y-4 shadow-sm">
         <div className="flex flex-col lg:flex-row gap-4">
             <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                 <input
                    type="text"
                    placeholder="Search by student name..."
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
             </div>
             <div className="flex flex-wrap items-center gap-2">
                 <div className="flex bg-muted p-1 rounded-xl border border-border">
                    <button
                        onClick={() => setStatusFilter(['pending'])}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${statusFilter.includes('pending') && statusFilter.length === 1 ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setStatusFilter(['approved'])}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${statusFilter.includes('approved') ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setStatusFilter(['rejected'])}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${statusFilter.includes('rejected') ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
                    >
                        Rejected
                    </button>
                 </div>
             </div>
         </div>
      </div>

      <Card className="overflow-hidden p-0 border border-border shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-background/50 text-muted-foreground text-xs uppercase font-bold border-b border-border">
                      <tr>
                          <th className="py-4 px-6">Student</th>
                          <th className="py-4 px-6">Submitted</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                      {paginatedData.length === 0 ? (
                          <tr>
                              <td colSpan={4} className="py-12 text-center">
                                  <div className="flex flex-col items-center">
                                      <Filter size={40} className="text-muted-foreground mb-4 opacity-20" />
                                      <p className="text-muted-foreground font-medium">No results found</p>
                                  </div>
                              </td>
                          </tr>
                      ) : (
                          paginatedData.map(item => (
                              <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="py-4 px-6">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
                                              {item.student_name ? item.student_name.charAt(0) : '?'}
                                          </div>
                                          <p className="font-bold text-sm">{item.student_name}</p>
                                      </div>
                                  </td>
                                  <td className="py-4 px-6 text-sm text-muted-foreground">
                                      {new Date(item.updated_at || item.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="py-4 px-6">
                                      <StatusBadge status={item.status} size="sm" />
                                  </td>
                                  <td className="py-4 px-6 text-right">
                                      <Button size="sm" onClick={() => onSelectStudent(item)}>Review</Button>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </Card>

      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16} /></Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16} /></Button>
          </div>
      </div>
    </div>
  );
};
