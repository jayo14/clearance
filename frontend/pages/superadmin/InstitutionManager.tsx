import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Filter,
  MapPin, Globe, ExternalLink, Settings,
  Building, RefreshCw, MoreVertical, Edit2
} from 'lucide-react';
import { Card, Button, LoadingSpinner } from '../../components/UI';
import { institutionService } from '../../services/institutionService';

export const InstitutionManager = () => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstitutions = async () => {
      setLoading(true);
      try {
          // Assuming an endpoint to list all institutions
          const response = await fetch('/api/institutions/institutions/', {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
          });
          if (response.ok) {
              const data = await response.json();
              setInstitutions(data);
          }
      } catch (err) {
          console.error('Failed to fetch institutions:', err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchInstitutions();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Institutions</h1>
              <p className="text-sm text-muted-foreground">Manage and onboard educational institutions</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-primary/20">
              <Plus size={18} /> Register Institution
          </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
              <div className="col-span-full py-20 flex justify-center"><LoadingSpinner text="Loading institutions..." /></div>
          ) : institutions.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                  <Building2 size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground">No institutions registered yet.</p>
              </div>
          ) : (
              institutions.map((inst) => (
                  <Card key={inst.id} className="p-6 border-border hover:shadow-xl transition-all group overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                              {inst.short_name.charAt(0)}
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical size={18} /></Button>
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{inst.name}</h3>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                          <MapPin size={12} /> {inst.location}
                      </p>

                      <div className="pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-1 rounded-md">
                              {inst.type}
                          </span>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-bold">
                              Manage <ChevronRight size={14} />
                          </Button>
                      </div>
                  </Card>
              ))
          )}
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
