import React, { useState, useRef, useMemo, useEffect } from 'react';
import { OfficeType, ClearanceRecord, DocumentRequirement, ClearanceStatus } from '../types';
export const OFFICE_CONFIG = [
  { id: 'ADMISSIONS', label: 'Admissions Office', icon: BookOpen, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { id: 'MEDICAL', label: 'Medical Centre', icon: HeartPulse, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  { id: 'DEPARTMENT', label: 'Department', icon: Library, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
] as const;
import { Button, StatusBadge, PageHeader, Card, LoadingSpinner } from '../components/UI';
import { BookOpen, HeartPulse, Library } from 'lucide-react';
import { DocumentPreviewModal } from '../components/student/DocumentPreviewModal';
import { 
  CheckCircle, FileText, Trash2, Loader2, 
  UploadCloud, Eye, RefreshCw, XCircle, 
  ShieldCheck, ArrowLeft, ArrowRight, AlertCircle,
  ChevronLeft, ChevronRight, CheckSquare, Info
} from 'lucide-react';
import { recordService } from '../services/recordService';

interface Props {
  officeType: OfficeType;
  clearanceRecord: ClearanceRecord;
  onBack: () => void;
  onUpload: (req: DocumentRequirement, data: string, file: File) => void;
  onRemove: (docId: string, officeType: OfficeType) => void;
  onSubmit: (officeType: OfficeType) => void;
  uploadingStatus: Record<string, boolean>;
}

// Sub-component for individual document cards
const DocumentCard = ({ 
    req, 
    item, 
    onUpload, 
    onPreview,
    isUploading
}: {
    req: DocumentRequirement,
    item: any,
    onUpload: (req: DocumentRequirement, data: string, file: File) => void,
    onPreview: (doc: any) => void,
    isUploading: boolean
}) => {
    const doc = item?.documents.find((d: any) => d.document_type === req.document_type);
    const isUploaded = !!doc;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > req.max_file_size) {
                alert(`File is too large. Max size is ${(req.max_file_size/1024/1024).toFixed(0)}MB.`);
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                 onUpload(req, reader.result as string, file);
            };
            reader.readAsDataURL(file);
        }
    };

    const cardBorder = isUploaded 
            ? 'border-primary/30' 
            : 'border-border';
    
    const cardBg = isUploaded 
            ? 'bg-primary/5' 
            : 'bg-card';

    return (
        <div className={`relative rounded-2xl border ${cardBorder} ${cardBg} transition-all duration-300 group overflow-hidden`}>
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept={req.accepted_formats}
                onChange={handleFileChange}
            />

            <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-foreground text-base">{req.label}</h4>
                        {isUploaded && (
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Uploaded
                            </span>
                        )}
                        {!isUploaded && req.is_required && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Required
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl whitespace-pre-wrap">
                        {req.description}
                    </p>
                </div>
            </div>

            <div className="px-5 pb-5">
                {isUploading ? (
                    <div className="h-24 rounded-xl bg-muted border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary">
                        <Loader2 size={24} className="animate-spin mb-2" />
                        <span className="text-sm font-medium">Uploading...</span>
                    </div>
                ) : isUploaded ? (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-background border border-border p-4 rounded-xl shadow-sm">
                            <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                                <p className="text-sm font-bold text-foreground truncate">{doc.file_name}</p>
                                <p className="text-xs text-muted-foreground">{(doc.file_size / 1024).toFixed(0)} KB • {new Date(doc.upload_date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => onPreview(doc)}>
                                    <Eye size={14} /> Preview
                                </Button>
                                <Button size="sm" variant="secondary" className="flex-1 sm:flex-none" onClick={() => fileInputRef.current?.click()}>
                                    <RefreshCw size={14} /> Replace
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group/upload border-border hover:border-primary hover:bg-primary/5 bg-muted/50"
                    >
                        <div className="p-2 bg-card rounded-full shadow-sm text-muted-foreground group-hover/upload:text-primary group-hover/upload:scale-110 transition-all">
                            <UploadCloud size={20} />
                        </div>
                        <p className="text-sm font-bold text-foreground">Click to Upload</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function OfficeView({ 
    officeType, 
    clearanceRecord, 
    onBack, 
    onUpload, 
    onRemove, 
    onSubmit,
    uploadingStatus 
}: Props) {
  const [allRequirements, setAllRequirements] = useState<DocumentRequirement[]>([]);
  const [isReqLoading, setIsReqLoading] = useState(true);

  useEffect(() => {
      const fetchReqs = async () => {
          try {
              const reqs = await recordService.getRequirements();
              setAllRequirements(reqs);
          } catch (err) {
              console.error('Failed to fetch requirements:', err);
          } finally {
              setIsReqLoading(false);
          }
      };
      fetchReqs();
  }, []);

  const officeConfig = OFFICE_CONFIG.find(o => o.id === officeType);
  const officeReqs = allRequirements.filter(r => r.office_type === officeType);
  const item = clearanceRecord.items.find(i => i.office_type === officeType);
  const status = item?.status || ClearanceStatus.EMPTY;

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [verifiedDocs, setVerifiedDocs] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const uploadedCount = officeReqs.filter(req => item?.documents.some(d => d.document_type === req.document_type)).length;
  const totalCount = officeReqs.length;
  const isUploadComplete = totalCount > 0 && uploadedCount === totalCount;
  
  const verifiedCount = Object.values(verifiedDocs).filter(Boolean).length;
  const isReviewComplete = totalCount > 0 && verifiedCount === totalCount;
  
  const progressPercent = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;
  const verifyPercent = totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0;

  const handleStartReview = () => {
      setIsReviewMode(true);
      setCurrentSlideIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelReview = () => {
      setIsReviewMode(false);
      setVerifiedDocs({});
  };

  const handleVerify = (docType: string, verified: boolean) => {
      setVerifiedDocs(prev => ({ ...prev, [docType]: verified }));
  };

  const nextSlide = () => {
      if (currentSlideIndex < officeReqs.length - 1) {
          setCurrentSlideIndex(prev => prev + 1);
      }
  };

  const prevSlide = () => {
      if (currentSlideIndex > 0) {
          setCurrentSlideIndex(prev => prev - 1);
      }
  };

  const activeReq = officeReqs[currentSlideIndex];
  const activeDoc = item?.documents.find(d => d.document_type === activeReq?.document_type);

  if (isReqLoading) {
      return <LoadingSpinner text="Fetching requirements..." />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-right duration-300 pb-24 md:pb-0">
      
      <DocumentPreviewModal 
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          document={previewDoc}
          isEditable={!isReviewMode}
          onReplace={() => {
              setPreviewDoc(null);
              const el = document.getElementById(`doc-card-${previewDoc?.document_type}`);
              el?.scrollIntoView({ behavior: 'smooth' });
          }}
      />

      {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
              <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl p-8">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                      <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Ready to Submit?</h3>
                  <p className="text-muted-foreground mb-8 text-center leading-relaxed">
                      You have reviewed and verified all {totalCount} documents. Your application will be sent to the {officeConfig?.label} for final processing.
                  </p>
                  
                  <div className="flex gap-3">
                      <Button variant="secondary" className="flex-1" onClick={() => setShowSubmitModal(false)}>Review Again</Button>
                      <Button variant="primary" className="flex-1" onClick={() => { setShowSubmitModal(false); onSubmit(officeType); }}>Confirm Submission</Button>
                  </div>
              </div>
          </div>
      )}

      {!isReviewMode && (
          <PageHeader 
            title={officeConfig?.label || 'Clearance'} 
            breadcrumbs={['Dashboard', officeConfig?.label || 'Office']}
            actions={<StatusBadge status={status} size="lg" />}
            onBreadcrumbClick={(index: number) => {
                if (index === 0) onBack();
            }}
          />
      )}

      {!isReviewMode ? (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
                {status === ClearanceStatus.REJECTED && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex items-start gap-4 animate-shake">
                        <XCircle size={24} className="text-destructive shrink-0" />
                        <div>
                            <h3 className="font-bold text-destructive">Submission Rejected</h3>
                            <p className="text-destructive/80 mt-1 text-sm">{item?.officer_comments || "Review comments and re-upload."}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {officeReqs.length > 0 ? (
                        officeReqs.map(req => (
                            <div key={req.id} id={`doc-card-${req.document_type}`}>
                                <DocumentCard 
                                    req={req} 
                                    item={item}
                                    onUpload={onUpload}
                                    onPreview={(doc) => setPreviewDoc({ ...doc, status })}
                                    isUploading={uploadingStatus[req.document_type]}
                                />
                            </div>
                        ))
                    ) : (
                        <Card className="text-center py-12">
                            <Info size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground font-medium">No document requirements defined for this office.</p>
                        </Card>
                    )}
                </div>
            </div>

            <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-bold text-foreground">Upload Progress</h3>
                        <span className="text-sm font-bold text-primary">
                            {Math.round(progressPercent)}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center font-medium">
                        {uploadedCount} of {totalCount} documents uploaded
                    </p>

                    <div className="mt-6 pt-6 border-t border-border">
                        <Button 
                            size="lg" 
                            variant="primary"
                            className="w-full"
                            disabled={!isUploadComplete || status === ClearanceStatus.APPROVED}
                            onClick={handleStartReview}
                        >
                            {status === ClearanceStatus.REJECTED ? 'Review & Resubmit' : 'Proceed to Review'} <ArrowRight size={18} />
                        </Button>
                        {!isUploadComplete && totalCount > 0 && (
                            <p className="text-[10px] text-center text-muted-foreground mt-2 font-bold uppercase tracking-widest">
                                Upload all files to proceed
                            </p>
                        )}
                    </div>
                </div>
            </aside>
        </div>
      ) : (
        <div className="min-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md sticky top-[70px] z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleCancelReview}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground group flex items-center gap-2"
                        title="Cancel Review"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold hidden sm:inline">Exit Review</span>
                    </button>
                    <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
                    <div>
                        <h2 className="font-bold text-lg text-foreground leading-none mb-1">Verify Documents</h2>
                        <p className="text-xs text-muted-foreground font-medium">Item {currentSlideIndex + 1} of {officeReqs.length}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {officeReqs.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentSlideIndex(i)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                i === currentSlideIndex 
                                ? 'w-10 bg-primary' 
                                : verifiedDocs[officeReqs[i].document_type]
                                    ? 'w-2.5 bg-primary/100'
                                    : 'w-2.5 bg-muted hover:bg-muted/80'
                            }`}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={prevSlide} 
                        disabled={currentSlideIndex === 0}
                        className="h-10 px-4"
                    >
                        <ChevronLeft size={18} /> Prev
                    </Button>
                    {currentSlideIndex < officeReqs.length - 1 ? (
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={nextSlide}
                            className="h-10 px-4"
                        >
                            Next <ChevronRight size={18} />
                        </Button>
                    ) : (
                        <Button 
                            variant="success" 
                            size="sm" 
                            disabled={!isReviewComplete}
                            onClick={() => setShowSubmitModal(true)}
                            className="h-10 px-6 shadow-lg shadow-emerald-500/20"
                        >
                            Complete Submission
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-12 gap-8 items-stretch mb-10 overflow-hidden">
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
                    <Card className="p-8 bg-muted/20 border-border">
                        <div className="space-y-8 w-full">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                   <FileText size={14} /> Requirement
                                </div>
                                <h3 className="font-extrabold text-foreground text-2xl tracking-tight leading-tight">{activeReq?.label}</h3>
                                <p className="text-muted-foreground text-sm leading-loose">
                                    {activeReq?.description}
                                </p>
                            </div>

                            <div className="h-px bg-border"></div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        Please review the document on the right. Is the content correct and the image clearly readable?
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => handleVerify(activeReq.document_type, !verifiedDocs[activeReq.document_type])}
                                    className={`w-full p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-5 text-center group/verify ${
                                        verifiedDocs[activeReq.document_type]
                                        ? 'bg-primary text-primary-foreground border-primary shadow-2xl scale-[1.02]' 
                                        : 'bg-card border-border text-foreground hover:border-primary hover:shadow-xl'
                                    }`}
                                >
                                    {verifiedDocs[activeReq.document_type] ? (
                                        <>
                                            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center backdrop-blur-md animate-scale-in">
                                                <CheckSquare size={32} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xl mb-1">Document Verified</p>
                                                <p className="text-xs opacity-80 font-medium">Click again to mark as incorrect if needed</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-16 w-16 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground group-hover/verify:text-primary group-hover/verify:border-primary transition-colors">
                                                <CheckSquare size={32} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xl mb-1">Mark as Correct</p>
                                                <p className="text-xs text-muted-foreground font-medium">I confirm this is the valid {activeReq?.label}</p>
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-between text-sm px-2">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                            <Info size={16} className="text-primary" />
                            <span>Verified: {verifiedCount} / {totalCount} items</span>
                        </div>
                        {isReviewComplete && (
                            <div className="text-primary font-extrabold flex items-center gap-1.5 animate-bounce">
                                <CheckCircle size={18} /> All documents ready!
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-8 bg-muted rounded-[2.5rem] overflow-hidden border-4 border-card shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative flex items-center justify-center group/preview h-[60vh] lg:h-auto">
                    {activeDoc ? (
                        activeDoc.file.toLowerCase().endsWith('.pdf') ? (
                            <iframe 
                                src={`${activeDoc.file}#toolbar=0&navpanes=0&scrollbar=0`} 
                                className="w-full h-full bg-background border-none" 
                                title="PDF Document Viewer"
                            />
                        ) : (
                            <div className="w-full h-full overflow-auto p-4 flex items-center justify-center">
                                <img 
                                    src={activeDoc.file} 
                                    alt="Uploaded Document Full Preview" 
                                    className="max-w-full max-h-full object-contain shadow-sm rounded-lg"
                                />
                            </div>
                        )
                    ) : (
                        <div className="text-center p-12">
                            <AlertCircle size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h4 className="text-lg font-bold text-muted-foreground">Document Unavailable</h4>
                            <p className="text-sm text-muted-foreground">Please re-upload this document in the list view.</p>
                        </div>
                    )}
                    
                    <div className="absolute top-6 left-6 flex items-center gap-3 p-3 bg-card/90 backdrop-blur-md rounded-2xl shadow-xl border border-border group-hover/preview:scale-105 transition-transform duration-300">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                            <FileText size={20} />
                        </div>
                        <div className="min-w-0 pr-2">
                            <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{activeDoc?.file_name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{(activeDoc?.file_size / 1024).toFixed(0)} KB • Verified by System</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setPreviewDoc({ ...activeDoc, status })}
                        className="absolute bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/preview:opacity-100"
                        title="Open Full Preview"
                    >
                        <Eye size={24} />
                    </button>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 h-2 bg-muted z-[60]">
                <div 
                    className="h-full bg-primary/100 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                    style={{ width: `${verifyPercent}%` }}
                />
            </div>
        </div>
      )}
    </div>
  );
}
