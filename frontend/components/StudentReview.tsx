import React, { useState, useEffect, useMemo } from 'react';
import { AdminUser, ClearanceStatus, DocumentRequirement, ClearanceItem } from '../types';
import { Button, StatusBadge, Card, LoadingSpinner } from './UI';
import { 
  ChevronLeft, ChevronRight, CheckCircle, XCircle, X, AlertTriangle, 
  FileText, ZoomIn, ZoomOut, RotateCw, Save,
  ArrowLeft, ArrowRight, CheckSquare, Square, ChevronDown
} from 'lucide-react';
import { recordService } from '../services/recordService';

interface Props {
  clearanceItem: ClearanceItem;
  adminUser: AdminUser;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: () => void;
}

const REJECTION_TEMPLATES = [
    "Documents are blurry or unreadable.",
    "The uploaded file is not the correct document type.",
    "The name on the document does not match the student record.",
    "Document has expired or is invalid."
];

export const StudentReview = ({ clearanceItem, adminUser, onBack, onNext, onPrev, onUpdate }: Props) => {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [comment, setComment] = useState(clearanceItem.officer_comments || '');
  const [allRequirements, setAllRequirements] = useState<DocumentRequirement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      const fetchReqs = async () => {
          try {
              const reqs = await recordService.getRequirements();
              setAllRequirements(reqs.filter(r => r.office_type === clearanceItem.office_type));
          } catch (err) {
              console.error('Failed to fetch requirements:', err);
          }
      };
      fetchReqs();
  }, [clearanceItem.office_type]);

  const documents = clearanceItem.documents || [];
  const activeDoc = documents[activeDocIndex];

  const isChecklistComplete = allRequirements.length > 0 && allRequirements.every(req => checklist[req.id]);
  const isRejectValid = comment.trim().length > 5;

  const handleChecklistToggle = (reqId: string) => {
    setChecklist(prev => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  const handleDecision = async (decision: 'approved' | 'rejected') => {
      setIsSubmitting(true);
      try {
          await recordService.updateClearanceStatus(clearanceItem.id, {
              status: decision,
              officer_comments: comment
          });
          onUpdate();
      } catch (err) {
          console.error('Failed to update status:', err);
          alert('Failed to update clearance status');
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] lg:h-[calc(100vh-100px)] bg-background animate-in fade-in duration-300">
      {/* Top Navigation Bar */}
      <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground group">
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="h-6 w-px bg-border mx-1"></div>
              <div>
                  <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                      Review: {clearanceItem.student_name}
                      <StatusBadge status={clearanceItem.status} size="sm" />
                  </h2>
              </div>
          </div>

          <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onPrev}><ChevronLeft size={18} /> Prev</Button>
              <Button variant="outline" size="sm" onClick={onNext}>Next <ChevronRight size={18} /></Button>
          </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Content Area: Document Viewer */}
          <main className="flex-1 flex flex-col bg-muted/30 relative">
              {/* Document Tabs */}
              <div className="flex bg-card border-b border-border px-4 overflow-x-auto no-scrollbar">
                  {documents.map((doc, i) => (
                      <button
                        key={doc.id}
                        onClick={() => setActiveDocIndex(i)}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                            activeDocIndex === i
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                          {doc.document_type.replace(/_/g, ' ')}
                      </button>
                  ))}
                  {documents.length === 0 && (
                      <div className="px-6 py-3 text-sm text-muted-foreground font-medium italic">No documents uploaded</div>
                  )}
              </div>

              {/* Viewer */}
              <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                  {activeDoc ? (
                      <div className="bg-card shadow-2xl rounded-lg overflow-hidden border border-border w-full max-w-4xl h-full flex flex-col">
                          <div className="bg-muted p-3 border-b border-border flex justify-between items-center">
                              <span className="text-xs font-mono font-bold text-muted-foreground">{activeDoc.file_name}</span>
                          </div>
                          <div className="flex-1 bg-white flex items-center justify-center overflow-auto">
                               {activeDoc.file.toLowerCase().endsWith('.pdf') ? (
                                   <iframe src={activeDoc.file} className="w-full h-full border-none" />
                               ) : (
                                   <img src={activeDoc.file} alt="Preview" className="max-w-full max-h-full object-contain" />
                               )}
                          </div>
                      </div>
                  ) : (
                      <div className="text-center">
                          <FileText size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                          <h3 className="text-xl font-bold text-muted-foreground">No Document Selected</h3>
                      </div>
                  )}
              </div>
          </main>

          {/* Right Sidebar: Review Panel */}
          <aside className="w-full lg:w-80 bg-card border-t lg:border-t-0 lg:border-l border-border flex flex-col shrink-0">
              <div className="p-4 border-b border-border bg-muted/20">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                      <CheckSquare size={18} className="text-primary" />
                      Checklist
                  </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <div className="space-y-3">
                      {allRequirements.map(req => (
                          <div 
                            key={req.id} 
                            onClick={() => handleChecklistToggle(req.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                checklist[req.id] 
                                ? 'bg-primary/10 border-primary/30'
                                : 'bg-card border-border hover:border-primary/50'
                            }`}
                          >
                              <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                  checklist[req.id] ? 'bg-primary text-white border-primary' : 'border-border'
                              }`}>
                                  {checklist[req.id] && <CheckCircle size={14} />}
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold">{req.label}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{req.description}</p>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="space-y-2">
                      <h4 className="font-bold text-sm">Review Comments</h4>
                      <textarea 
                          className="w-full h-32 p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
                          placeholder="Add notes for the student..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <div className="flex flex-wrap gap-1">
                          {REJECTION_TEMPLATES.map((tmpl, i) => (
                              <button
                                key={i}
                                onClick={() => setComment(tmpl)}
                                className="text-[10px] px-2 py-1 bg-muted hover:bg-border rounded-full border border-border transition-colors font-medium"
                              >
                                  {tmpl.split(' ')[0]}...
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/10 space-y-3">
                  <Button
                    variant="success"
                    className="w-full"
                    disabled={!isChecklistComplete || isSubmitting}
                    onClick={() => handleDecision('approved')}
                  >
                      {isSubmitting ? <LoadingSpinner variant="button" /> : <><CheckCircle size={18} /> Approve Clearance</>}
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    disabled={!isRejectValid || isSubmitting}
                    onClick={() => handleDecision('rejected')}
                  >
                      {isSubmitting ? <LoadingSpinner variant="button" /> : <><XCircle size={18} /> Reject Submission</>}
                  </Button>
              </div>
          </aside>
      </div>
    </div>
  );
};
