import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Map, CheckCircle2 } from 'lucide-react';
import { Button } from './UI';

export interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TourGuide = ({ steps, isOpen, onClose, onComplete }: TourGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Reset step when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [isOpen]);

  const updatePosition = useCallback(() => {
    if (!isOpen || !steps[currentStep]) return;
    
    // Handle 'center' position (no target needed)
    if (steps[currentStep].position === 'center') {
        setTargetRect(null);
        return;
    }

    const element = document.getElementById(steps[currentStep].target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    } else {
        // Fallback if element not found
        setTargetRect(null); 
    }
  }, [currentStep, isOpen, steps]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    // Slight delay to allow DOM updates
    const timer = setTimeout(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      clearTimeout(timer);
    };
  }, [updatePosition]);

  if (!isOpen || !isReady) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Calculate Popover Position
  let popoverStyle: React.CSSProperties = {};
  
  if (step.position === 'center' || !targetRect) {
      popoverStyle = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed'
      };
  } else {
      const spacing = 16;
      if (step.position === 'bottom') {
        popoverStyle = { top: targetRect.bottom + spacing, left: targetRect.left + (targetRect.width / 2) - 160 };
      } else if (step.position === 'top') {
        popoverStyle = { top: targetRect.top - spacing - 200, left: targetRect.left + (targetRect.width / 2) - 160 }; // rough height approx
      } else if (step.position === 'right') {
         popoverStyle = { top: targetRect.top, left: targetRect.right + spacing };
      } else {
         popoverStyle = { top: targetRect.bottom + spacing, left: targetRect.left }; // Default fallback
      }
      
      // Boundary checks could go here, simplified for now
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Dimmed Background */}
      <div className="absolute inset-0 bg-slate-950/70 transition-opacity duration-300 backdrop-blur-[2px]"></div>

      {/* Spotlight Cutout (if target exists) */}
      {targetRect && step.position !== 'center' && (
        <div 
            className="absolute bg-transparent transition-all duration-300 ease-in-out border-2 border-white/30 dark:border-white/20 shadow-[0_0_0_9999px_rgba(2,6,23,0.7)] rounded-xl pointer-events-none"
            style={{
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
            }}
        />
      )}

      {/* Tooltip Card - Increased contrast for dark mode */}
      <div 
        className={`absolute w-[340px] bg-card bg-muted rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-600 p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300 ${step.position === 'center' ? '' : 'transition-all duration-300 ease-out'}`}
        style={popoverStyle}
      >
        <div className="flex items-start justify-between gap-4">
            <div className="p-2.5 bg-blue-100 dark:bg-primary/100/20 text-primary dark:text-blue-300 rounded-xl">
               <Map size={24} />
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground dark:hover:text-foreground/80 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div>
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-2 flex items-center gap-2">
                {step.title}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 leading-relaxed">
                {step.content}
            </p>
        </div>

        <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1">
                {steps.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-muted dark:bg-slate-600'}`}
                    />
                ))}
            </div>

            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrev} 
                    disabled={currentStep === 0}
                    className="!px-3"
                >
                    <ChevronLeft size={16} />
                </Button>
                <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleNext}
                >
                    {isLastStep ? (
                        <>Finish <CheckCircle2 size={16} /></>
                    ) : (
                        <>Next <ChevronRight size={16} /></>
                    )}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};