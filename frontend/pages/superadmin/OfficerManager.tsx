import React, { useState, useMemo } from 'react';
import { MOCK_OFFICERS, MOCK_INSTITUTIONS, MOCK_COLLEGES, MOCK_DEPARTMENTS } from '../../services/mockData';
import { Officer, UserRole, OfficeType } from '../../types';
import { Card, Button, StatusBadge } from '../../components/UI';
import { Search, UserPlus, Filter, Edit2, Trash2, Shield, X, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const OfficerManager = () => {
  const [officers, setOfficers] = useState<Officer[]>(MOCK_OFFICERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [search, setSearch] = useState('');
  const { addToast } = useNotification();
  
  // Form State
  // Fix: Use UserRole.OFFICER as ADMIN doesn't exist
  const [formData, setFormData] = useState<Partial<Officer>>({
    name: '', email: '', role: UserRole.OFFICER, office_type: 'ADMISSIONS', is_active: true
  });

  // Chained Select Logic
  const availableColleges = useMemo(() => 
    MOCK_COLLEGES.filter(c => c.institution_id === formData.institution_id),
  [formData.institution_id]);

  const availableDepartments = useMemo(() => 
    MOCK_DEPARTMENTS.filter(d => d.college_id === formData.college_id),
  [formData.college_id]);

  const filtered = officers.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (officer: Officer) => {
    setEditingOfficer(officer);
    setFormData(officer);
    setIsModalOpen(true);
  };

  const closePortal = () => {
    setIsModalOpen(false);
    setEditingOfficer(null);
    // Fix: Reset role to OFFICER
    setFormData({ name: '', email: '', role: UserRole.OFFICER, office_type: 'ADMISSIONS', is_active: true });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOfficer) {
      setOfficers(prev => prev.map(o => o.id === editingOfficer.id ? { ...o, ...formData } as Officer : o));
      addToast('success', 'Officer updated successfully');
    } else {
      const newOfficer: Officer = {
        ...formData as any,
        id: `off_${Date.now()}`,
        last_login: '-'
      };
      setOfficers([newOfficer, ...officers]);
      addToast('success', 'New officer registered');
    }
    closePortal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to revoke this officer's access? This action cannot be undone.")) {
      setOfficers(prev => prev.filter(o => o.id !== id));
      addToast('warning', 'Officer record removed');
    }
  };

  const toggleStatus = (id: string) => {
    setOfficers(prev => prev.map(o => o.id === id ? { ...o, is_active: !o.is_active } : o));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold">Officer Directory</h2>
           <p className="text-sm text-muted-foreground">Authorized staff across all registered institutions.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
           <UserPlus size={18} /> Register Officer
        </Button>
      </div>

      <Card className="flex items-center gap-4 p-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-muted border-none rounded-xl outline-none"
              placeholder="Search by name, email or school..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
         </div>
         <Button variant="outline"><Filter size={18}/> Advanced Filters</Button>
      </Card>

      <Card className="overflow-hidden p-0">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground text-xs font-bold uppercase border-b border-border dark:border-slate-700">
                <tr>
                    <th className="p-6">Officer Info</th>
                    <th className="p-6">Institution / Unit</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border">
                {filtered.map(o => (
                    <tr key={o.id} className="hover:bg-muted/50 hover:bg-accent/30 transition-colors">
                        <td className="p-6">
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-secondary flex items-center justify-center font-bold">
                                {o.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{o.name}</p>
                                <p className="text-xs text-muted-foreground">{o.email}</p>
                            </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <p className="text-sm font-medium">{MOCK_INSTITUTIONS.find(i => i.id === o.institution_id)?.short_name || 'System'}</p>
                            <p className="text-xs text-muted-foreground">{o.office_type}</p>
                        </td>
                        <td className="p-6">
                            <StatusBadge status={o.is_active ? 'approved' : 'rejected'} />
                        </td>
                        <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => toggleStatus(o.id)} title={o.is_active ? 'Deactivate' : 'Activate'}>
                                    {o.is_active ? 'Deactivate' : 'Enable'}
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => openEdit(o)}><Edit2 size={14}/></Button>
                                <Button size="sm" variant="danger" className="opacity-50 hover:opacity-100" onClick={() => handleDelete(o.id)}><Trash2 size={14}/></Button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
         </div>
      </Card>

      {/* Advanced Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <Card className="w-full max-w-xl shadow-2xl animate-in zoom-in-95 relative p-0 overflow-hidden">
              <div className="bg-secondary p-6 text-white flex justify-between items-center">
                  <h3 className="text-xl font-bold">{editingOfficer ? 'Modify Officer Details' : 'Register New Officer'}</h3>
                  <button onClick={closePortal} className="text-white/80 hover:text-white"><X size={24}/></button>
              </div>
              
              <form className="p-6 space-y-6" onSubmit={handleSave}>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</label>
                       <input 
                         required
                         value={formData.name}
                         className="w-full p-2.5 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-border" 
                         onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
                       <input 
                         required
                         type="email"
                         value={formData.email}
                         className="w-full p-2.5 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-border" 
                         onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">1. Assigned Institution</label>
                    <select 
                      required
                      value={formData.institution_id}
                      className="w-full p-2.5 bg-muted rounded-xl outline-none border border-border"
                      onChange={e => setFormData({...formData, institution_id: e.target.value, college_id: '', department_id: ''})}
                    >
                       <option value="">Select University/Polytechnic</option>
                       {MOCK_INSTITUTIONS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase">2. College/Faculty</label>
                       <select 
                         disabled={!formData.institution_id}
                         value={formData.college_id}
                         className="w-full p-2.5 bg-muted rounded-xl outline-none border border-border disabled:opacity-50"
                         onChange={e => setFormData({...formData, college_id: e.target.value, department_id: ''})}
                       >
                          <option value="">Select Unit</option>
                          {availableColleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase">3. Specific Department</label>
                       <select 
                         disabled={!formData.college_id}
                         value={formData.department_id}
                         className="w-full p-2.5 bg-muted rounded-xl outline-none border border-border disabled:opacity-50"
                         onChange={e => setFormData({...formData, department_id: e.target.value})}
                       >
                          <option value="">All Departments (Dean Access)</option>
                          {availableDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase">Primary Office Responsibility</label>
                       <select 
                         className="w-full p-2.5 bg-muted rounded-xl outline-none border border-border"
                         value={formData.office_type}
                         onChange={e => setFormData({...formData, office_type: e.target.value as OfficeType})}
                       >
                          <option value="ADMISSIONS">Admissions Office</option>
                          <option value="BURSARY">Bursary / Accounts</option>
                          <option value="FACULTY">Faculty Officer</option>
                          <option value="DEPARTMENT">Dept. Clearance</option>
                          <option value="LIBRARY">University Library</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase">System Authorization</label>
                       <select 
                         className="w-full p-2.5 bg-muted rounded-xl outline-none border border-border"
                         value={formData.role}
                         onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                       >
                          {/* Fix: Use UserRole.OFFICER as ADMIN doesn't exist */}
                          <option value={UserRole.OFFICER}>Regular Clearance Officer</option>
                          <option value={UserRole.SUPER_ADMIN}>Super Admin (System-wide)</option>
                       </select>
                    </div>
                 </div>

                 <div className="flex gap-3 pt-6">
                    <Button variant="secondary" className="flex-1" type="button" onClick={closePortal}>Cancel</Button>
                    <Button className="flex-1 bg-secondary hover:bg-indigo-700" type="submit">
                        {editingOfficer ? 'Update Credentials' : 'Create Access Account'}
                    </Button>
                 </div>
              </form>
           </Card>
        </div>
      )}
    </div>
  );
};