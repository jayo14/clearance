import React, { useState, useEffect } from 'react';
import { Search, User, ChevronRight, Filter, ArrowRight } from 'lucide-react';
import { Card, Button, StatusBadge, LoadingSpinner } from '../../components/UI';

interface Props {
  initialQuery: string;
  onSelectStudent: (s: any) => void;
}

export const SearchResults = ({ initialQuery, onSelectStudent }: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/records/search-students/?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Global Search</h1>
              <p className="text-sm text-muted-foreground">Search results for "{query}"</p>
          </div>
      </div>

      <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search by name, JAMB number, or email..."
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
      </div>

      {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner text="Searching database..." /></div>
      ) : results.length > 0 ? (
          <div className="grid gap-4">
              {results.map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 hover:shadow-md transition-all cursor-pointer group border-border"
                    onClick={() => onSelectStudent(student)}
                  >
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                  {student.name.charAt(0)}
                              </div>
                              <div>
                                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</h3>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                      <p className="text-xs text-muted-foreground font-mono">JAMB: {student.student_profile?.jamb_number}</p>
                                      <p className="text-xs text-muted-foreground font-medium">COURSE: {student.student_profile?.course || 'Not Set'}</p>
                                  </div>
                              </div>
                          </div>
                          <Button variant="ghost" className="rounded-xl">
                              View Profile <ChevronRight size={18} />
                          </Button>
                      </div>
                  </Card>
              ))}
          </div>
      ) : query ? (
          <Card className="p-20 text-center flex flex-col items-center border-none bg-muted/30">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 opacity-40">
                  <User size={40} />
              </div>
              <h3 className="text-xl font-bold text-foreground">No students found</h3>
              <p className="text-muted-foreground mt-2">Try searching for a full name or a complete JAMB number.</p>
          </Card>
      ) : null}
    </div>
  );
};
