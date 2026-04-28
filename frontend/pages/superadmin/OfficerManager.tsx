import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, Filter,
  MoreVertical, Mail, Phone, Building,
  ShieldCheck, XCircle, CheckCircle, RefreshCw,
  Plus, Edit2, Trash2
} from 'lucide-react';
import { Officer } from '../../types';
import { Card, Button, StatusBadge, LoadingSpinner } from '../../components/UI';
import { institutionService } from '../../services/institutionService';

export const OfficerManager = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOfficers = async () => {
      setLoading(true);
      try {
          // Assuming an institution ID or global fetch
          const data = await institutionService.getStaff('1');
          setOfficers(data);
      } catch (err) {
          console.error('Failed to fetch officers:', err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchOfficers();
  }, []);

  const filteredOfficers = officers.filter(o =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Officer Management</h1>
              <p className="text-sm text-muted-foreground">Manage clearance officers and administrators</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-primary/20">
              <UserPlus size={18} /> Invite New Officer
          </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <Button variant="outline" onClick={fetchOfficers} disabled={loading}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
      </div>

      <Card className="p-0 overflow-hidden border-border shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-muted/50 text-xs font-bold uppercase text-muted-foreground border-b border-border">
                      <tr>
                          <th className="px-6 py-4">Officer</th>
                          <th className="px-6 py-4">Office Type</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                      {loading ? (
                          <tr><td colSpan={4} className="py-20 text-center"><LoadingSpinner text="Loading..." /></td></tr>
                      ) : filteredOfficers.length === 0 ? (
                          <tr><td colSpan={4} className="py-20 text-center text-muted-foreground">No officers found</td></tr>
                      ) : (
                          filteredOfficers.map((officer) => (
                              <tr key={officer.id} className="hover:bg-muted/30 transition-colors">
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                              {officer.name.charAt(0)}
                                          </div>
                                          <div>
                                              <p className="font-bold text-sm">{officer.name}</p>
                                              <p className="text-xs text-muted-foreground">{officer.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium">
                                      {officer.office_type}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${officer.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                          {officer.is_active ? 'Active' : 'Inactive'}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end gap-2">
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit2 size={14} /></Button>
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive"><Trash2 size={14} /></Button>
                                      </div>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </Card>
    </div>
  );
};
