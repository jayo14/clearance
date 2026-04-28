import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ChevronRight, Loader2, X } from 'lucide-react';

interface Props {
    onSearch?: (query: string) => void;
    onSelectStudent?: (student: any) => void;
    mobile?: boolean;
    onCloseMobile?: () => void;
}

export const OfficerSearch = ({ onSearch, onSelectStudent, mobile, onCloseMobile }: Props) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
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
                    setIsOpen(true);
                }
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (student: any) => {
        if (onSelectStudent) {
            onSelectStudent(student);
        }
        setIsOpen(false);
        setQuery('');
        if (onCloseMobile) onCloseMobile();
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loading ? <Loader2 size={18} className="text-primary animate-spin" /> : <Search size={18} className="text-muted-foreground" />}
                </div>
                <input
                    type="text"
                    className={`block w-full pl-10 pr-10 py-2.5 bg-muted border border-border rounded-xl leading-5 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all ${mobile ? 'text-lg' : 'text-sm'}`}
                    placeholder="Search students by name or JAMB number..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
                {query && (
                    <button 
                        onClick={() => setQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute mt-2 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    {results.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                            {results.map((student) => (
                                <button
                                    key={student.id}
                                    onClick={() => handleSelect(student)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0 group"
                                >
                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono">{student.student_profile?.jamb_number}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    ) : query.length >= 2 ? (
                        <div className="px-4 py-8 text-center">
                            <User size={32} className="mx-auto text-muted-foreground mb-2 opacity-20" />
                            <p className="text-sm font-medium text-muted-foreground">No students found matching "{query}"</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};
