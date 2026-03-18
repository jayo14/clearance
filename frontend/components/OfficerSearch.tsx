import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, ChevronRight, User, AlertCircle, History, Command } from 'lucide-react';
import { MOCK_STUDENTS } from '../services/mockData';
import { Student, OverallStatus } from '../types';
import { StatusBadge } from './UI';

interface Props {
  onSearch: (query: string) => void;
  onSelectStudent: (studentId: string) => void;
  className?: string;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export const OfficerSearch = ({ onSearch, onSelectStudent, className = '', mobile = false, onCloseMobile }: Props) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Student[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('officer_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
        if (mobile && onCloseMobile) onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobile, onCloseMobile]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const searchLower = query.toLowerCase();
      const filtered = MOCK_STUDENTS.filter(student => 
        student.name.toLowerCase().includes(searchLower) ||
        student.jamb_number.toLowerCase().includes(searchLower) ||
        student.department.toLowerCase().includes(searchLower)
      );
      setResults(filtered.slice(0, 5)); // Limit to top 5 for dropdown
      setIsSearching(false);
      setSelectedIndex(-1);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const addToRecent = (term: string) => {
    const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('officer_recent_searches', JSON.stringify(newRecent));
  };

  const handleSelect = (student: Student) => {
    addToRecent(student.name);
    setIsOpen(false);
    setQuery('');
    onSelectStudent(student.id || '');
    if (mobile && onCloseMobile) onCloseMobile();
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
    } else {
        addToRecent(query);
        onSearch(query);
        setIsOpen(false);
        if (mobile && onCloseMobile) onCloseMobile();
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const clearRecent = () => {
      setRecentSearches([]);
      localStorage.removeItem('officer_recent_searches');
  };

  // Grouping Results
  const groupedResults: Record<string, Student[]> = useMemo(() => {
      const groups: Record<string, Student[]> = {};
      results.forEach(r => {
          const status = r.clearance_record.overall_status === OverallStatus.IN_PROGRESS ? 'Pending' : 
                         r.clearance_record.overall_status === OverallStatus.APPROVED ? 'Approved' : 
                         r.clearance_record.overall_status === OverallStatus.REJECTED ? 'Rejected' : 'Other';
          if (!groups[status]) groups[status] = [];
          groups[status].push(r);
      });
      return groups;
  }, [results]);

  return (
    <div className={`relative ${className}`}>
      <div className={`relative group ${mobile ? '' : 'max-w-md w-full'}`}>
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none`} size={18} />
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDownInput}
          placeholder="Search students (Name, JAMB, Dept)..." 
          className={`w-full pl-10 pr-12 py-2.5 bg-muted border-transparent focus:bg-background border focus:border-primary/50 rounded-xl text-sm outline-none transition-all placeholder:text-muted-foreground ${mobile ? 'py-4 text-base' : ''}`}
          autoComplete="off"
          autoFocus={mobile}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isSearching ? (
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            ) : query ? (
                <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                </button>
            ) : !mobile && (
                <span className="hidden md:flex items-center gap-1 text-[10px] font-bold text-muted-foreground border border-border px-1.5 py-0.5 rounded bg-muted">
                    <Command size={10} /> K
                </span>
            )}
        </div>
      </div>

      {isOpen && (
        <div 
            ref={dropdownRef}
            className={`absolute left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${mobile ? 'fixed top-[70px] left-4 right-4' : 'w-full'}`}
        >
            {query.length < 2 ? (
                // Recent Searches View
                <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Recent Searches</span>
                        {recentSearches.length > 0 && (
                            <button onClick={clearRecent} className="text-destructive hover:text-destructive/80 hover:underline">Clear</button>
                        )}
                    </div>
                    {recentSearches.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            <History size={24} className="mx-auto mb-2 opacity-50" />
                            No recent searches
                        </div>
                    ) : (
                        recentSearches.map((term, i) => (
                            <button 
                                key={i}
                                onClick={() => { setQuery(term); inputRef.current?.focus(); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg text-sm text-foreground/80 text-left transition-colors"
                            >
                                <Clock size={14} className="text-muted-foreground" />
                                {term}
                            </button>
                        ))
                    )}
                </div>
            ) : results.length === 0 ? (
                // Empty State
                <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                        <AlertCircle size={24} />
                    </div>
                    <p className="text-sm font-medium text-foreground">No students found</p>
                    <p className="text-xs text-muted-foreground mt-1">We couldn't find any matches for "{query}"</p>
                </div>
            ) : (
                // Results List
                <div className="max-h-[400px] overflow-y-auto p-2">
                    {Object.entries(groupedResults).map(([status, group]) => (
                        <div key={status} className="mb-2 last:mb-0">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 rounded mb-1">
                                {status}
                            </div>
                            {group.map((student, idx) => {
                                const globalIndex = results.indexOf(student);
                                return (
                                    <button 
                                        key={student.id}
                                        onClick={() => handleSelect(student)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                                            globalIndex === selectedIndex 
                                            ? 'bg-primary/10 ring-1 ring-primary/20' 
                                            : 'hover:bg-muted'
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                                            {student.passport_photo_url ? (
                                                <img src={student.passport_photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">{student.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-sm text-foreground truncate">{student.name}</span>
                                                <StatusBadge status={student.clearance_record.overall_status} size="sm" className="scale-90 origin-right" />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <span className="font-mono">{student.jamb_number}</span>
                                                <span>•</span>
                                                <span className="truncate">{student.department}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-muted-foreground/80 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    
                    <button 
                        onClick={() => handleSearchSubmit()}
                        className="w-full mt-2 p-3 bg-muted/50 hover:bg-primary/10 text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                        View all results for "{query}"
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};