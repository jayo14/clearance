import React, { useState, useEffect } from 'react';
import {
  Building2, School, Landmark, Plus,
  ChevronRight, MoreVertical, Edit2, Trash2,
  Building, Library, Search, RefreshCw
} from 'lucide-react';
import { Card, Button, LoadingSpinner } from '../../components/UI';
import { institutionService } from '../../services/institutionService';

export const StructureManager = () => {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
      setLoading(true);
      try {
          const data = await institutionService.getColleges('1');
          setColleges(data);
      } catch (err) {
          console.error('Failed to fetch structure:', err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Academic Structure</h1>
              <p className="text-sm text-muted-foreground">Manage faculties, colleges and departments</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-primary/20">
              <Plus size={18} /> Add New Faculty
          </Button>
      </div>

      <div className="grid gap-4">
          {loading ? (
              <div className="py-20 flex justify-center"><LoadingSpinner text="Loading structure..." /></div>
          ) : colleges.length === 0 ? (
              <Card className="p-20 text-center flex flex-col items-center border-none bg-muted/30">
                  <Library size={48} className="text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-xl font-bold">No Faculties Found</h3>
                  <p className="text-muted-foreground mt-2">Start by adding your first academic faculty or college.</p>
              </Card>
          ) : (
              colleges.map((college) => (
                  <Card key={college.id} className="p-6 border-border hover:border-primary/50 transition-all group">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                  <Building size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg">{college.name}</h3>
                                  <p className="text-sm text-muted-foreground">Dean: {college.dean_name || 'Not Assigned'}</p>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <Button variant="secondary" size="sm">Manage Departments</Button>
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0"><Edit2 size={18} /></Button>
                          </div>
                      </div>
                  </Card>
              ))
          )}
      </div>
    </div>
  );
};
