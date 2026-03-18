
import React, { useState } from 'react';
import { MOCK_INSTITUTIONS, MOCK_COLLEGES, MOCK_DEPARTMENTS } from '../../services/mockData';
import { Card, Button } from '../../components/UI';
import { Building2, ChevronRight, Plus, Library, Edit2, Trash2, X } from 'lucide-react';
import { College, Department } from '../../types';
import { useNotification } from '../../context/NotificationContext';

export const StructureManager = () => {
  const [selectedInstId, setSelectedInstId] = useState(MOCK_INSTITUTIONS[0].id);
  const [colleges, setColleges] = useState<College[]>(MOCK_COLLEGES);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const { addToast } = useNotification();

  // Modal States
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Form States
  const [collegeForm, setCollegeForm] = useState<Partial<College>>({ name: '', dean_name: '' });
  const [deptForm, setDeptForm] = useState<Partial<Department>>({ name: '', hod_name: '', college_id: '' });

  const activeColleges = colleges.filter(c => c.institution_id === selectedInstId);
  const activeDepartments = departments.filter(d => activeColleges.some(c => c.id === d.college_id));

  // --- Handlers ---

  const handleSaveCollege = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingCollege) {
          setColleges(prev => prev.map(c => c.id === editingCollege.id ? { ...c, ...collegeForm } as College : c));
          addToast('success', 'College updated');
      } else {
          const newCol: College = {
              ...collegeForm as any,
              id: `col_${Date.now()}`,
              institution_id: selectedInstId
          };
          setColleges([...colleges, newCol]);
          addToast('success', 'New Faculty/College added');
      }
      setIsCollegeModalOpen(false);
      setEditingCollege(null);
      setCollegeForm({ name: '', dean_name: '' });
  };

  const handleDeleteCollege = (id: string) => {
    if (confirm("Removing a college will orphan all its departments. Continue?")) {
        setColleges(prev => prev.filter(c => c.id !== id));
        addToast('error', 'College removed');
    }
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
        setDepartments(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...deptForm } as Department : d));
        addToast('success', 'Department updated');
    } else {
        const newDept: Department = {
            ...deptForm as any,
            id: `dept_${Date.now()}`
        };
        setDepartments([...departments, newDept]);
        addToast('success', 'Department added to system');
    }
    setIsDeptModalOpen(false);
    setEditingDept(null);
    setDeptForm({ name: '', hod_name: '', college_id: '' });
  };

  const handleDeleteDept = (id: string) => {
    if (confirm("Delete this department record?")) {
        setDepartments(prev => prev.filter(d => d.id !== id));
        addToast('warning', 'Department deleted');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Selector Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div>
           <h2 className="text-2xl font-extrabold text-foreground">Academic Structure</h2>
           <p className="text-sm text-muted-foreground">Configure faculties and departments hierarchically.</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">Target Institution:</span>
            <select 
              className="p-3 bg-muted border border-border rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedInstId}
              onChange={e => setSelectedInstId(e.target.value)}
            >
               {MOCK_INSTITUTIONS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         {/* Colleges List */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="font-bold flex items-center gap-2 text-foreground">
                  <Building2 size={20} className="text-primary" /> 
                  Colleges / Faculties
               </h3>
               <Button size="sm" variant="outline" onClick={() => setIsCollegeModalOpen(true)}><Plus size={14}/> Add Faculty</Button>
            </div>
            
            <div className="space-y-3">
               {activeColleges.map(c => (
                  <Card key={c.id} className="p-5 hover:shadow-md border-l-4 border-primary transition-all group">
                     <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                           <p className="font-bold text-foreground truncate">{c.name}</p>
                           <p className="text-xs text-muted-foreground">Dean: {c.dean_name || 'Unassigned'}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingCollege(c); setCollegeForm(c); setIsCollegeModalOpen(true); }} className="p-2 text-muted-foreground hover:text-primary rounded-lg"><Edit2 size={14}/></button>
                            <button onClick={() => handleDeleteCollege(c.id)} className="p-2 text-muted-foreground hover:text-destructive rounded-lg"><Trash2 size={14}/></button>
                        </div>
                     </div>
                  </Card>
               ))}
               {activeColleges.length === 0 && <p className="text-sm text-muted-foreground py-12 text-center bg-muted rounded-3xl border border-dashed">No faculties found.</p>}
            </div>
         </div>

         {/* Departments List */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="font-bold flex items-center gap-2 text-foreground">
                  <Library size={20} className="text-secondary" /> 
                  Active Departments
               </h3>
               <Button size="sm" variant="outline" onClick={() => { setIsDeptModalOpen(true); if(activeColleges[0]) setDeptForm({ ...deptForm, college_id: activeColleges[0].id }); }}><Plus size={14}/> Add Dept</Button>
            </div>
            
            <div className="space-y-3">
               {activeDepartments.map(d => (
                  <Card key={d.id} className="p-5 border-l-4 border-secondary group">
                     <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                           <p className="font-bold text-foreground truncate">{d.name}</p>
                           <p className="text-xs text-muted-foreground">HOD: {d.hod_name || 'Unassigned'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase">
                              {colleges.find(c => c.id === d.college_id)?.name.split(' ').pop()}
                           </span>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingDept(d); setDeptForm(d); setIsDeptModalOpen(true); }} className="p-2 text-muted-foreground hover:text-secondary rounded-lg"><Edit2 size={14}/></button>
                                <button onClick={() => handleDeleteDept(d.id)} className="p-2 text-muted-foreground hover:text-destructive rounded-lg"><Trash2 size={14}/></button>
                           </div>
                        </div>
                     </div>
                  </Card>
               ))}
               {activeDepartments.length === 0 && <p className="text-sm text-muted-foreground py-12 text-center bg-muted rounded-3xl border border-dashed">No departments found.</p>}
            </div>
         </div>
      </div>

      {/* College Modal */}
      {isCollegeModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <Card className="w-full max-w-md p-0 overflow-hidden relative shadow-2xl">
                  <div className="bg-primary p-6 text-primary-foreground flex justify-between items-center">
                    <h3 className="font-bold text-lg">{editingCollege ? 'Edit Faculty' : 'New Faculty / College'}</h3>
                    <button onClick={() => setIsCollegeModalOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground"><X size={20}/></button>
                  </div>
                  <form className="p-6 space-y-4" onSubmit={handleSaveCollege}>
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Faculty Name</label>
                          <input required value={collegeForm.name} onChange={e => setCollegeForm({...collegeForm, name: e.target.value})} className="w-full p-2.5 bg-muted border border-border rounded-xl outline-none" placeholder="e.g. Faculty of Engineering" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Dean / Head</label>
                          <input value={collegeForm.dean_name} onChange={e => setCollegeForm({...collegeForm, dean_name: e.target.value})} className="w-full p-2.5 bg-muted border border-border rounded-xl outline-none" placeholder="Prof. Name" />
                      </div>
                      <Button className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90">Save Faculty Details</Button>
                  </form>
              </Card>
          </div>
      )}

      {/* Department Modal */}
      {isDeptModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <Card className="w-full max-w-md p-0 overflow-hidden relative shadow-2xl">
                  <div className="bg-secondary p-6 text-secondary-foreground flex justify-between items-center">
                    <h3 className="font-bold text-lg">{editingDept ? 'Edit Department' : 'New Department'}</h3>
                    <button onClick={() => setIsDeptModalOpen(false)} className="text-secondary-foreground/80 hover:text-secondary-foreground"><X size={20}/></button>
                  </div>
                  <form className="p-6 space-y-4" onSubmit={handleSaveDept}>
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Parent College / Faculty</label>
                          <select required value={deptForm.college_id} onChange={e => setDeptForm({...deptForm, college_id: e.target.value})} className="w-full p-2.5 bg-muted border border-border rounded-xl outline-none">
                              <option value="">Select Parent Unit</option>
                              {activeColleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Department Name</label>
                          <input required value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} className="w-full p-2.5 bg-muted border border-border rounded-xl outline-none" placeholder="e.g. Civil Engineering" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Head of Dept (HOD)</label>
                          <input value={deptForm.hod_name} onChange={e => setDeptForm({...deptForm, hod_name: e.target.value})} className="w-full p-2.5 bg-muted border border-border rounded-xl outline-none" placeholder="Dr. Name" />
                      </div>
                      <Button className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90">Add Department</Button>
                  </form>
              </Card>
          </div>
      )}
    </div>
  );
};
