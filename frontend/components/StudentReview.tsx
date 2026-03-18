
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Student, AdminUser, ClearanceStatus, OverallStatus, DocumentRequirement } from '../types';
import { REQUIREMENTS, OFFICE_CONFIG } from '../services/mockData';
import { Button, StatusBadge, Card, LoadingSpinner } from './UI';
import { 
  ChevronLeft, ChevronRight, CheckCircle, XCircle, X, AlertTriangle, 
  ExternalLink, GraduationCap, MapPin, Building2, User, ChevronDown, 
  FileText, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2, Save,
  ArrowLeft, ArrowRight, Printer, Flag, Eye, Download, Copy, Phone, Mail,
  Columns, Layout, RefreshCw, CheckSquare, Square
} from 'lucide-react';

interface Props {
  student: Student;
  adminUser: AdminUser;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StudentReview = ({ student, adminUser, onBack, onNext, onPrev }: Props) => {
  // --- State ---
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'SINGLE' | 'COMPARE'>('SINGLE');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [comment, setComment] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [undoTimer, setUndoTimer] = useState<number | null>(null);
  
  // --- Derived Data ---
  const officeReqs = useMemo(() => REQUIREMENTS.filter(r => r.office_type === adminUser.office_type), [adminUser.office_type]);
  const currentItem = student.clearance_record.items.find(i => i.office_type === adminUser.office_type);
  const documents = currentItem?.documents || [];
  const activeDoc = documents[activeDocIndex];
  
  // If no documents, we might want to handle empty state in viewer
  const activeReq = activeDoc ? officeReqs.find(r => r.document_type === activeDoc.document_type) : null;

  const isChecklistComplete = officeReqs.length > 0 && officeReqs.every(req => checklist[req.id]);
  const isRejectValid = comment.trim().length > 5;

  // --- Effects ---

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in textarea
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      switch(e.key) {
        case 'ArrowRight': onNext(); break;
        case 'ArrowLeft': onPrev(); break;
        case 'j': setActiveDocIndex(prev => Math.max(0, prev - 1)); break;
        case 'k': setActiveDocIndex(prev => Math.min(documents.length - 1, prev + 1)); break;
        case 'f': toggleFullscreen(); break;
        case '?': setShowShortcuts(prev => !prev); break;
        case 'Escape': setConfirmationModal(null); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [documents.length, onNext, onPrev]);

  // Auto-dismiss shortcuts hint
  useEffect(() => {
    const timer = setTimeout(() => setShowShortcuts(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---

  const handleChecklistToggle = (reqId: string) => {
    setChecklist(prev => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  const handleSaveDraft = () => {
    setIsDraftSaving(true);
    // Simulate save
    setTimeout(() => setIsDraftSaving(false), 800);
  };

  const handleDecision = (type: 'APPROVE' | 'REJECT') => {
    setConfirmationModal(type);
  };

  const confirmDecision = () => {
    setConfirmationModal(null);
    // Show undo toast
    setUndoTimer(10);
    const interval = setInterval(() => {
      setUndoTimer(prev => {
        if (prev === 1) {
          clearInterval(interval);
          if (confirmationModal === 'APPROVE') onNext(); // Auto advance on approve
          return null;
        }
        return (prev || 0) - 1;
      });
    }, 1000);
  };

  const cancelUndo = () => {
    setUndoTimer(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.getElementById('document-viewer')?.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
  };

  const insertTemplate = (text: string) => {
      setComment(prev => prev + (prev ? '\n' : '') + text);
  };

  // --- Render Helpers ---

  const REJECTION_TEMPLATES = [
    "Document is blurry or illegible.",
    "Incorrect document uploaded.",
    "Official stamp/signature missing.",
    "Document has expired."
  ];

  return (
    <div className="fixed inset-0 top-16 bg-muted dark:bg-slate-950 flex flex-col z-20">
      
      {/* Undo Toast */}
      {undoTimer && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-4">
              <div className="flex flex-col">
                  <span className="font-bold">Action Processed</span>
                  <span className="text-xs text-muted-foreground">Finalizing in {undoTimer}s...</span>
              </div>
              <Button size="sm" variant="secondary" onClick={cancelUndo}>Undo</Button>
          </div>
      )}

      {/* Confirmation Modals */}
      {confirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-card dark:bg-secondary rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-border animate-in zoom-in-95">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${confirmationModal === 'APPROVE' ? 'bg-primary/20 text-primary' : 'bg-red-100 text-red-600'}`}>
                      {confirmationModal === 'APPROVE' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                  </div>
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">
                      {confirmationModal === 'APPROVE' ? 'Approve Clearance?' : 'Reject Clearance?'}
                  </h3>
                  <p className="text-muted-foreground dark:text-muted-foreground mb-6">
                      {confirmationModal === 'APPROVE' 
                        ? `You are about to approve ${student.name}'s clearance for ${OFFICE_CONFIG.find(o => o.id === adminUser.office_type)?.label}.`
                        : `You are about to reject this clearance. The student will be notified to make corrections.`
                      }
                  </p>
                  
                  {confirmationModal === 'APPROVE' && (
                       <div className="bg-muted rounded-lg p-3 mb-6 flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                           <CheckSquare size={16} className="text-emerald-500" />
                           <span>All {officeReqs.length} requirements verified</span>
                       </div>
                  )}

                  {confirmationModal === 'REJECT' && (
                      <div className="bg-muted rounded-lg p-3 mb-6 border-l-4 border-red-500">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Rejection Reason:</p>
                          <p className="text-sm italic text-foreground/80 dark:text-muted-foreground/80">"{comment}"</p>
                      </div>
                  )}

                  <div className="flex gap-3">
                      <Button variant="secondary" className="flex-1" onClick={() => setConfirmationModal(null)}>Cancel</Button>
                      <Button 
                        variant={confirmationModal === 'APPROVE' ? 'success' : 'danger'} 
                        className="flex-1" 
                        onClick={confirmDecision}
                      >
                          Confirm {confirmationModal === 'APPROVE' ? 'Approval' : 'Rejection'}
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Shortcuts Overlay */}
      {showShortcuts && (
          <div className="fixed bottom-4 right-4 z-40 bg-secondary/90 text-white p-4 rounded-xl backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-right w-64 pointer-events-none">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground border-b border-slate-700 pb-2">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span>Next / Prev Doc</span> <span className="text-emerald-400">J / K</span></div>
                  <div className="flex justify-between"><span>Next / Prev Student</span> <span className="text-emerald-400">→ / ←</span></div>
                  <div className="flex justify-between"><span>Fullscreen</span> <span className="text-emerald-400">F</span></div>
                  <div className="flex justify-between"><span>Close Modal</span> <span className="text-emerald-400">Esc</span></div>
                  <div className="flex justify-between"><span>Toggle Hints</span> <span className="text-emerald-400">?</span></div>
              </div>
          </div>
      )}

      {/* Quick Actions Bar */}
      <div className="h-12 bg-card dark:bg-secondary border-b border-slate-200 dark:border-border flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
             <button onClick={onBack} className="hover:text-primary transition-colors">Queue</button>
             <ChevronRight size={14} />
             <span>Review</span>
             <ChevronRight size={14} />
             <span className="font-bold text-foreground dark:text-white">{student.name}</span>
         </div>
         <div className="flex items-center gap-2">
             <Button size="sm" variant="outline" onClick={() => window.print()} title="Print Review">
                 <Printer size={14} /> <span className="hidden sm:inline">Print</span>
             </Button>
             <Button size="sm" variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-800 bg-primary/5 dark:bg-amber-900/10 hover:bg-amber-100" title="Flag for Admin">
                 <Flag size={14} /> <span className="hidden sm:inline">Flag</span>
             </Button>
         </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar: Student Info */}
          <aside className="w-[300px] bg-card dark:bg-secondary border-r border-slate-200 dark:border-border flex flex-col shrink-0 overflow-y-auto hidden xl:flex">
              <div className="p-6 text-center border-b border-border dark:border-border">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 overflow-hidden border-4 border-slate-50 dark:border-slate-950 shadow-lg relative">
                      {student.passport_photo_url ? (
                          <img src={student.passport_photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">{student.name.charAt(0)}</div>
                      )}
                  </div>
                  <h2 className="font-bold text-lg text-foreground dark:text-white leading-tight mb-1">{student.name}</h2>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted rounded text-xs font-mono text-muted-foreground dark:text-muted-foreground mb-4 cursor-pointer hover:bg-muted dark:hover:bg-slate-700 transition-colors" title="Click to copy" onClick={() => navigator.clipboard.writeText(student.jamb_number)}>
                      {student.jamb_number} <Copy size={10} />
                  </div>
                  <StatusBadge status={currentItem?.status || 'pending'} className="w-full justify-center" />
              </div>

              <div className="flex-1 p-6 space-y-6">
                  <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Academic Details</h3>
                      <div className="space-y-3 text-sm">
                          <div>
                              <p className="text-muted-foreground text-xs mb-0.5">Department</p>
                              <p className="font-medium text-foreground dark:text-white flex items-center gap-2"><GraduationCap size={14} /> {student.department}</p>
                          </div>
                          <div>
                              <p className="text-muted-foreground text-xs mb-0.5">College</p>
                              <p className="font-medium text-foreground dark:text-white flex items-center gap-2"><Building2 size={14} /> {student.college}</p>
                          </div>
                          <div>
                              <p className="text-muted-foreground text-xs mb-0.5">Session</p>
                              <p className="font-medium text-foreground dark:text-white">{student.admission_year}</p>
                          </div>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Contact</h3>
                      <div className="space-y-2 text-sm">
                          <a href={`mailto:${student.email}`} className="flex items-center gap-2 text-primary hover:underline">
                              <Mail size={14} /> {student.email}
                          </a>
                          <a href={`tel:${student.phone}`} className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground/80 hover:text-foreground dark:hover:text-white">
                              <Phone size={14} /> {student.phone}
                          </a>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Other Clearances</h3>
                      <div className="space-y-2">
                          {OFFICE_CONFIG.filter(o => o.id !== adminUser.office_type).map(office => {
                              const item = student.clearance_record.items.find(i => i.office_type === office.id);
                              return (
                                  <div key={office.id} className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground dark:text-muted-foreground truncate w-32">{office.label}</span>
                                      <div className={`w-2 h-2 rounded-full ${
                                          item?.status === 'approved' ? 'bg-primary/100' :
                                          item?.status === 'rejected' ? 'bg-red-500' :
                                          item?.status === 'pending' ? 'bg-primary/50' : 'bg-slate-300 dark:bg-slate-700'
                                      }`} title={item?.status}></div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>

              {/* Sidebar Navigation */}
              <div className="p-4 border-t border-slate-200 dark:border-border grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={onPrev} title="Previous Student">
                      <ArrowLeft size={14} /> Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={onNext} title="Next Student">
                      Next <ArrowRight size={14} />
                  </Button>
              </div>
          </aside>

          {/* Center Panel: Viewer */}
          <main className="flex-1 bg-slate-100 dark:bg-slate-950 relative flex flex-col min-w-0" id="document-viewer">
              {/* Document Tabs */}
              <div className="flex overflow-x-auto bg-card dark:bg-secondary border-b border-slate-200 dark:border-border scrollbar-hide">
                  {documents.length > 0 ? documents.map((doc, idx) => (
                      <button
                          key={doc.id}
                          onClick={() => setActiveDocIndex(idx)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-r border-border dark:border-border whitespace-nowrap transition-colors ${
                              activeDocIndex === idx 
                              ? 'bg-primary/10 text-primary border-b-2 border-b-blue-600' 
                              : 'text-muted-foreground dark:text-muted-foreground hover:bg-muted hover:bg-accent'
                          }`}
                      >
                          <FileText size={16} />
                          {doc.document_type.replace('_', ' ')}
                          {idx === activeDocIndex && <span className="w-1.5 h-1.5 rounded-full bg-primary/100 ml-1"></span>}
                      </button>
                  )) : (
                      <div className="p-3 text-sm text-muted-foreground italic px-4">No documents uploaded</div>
                  )}
              </div>

              {/* Toolbar */}
              <div className="h-12 bg-card dark:bg-secondary border-b border-slate-200 dark:border-border flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                      <button onClick={() => setViewMode(viewMode === 'SINGLE' ? 'COMPARE' : 'SINGLE')} className={`p-1.5 rounded hover:bg-slate-100 hover:bg-accent ${viewMode === 'COMPARE' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`} title="Compare Mode">
                          {viewMode === 'SINGLE' ? <Layout size={18} /> : <Columns size={18} />}
                      </button>
                      <div className="h-4 w-px bg-muted dark:bg-slate-700 mx-1"></div>
                      <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 rounded hover:bg-slate-100 hover:bg-accent text-muted-foreground"><ZoomOut size={18} /></button>
                      <span className="text-xs font-mono w-10 text-center text-muted-foreground">{(zoom * 100).toFixed(0)}%</span>
                      <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1.5 rounded hover:bg-slate-100 hover:bg-accent text-muted-foreground"><ZoomIn size={18} /></button>
                      <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-1.5 rounded hover:bg-slate-100 hover:bg-accent text-muted-foreground ml-1"><RotateCw size={18} /></button>
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                      {activeDoc ? `${activeDoc.file_name} (${(activeDoc.file_size/1024).toFixed(0)}KB)` : ''}
                  </div>
              </div>

              {/* Viewer Area */}
              <div className="flex-1 overflow-hidden relative flex">
                  {/* Primary Doc */}
                  <div className={`flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-muted/50 dark:bg-black/20 ${viewMode === 'COMPARE' ? 'border-r border-border dark:border-slate-700' : ''}`}>
                      {activeDoc ? (
                          <div 
                              className="relative shadow-2xl transition-transform duration-200 ease-out origin-center bg-white dark:bg-card max-w-full"
                              style={{ 
                                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                  maxWidth: zoom <= 1 ? '100%' : 'none',
                                  maxHeight: zoom <= 1 ? '100%' : 'none'
                              }}
                          >
                              {activeDoc.file_url.toLowerCase().endsWith('.pdf') || activeDoc.file_url.includes('application/pdf') ? (
                                  <iframe 
                                      src={`${activeDoc.file_url}#toolbar=0&navpanes=0&view=FitH`} 
                                      className="w-full sm:w-[600px] md:w-[700px] lg:w-[800px] h-[600px] sm:h-[700px] md:h-[850px] border-0 rounded-lg" 
                                      title={`PDF Preview: ${activeDoc.file_name}`}
                                      onError={(e) => {
                                          console.error('PDF failed to load:', activeDoc.file_url);
                                      }}
                                  />
                              ) : (
                                  <img 
                                      src={activeDoc.file_url} 
                                      alt={`Document: ${activeDoc.file_name}`} 
                                      className="max-w-full max-h-[80vh] object-contain rounded-lg" 
                                      draggable={false}
                                      onError={(e) => {
                                          console.error('Image failed to load:', activeDoc.file_url);
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          const errorDiv = document.createElement('div');
                                          errorDiv.className = 'p-8 text-center text-muted-foreground';
                                          errorDiv.innerHTML = '<p class="text-lg font-semibold mb-2">Failed to load document</p><p class="text-sm">The document could not be displayed</p>';
                                          target.parentElement?.appendChild(errorDiv);
                                      }}
                                  />
                              )}
                          </div>
                      ) : (
                          <div className="text-center text-muted-foreground py-12">
                              <FileText size={48} className="mx-auto mb-4 opacity-50" />
                              <p className="text-lg font-medium">No document selected</p>
                              <p className="text-sm mt-2 text-muted-foreground/60">Select a document from the tabs above</p>
                          </div>
                      )}
                  </div>

                  {/* Comparison Doc (Mock Example) */}
                  {viewMode === 'COMPARE' && (
                      <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-slate-100 dark:bg-secondary/50 relative">
                          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold pointer-events-none z-10 backdrop-blur-sm">
                              Example Standard
                          </div>
                          <div className="relative shadow-xl opacity-80 grayscale-[50%] bg-card border-2 border-dashed border-border dark:border-slate-700 p-6 flex items-center justify-center h-[600px] sm:h-[700px] md:h-[800px] w-full max-w-[600px] rounded-lg">
                              <div className="text-center text-muted-foreground">
                                  <FileText size={48} className="mx-auto mb-4" />
                                  <p className="font-medium">Standard Example for</p>
                                  <p className="text-sm mt-1">{activeDoc?.document_type.replace(/_/g, ' ')}</p>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </main>

          {/* Right Sidebar: Review Panel */}
          <aside className="w-[320px] bg-card dark:bg-secondary border-l border-slate-200 dark:border-border flex flex-col shrink-0">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-border bg-muted dark:bg-slate-950/30">
                  <h3 className="font-bold text-foreground dark:text-white flex items-center gap-2">
                      <CheckSquare size={18} className="text-primary" />
                      Verification Checklist
                  </h3>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Requirements List */}
                  <div className="space-y-3">
                      {officeReqs.map(req => (
                          <div 
                            key={req.id} 
                            onClick={() => handleChecklistToggle(req.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                checklist[req.id] 
                                ? 'bg-primary/10 dark:bg-emerald-900/10 border-primary/20 dark:border-emerald-800' 
                                : 'bg-card dark:bg-secondary border-border hover:border-blue-300'
                            }`}
                          >
                              <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                  checklist[req.id] ? 'bg-primary/100 border-emerald-500 text-white' : 'border-border dark:border-slate-600'
                              }`}>
                                  {checklist[req.id] && <CheckCircle size={14} />}
                              </div>
                              <div className="flex-1">
                                  <p className={`text-sm font-medium ${checklist[req.id] ? 'text-emerald-900 dark:text-emerald-100' : 'text-foreground/80 dark:text-muted-foreground/80'}`}>
                                      {req.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Progress Bar */}
                  <div>
                      <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase mb-1">
                          <span>Progress</span>
                          <span>{Object.values(checklist).filter(Boolean).length}/{officeReqs.length}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/100 transition-all duration-300" style={{ width: `${(Object.values(checklist).filter(Boolean).length / officeReqs.length) * 100}%` }}></div>
                      </div>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-2">
                      <div className="flex items-center justify-between">
                          <h4 className="font-bold text-foreground dark:text-white text-sm">Review Notes</h4>
                          <span className="text-xs text-muted-foreground">{comment.length}/500</span>
                      </div>
                      
                      {/* Templates Dropdown */}
                      <div className="relative group">
                          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mb-2">
                              Insert Template <ChevronDown size={12} />
                          </button>
                          <div className="absolute top-full left-0 w-64 bg-card bg-muted shadow-xl rounded-lg border border-border p-1 hidden group-hover:block z-10">
                              {REJECTION_TEMPLATES.map((tmpl, i) => (
                                  <button key={i} onClick={() => insertTemplate(tmpl)} className="w-full text-left p-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-foreground/80 dark:text-foreground/80">
                                      {tmpl}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <textarea 
                          className="w-full h-32 p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          placeholder="Add notes (required for rejection)..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value.slice(0, 500))}
                      ></textarea>
                  </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-border bg-muted dark:bg-slate-950/30 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="success" 
                        disabled={!isChecklistComplete} 
                        className="w-full justify-center"
                        onClick={() => handleDecision('APPROVE')}
                        title={!isChecklistComplete ? "Verify all requirements first" : ""}
                      >
                          <CheckCircle size={18} /> Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        className="w-full justify-center"
                        onClick={() => handleDecision('REJECT')}
                        disabled={!isRejectValid}
                        title={!isRejectValid ? "Comment required for rejection" : ""}
                      >
                          <XCircle size={18} /> Reject
                      </Button>
                  </div>
                  <Button variant="secondary" className="w-full justify-center text-xs h-8" onClick={handleSaveDraft}>
                      {isDraftSaving ? <LoadingSpinner variant="button" /> : <><Save size={14} /> Save Draft</>}
                  </Button>
              </div>
          </aside>
      </div>

      {/* Mobile Stack Layout Warning (since complex review is desktop-first, we provide a simpler view or warning) */}
      <div className="lg:hidden fixed inset-0 bg-muted dark:bg-secondary z-50 flex flex-col items-center justify-center p-8 text-center">
           <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-6">
               <Columns size={32} />
           </div>
           <h2 className="text-xl font-bold mb-2 text-foreground dark:text-white">Desktop View Recommended</h2>
           <p className="text-muted-foreground dark:text-muted-foreground mb-8 max-w-xs">
               The detailed review interface is optimized for larger screens to allow side-by-side document comparison and verification.
           </p>
           <Button onClick={onBack}>Back to Queue</Button>
      </div>

    </div>
  );
};
