import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_ADMIN, MOCK_COLLEGES } from '../../services/mockData';
import { Student, ClearanceStatus } from '../../types';
import { Card, Badge, Button } from '../../components/UI';
import { Search, Filter, Download, Building2 } from 'lucide-react';

interface Props {
  onSelectStudent: (s: Student) => void;
}

export const StudentDirectory = ({ onSelectStudent }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // COLLEGE FILTERING LOGIC
  // In a real app, the API would return already filtered results.
  // For this mock, we manually filter by the current logged-in admin's college.
  // Fix: Use college_id for comparison as 'college' doesn't exist on Officer
  const collegeStudents = MOCK_STUDENTS.filter(s => s.college_id === MOCK_ADMIN.college_id);
  const collegeName = MOCK_COLLEGES.find(c => c.id === MOCK_ADMIN.college_id)?.name || 'N/A';

  const filtered = collegeStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.jamb_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.clearance_record.overall_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
         <Building2 size={14} />
         {/* Fix: Display the looked up college name */}
         <span>Viewing students for: <strong className="text-foreground">{collegeName}</strong></span>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
                type="text" 
                placeholder="Search by Name or Reg No..." 
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <select 
                className="px-4 py-2.5 bg-background border border-border rounded-xl text-sm outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="ALL">All Statuses</option>
                {Object.values(ClearanceStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button variant="outline" className="whitespace-nowrap"><Download size={18} /> Export</Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-bold border-b border-border">
                    <tr>
                        <th className="py-4 px-6">Student Details</th>
                        <th className="py-4 px-6">Department</th>
                        <th className="py-4 px-6">Stage</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {filtered.map(student => (
                        <tr key={student.id} className="hover:bg-muted hover:bg-accent/50 transition-colors">
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center font-bold text-sm">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{student.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono">{student.jamb_number}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-muted-foreground dark:text-muted-foreground/80">{student.department}</td>
                            <td className="py-4 px-6 text-sm">
                                <span className="font-medium text-foreground/80 dark:text-foreground/80">Step 3</span>
                                <span className="text-muted-foreground mx-1">/</span>
                                <span className="text-muted-foreground">5</span>
                            </td>
                            <td className="py-4 px-6"><Badge status={student.clearance_record.overall_status} /></td>
                            <td className="py-4 px-6 text-right">
                                <Button size="sm" variant="outline" onClick={() => onSelectStudent(student)}>View</Button>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No students found for this college.</td></tr>
                    )}
                </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};