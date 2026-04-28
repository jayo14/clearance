import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, MoreVertical,
  Mail, Phone, GraduationCap, Building,
  RefreshCw, ChevronRight, User
} from 'lucide-react';
import { Card, Button, LoadingSpinner } from '../../components/UI';

export const StudentDirectory = ({ onSelectStudent }: { onSelectStudent: (s: any) => void }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchStudents = async () => {
      setLoading(true);
      try {
          // List students by college/institution
          const response = await fetch('/api/records/search-students/?q=', {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
          });
          if (response.ok) {
              const data = await response.json();
              setStudents(data);
          }
      } catch (err) {
          console.error('Failed to fetch students:', err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchStudents();
  }, []);

  const filtered = students.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.student_profile?.jamb_number.includes(query)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Student Directory</h1>
              <p className="text-sm text-muted-foreground">Manage and browse students assigned to your office</p>
          </div>
          <Button variant="outline" onClick={fetchStudents} className="flex items-center gap-2">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
      </div>

      <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
      </div>

      <div className="grid gap-4">
          {loading ? (
              <div className="py-20 flex justify-center"><LoadingSpinner text="Loading student records..." /></div>
          ) : filtered.length === 0 ? (
              <Card className="p-20 text-center flex flex-col items-center border-none bg-muted/30">
                  <User size={48} className="text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground font-medium">No students found in the directory.</p>
              </Card>
          ) : (
              filtered.map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => onSelectStudent(student)}
                  >
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                  {student.name.charAt(0)}
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{student.name}</h4>
                                  <p className="text-xs text-muted-foreground font-mono">{student.student_profile?.jamb_number}</p>
                              </div>
                          </div>
                          <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                  </Card>
              ))
          )}
      </div>
    </div>
  );
};
