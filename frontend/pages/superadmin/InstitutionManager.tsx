
import React, { useState } from 'react';
import { MOCK_INSTITUTIONS } from '../../services/mockData';
import { Institution } from '../../types';
// Added StatusBadge to imports
import { Card, Button, StatusBadge } from '../../components/UI';
import { Globe, Plus, MapPin, Edit2, Trash2, X, GraduationCap } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const InstitutionManager = () => {
  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_INSTITUTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Institution | null>(null);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState<Partial<Institution>>({
      name: '', short_name: '', type: 'UNIVERSITY', location: ''
  });

  const openEdit = (inst: Institution) => {
    setEditingInst(inst);
    setFormData(inst);
    setIsModalOpen(true);
  };

  const closePortal = () => {
      setIsModalOpen(false);
      setEditingInst(null);
      setFormData({ name: '', short_name: '', type: 'UNIVERSITY', location: '' });
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingInst) {
          setInstitutions(prev => prev.map(i => i.id === editingInst.id ? { ...i, ...formData } as Institution : i));
          addToast('success', 'Institution profile updated');
      } else {
          const newInst: Institution = {
              ...formData as any,
              id: `inst_${Date.now()}`,
              created_at: new Date().toISOString()
          };
          setInstitutions([...institutions, newInst]);
          addToast('success', 'New institution registered on the network');
      }
      closePortal();
  };

  const handleDelete = (id: string) => {
      if (confirm("DANGER: Removing an institution will suspend all associated officer accounts and clearance records. Type 'DELETE' to confirm.")) {
          setInstitutions(prev => prev.filter(i => i.id !== id));
          addToast('error', 'Institution decommissioned');
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold">Partner Institutions</h2>
           <p className="text-sm text-muted-foreground">Manage universities and polytechnics on the system.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
           <Plus size={18} /> Register Institution
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {institutions.map(inst => (
            <Card key={inst.id} className="group relative border-t-4 border-t-indigo-500">
               <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                     <Globe size={24} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(inst)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-blue-900/20 rounded-lg transition-all"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(inst.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={16}/></button>
                  </div>
               </div>
               <h3 className="font-bold text-lg text-foreground mb-1">{inst.name}</h3>
               <p className="text-xs font-mono font-bold text-indigo-500 mb-4">{inst.short_name}</p>
               
               <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                  <MapPin size={12} /> {inst.location}
               </div>

               <div className="pt-4 border-t border-slate-50 dark:border-border flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Joined: {new Date(inst.created_at).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <StatusBadge status="approved" size="sm" />
                  </div>
               </div>
            </Card>
         ))}

         <button 
           onClick={() => setIsModalOpen(true)}
           className="h-full min-h-[220px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-indigo-500 hover:bg-indigo-50/5 dark:hover:bg-indigo-900/5 hover:text-indigo-500 transition-all group"
         >
            <div className="p-4 bg-muted rounded-full group-hover:scale-110 transition-transform">
               <Plus size={32}/>
            </div>
            <span className="font-bold text-sm">Register New School</span>
         </button>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <Card className="w-full max-w-lg animate-in zoom-in-95 p-0 overflow-hidden relative">
                <div className="bg-secondary p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold">{editingInst ? 'Edit Institution Profile' : 'Register New Institution'}</h3>
                    <button onClick={closePortal} className="text-white/80 hover:text-white"><X size={24}/></button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSave}>
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Full Institution Name</label>
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="e.g. Lagos State University" 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-muted-foreground uppercase">Abbreviation</label>
                         <input 
                            required
                            value={formData.short_name}
                            onChange={e => setFormData({...formData, short_name: e.target.value})}
                            className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                            placeholder="e.g. LASU" 
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-muted-foreground uppercase">Type</label>
                         <select 
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as any})}
                            className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                         >
                            <option value="UNIVERSITY">University</option>
                            <option value="POLYTECHNIC">Polytechnic</option>
                            <option value="COLLEGE_OF_ED">College of Education</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Primary Location</label>
                      <input 
                        required
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="City, State" 
                      />
                   </div>
                   <div className="flex gap-3 pt-6">
                      <Button variant="secondary" className="flex-1" type="button" onClick={closePortal}>Cancel</Button>
                      <Button className="flex-1 bg-secondary hover:bg-indigo-700" type="submit">
                          {editingInst ? 'Save Changes' : 'Complete Registration'}
                      </Button>
                   </div>
                </form>
             </Card>
          </div>
      )}
    </div>
  );
};