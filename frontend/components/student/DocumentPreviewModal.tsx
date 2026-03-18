
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Download, RefreshCw, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2, 
  Share2, FileText, Loader2
} from 'lucide-react';
import { Button, StatusBadge } from '../UI';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    file_url: string;
    file_name: string;
    file_size: number;
    upload_date: string;
    document_type: string;
    status: string;
  } | null;
  onDownload?: () => void;
  onReplace?: () => void;
  isEditable?: boolean;
}

export const DocumentPreviewModal = ({ 
  isOpen, 
  onClose, 
  document, 
  onDownload, 
  onReplace, 
  isEditable = false 
}: DocumentPreviewModalProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus Trap Logic
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when opened
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleTabKey = (e: KeyboardEvent) => {
        if (!modalRef.current) return;
        
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.key === 'Tab') {
          if (e.shiftKey) { // Shift + Tab
            if (window.document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else { // Tab
            if (window.document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      window.addEventListener('keydown', handleTabKey);
      window.addEventListener('keydown', handleEscKey);

      return () => {
        window.removeEventListener('keydown', handleTabKey);
        window.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  // Reset state when document changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setIsFullScreen(false);
      setContentLoading(true);
    }
  }, [isOpen, document]);

  // Handle Swipe Down to Close (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStart;
    
    // Simple swipe down logic check can happen here
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentY = e.changedTouches[0].clientY;
    const diff = currentY - touchStart;
    
    if (diff > 150) {
      onClose();
    }
    setTouchStart(null);
  };

  // Zoom Logic
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  
  // Rotate Logic
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  // Full Screen Logic
  const toggleFullScreen = () => {
    if (!document) return;
    if (!isFullScreen) {
      if (contentRef.current?.requestFullscreen) {
        contentRef.current.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (window.document.exitFullscreen) {
        window.document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Download Handler
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (document?.file_url) {
      const link = window.document.createElement('a');
      link.href = document.file_url;
      link.download = document.file_name;
      link.click();
    }
  };

  // Share Handler
  const handleShare = async () => {
    if (navigator.share && document) {
      try {
        await navigator.share({
          title: document.file_name,
          text: `Checking clearance document: ${document.file_name}`,
          url: document.file_url
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  if (!isOpen || !document) return null;

  const fileUrl = document.file_url || '';
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.startsWith('data:application/pdf');

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`bg-card dark:bg-secondary w-full md:max-w-5xl md:h-[85vh] h-full flex flex-col md:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullScreen ? 'fixed inset-0 !max-w-none !h-full rounded-none' : ''}`}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-border bg-card dark:bg-secondary z-10">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
              <FileText size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 id="modal-title" className="font-bold text-foreground dark:text-white truncate text-base md:text-lg">
                {document.file_name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
                <span>{(document.file_size / 1024).toFixed(0)} KB</span>
                <span>•</span>
                <span>{new Date(document.upload_date).toLocaleDateString()}</span>
                <span className="hidden sm:inline">•</span>
                <StatusBadge status={document.status} size="sm" className="hidden sm:inline-flex" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={document.status} size="sm" className="sm:hidden" />
            <button 
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-muted-foreground dark:hover:text-foreground/80 hover:bg-slate-100 hover:bg-accent rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close preview"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div 
          ref={contentRef}
          className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-hidden relative flex items-center justify-center group"
          onWheel={(e) => {
            if (e.ctrlKey) {
              e.preventDefault();
              e.deltaY > 0 ? handleZoomOut() : handleZoomIn();
            }
          }}
        >
          {/* Content Loader */}
          {contentLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10" aria-live="polite">
                  <Loader2 size={48} className="animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground dark:text-muted-foreground font-medium">Loading preview...</p>
              </div>
          )}

          {/* Actual Content */}
          <div 
            className="transition-transform duration-200 ease-out origin-center"
            style={{ 
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: isFullScreen ? 'none' : '100%',
              maxHeight: isFullScreen ? 'none' : '100%'
            }}
          >
             {isPdf ? (
                 <iframe 
                    src={`${document.file_url}#toolbar=0`} 
                    className="w-[800px] h-[1000px] max-w-none shadow-lg bg-card" 
                    title={`PDF Preview of ${document.file_name}`}
                    onLoad={() => setContentLoading(false)}
                 />
             ) : (
                 <img 
                    src={document.file_url} 
                    alt={document.file_name} 
                    className="max-w-full max-h-full object-contain shadow-lg"
                    onLoad={() => setContentLoading(false)}
                    draggable={false}
                 />
             )}
          </div>

          {/* Controls Overlay (Bottom) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-secondary/80 backdrop-blur-md rounded-full text-white shadow-xl opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-20">
              <button onClick={handleZoomOut} className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white" title="Zoom Out" aria-label="Zoom Out"><ZoomOut size={20} /></button>
              <span className="text-xs font-mono min-w-[3rem] text-center">{(scale * 100).toFixed(0)}%</span>
              <button onClick={handleZoomIn} className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white" title="Zoom In" aria-label="Zoom In"><ZoomIn size={20} /></button>
              <div className="w-px h-4 bg-primary-foreground/20 mx-1"></div>
              <button onClick={handleRotate} className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white" title="Rotate" aria-label="Rotate"><RotateCw size={20} /></button>
              <button onClick={toggleFullScreen} className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white" title="Toggle Fullscreen" aria-label="Toggle Fullscreen">
                  {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="p-4 bg-card dark:bg-secondary border-t border-border dark:border-border flex justify-between items-center z-10">
            <div className="flex gap-2">
                 <button onClick={handleShare} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground dark:text-muted-foreground/80 hover:bg-slate-100 hover:bg-accent transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                     <Share2 size={18} aria-hidden="true" /> Share
                 </button>
            </div>
            <div className="flex gap-3">
                 {isEditable && onReplace && (
                     <Button variant="outline" onClick={onReplace}>
                         <RefreshCw size={18} aria-hidden="true" /> Replace
                     </Button>
                 )}
                 <Button onClick={handleDownload}>
                     <Download size={18} aria-hidden="true" /> Download
                 </Button>
            </div>
        </div>
      </div>
    </div>
  );
};
