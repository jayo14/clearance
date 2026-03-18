
import React, { useState, useRef } from 'react';
import { Student, OverallStatus } from '../types';
import { Certificate } from '../components/Certificate';
import { Button, Card, PageHeader } from '../components/UI';
import { 
  Download, Printer, Mail, Share2, ZoomIn, ZoomOut, CheckCircle, 
  HelpCircle, ChevronRight, Info, AlertTriangle, ArrowLeft
} from 'lucide-react';

interface Props {
  student: Student;
  onNavigate: (view: 'dashboard') => void;
}

export default function CertificatePage({ student, onNavigate }: Props) {
  const [zoom, setZoom] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState(student.email);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Access Control Check
  if (student.clearance_record.overall_status !== OverallStatus.APPROVED) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Certificate Not Available</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                  Your clearance is not yet complete. You must be approved by all offices before accessing your certificate.
              </p>
              <Button onClick={() => onNavigate('dashboard')}>Return to Dashboard</Button>
          </div>
      );
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const handlePrint = () => {
    window.print();
  };

  const handleEmailSend = (e: React.FormEvent) => {
      e.preventDefault();
      setIsEmailSending(true);
      setTimeout(() => {
          setIsEmailSending(false);
          setShowEmailModal(false);
          alert(`Certificate sent to ${email}`);
      }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
       
       {/* Email Modal */}
       {showEmailModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95">
               <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-2xl">
                   <h3 className="text-lg font-bold text-foreground mb-4">Email Certificate</h3>
                   <form onSubmit={handleEmailSend}>
                       <label className="block text-sm font-bold text-foreground/80 mb-2">Recipient Email</label>
                       <input 
                          type="email" 
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full p-3 border border-border rounded-xl bg-muted outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                       />
                       <div className="flex gap-3">
                           <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowEmailModal(false)}>Cancel</Button>
                           <Button type="submit" className="flex-1" disabled={isEmailSending}>
                               {isEmailSending ? 'Sending...' : 'Send Email'}
                           </Button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       <div className="mb-6">
           <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
               <ArrowLeft size={16} /> Back to Dashboard
           </button>
       </div>

       {/* Celebration Header */}
       <div className="bg-secondary rounded-3xl p-8 md:p-12 text-center text-secondary-foreground mb-8 relative overflow-hidden shadow-xl">
           <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
           
           {/* Simple CSS Confetti Dots */}
           <div className="absolute top-4 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
           <div className="absolute top-10 right-20 w-4 h-4 bg-red-400 rounded-full animate-bounce delay-300"></div>
           <div className="absolute bottom-8 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
           
           <div className="relative z-10">
               <div className="w-20 h-20 bg-secondary-foreground/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-secondary-foreground/30">
                   <CheckCircle size={40} className="text-secondary-foreground" />
               </div>
               <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Congratulations!</h1>
               <p className="text-secondary-foreground/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                   You have successfully completed your clearance process. Your official certificate is ready.
               </p>
               <p className="mt-4 text-xs font-mono opacity-70 uppercase tracking-widest">
                   Completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
               </p>
           </div>
       </div>

       <div className="flex flex-col xl:flex-row gap-8 items-start">
           
           {/* Left: Certificate Preview */}
           <div className="flex-1 w-full space-y-6">
               <div className="flex items-center justify-between mb-2">
                   <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                       <span className="w-2 h-6 bg-primary rounded-full"></span>
                       Certificate Preview
                   </h2>
                   <div className="flex items-center gap-2 bg-card p-1 rounded-lg border border-border shadow-sm">
                       <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 hover:bg-accent rounded text-muted-foreground"><ZoomOut size={18} /></button>
                       <span className="text-xs font-mono w-12 text-center text-muted-foreground">{(zoom * 100).toFixed(0)}%</span>
                       <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 hover:bg-accent rounded text-muted-foreground"><ZoomIn size={18} /></button>
                   </div>
               </div>

               <div className="bg-muted dark:bg-secondary/50 p-4 md:p-8 rounded-2xl overflow-auto border border-border dark:border-border shadow-inner flex justify-center min-h-[500px]">
                   <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
                       <div id="printable-area" ref={printRef}>
                            <Certificate student={student} />
                       </div>
                   </div>
               </div>

               <div className="md:hidden text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                   <Info size={12} />
                   For best printing results, use a desktop computer.
               </div>
           </div>

           {/* Right: Actions & Steps */}
           <div className="w-full xl:w-96 space-y-6">
               
               {/* Actions Card */}
               <Card className="space-y-4 shadow-lg border-blue-100 dark:border-blue-900/30">
                   <h3 className="font-bold text-foreground border-b border-border pb-3">Actions</h3>
                   <Button size="lg" className="w-full shadow-primary/25" onClick={handlePrint}>
                       <Download size={20} /> Download / Print PDF
                   </Button>
                   <div className="grid grid-cols-2 gap-3">
                       <Button variant="outline" onClick={() => setShowEmailModal(true)}>
                           <Mail size={18} /> Email
                       </Button>
                       {navigator.share && (
                           <Button variant="outline" onClick={() => navigator.share({ title: 'My Clearance Certificate', url: window.location.href })}>
                               <Share2 size={18} /> Share
                           </Button>
                       )}
                   </div>
               </Card>

               {/* Next Steps */}
               <Card className="bg-muted border-none">
                   <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                       <Info size={18} className="text-primary" /> What to do next?
                   </h3>
                   <div className="space-y-4 relative">
                       {/* Vertical line connecting steps */}
                       <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-border"></div>
                       
                       {[
                           { title: "Print Certificate", desc: "Print 2 copies of the certificate." },
                           { title: "Visit Department", desc: "Take copies to your Faculty Officer." },
                           { title: "Final Stamp", desc: "Get physical stamp and signature." },
                           { title: "NYSC Enrollment", desc: "Proceed to student affairs." }
                       ].map((step, i) => (
                           <div key={i} className="relative pl-8">
                               <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border-4 border-background">
                                   {i + 1}
                               </div>
                               <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                               <p className="text-xs text-muted-foreground">{step.desc}</p>
                           </div>
                       ))}
                   </div>
               </Card>

               {/* Support */}
               <Card>
                   <h3 className="font-bold text-foreground mb-4">Need Help?</h3>
                   <div className="space-y-2">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm text-muted-foreground dark:text-muted-foreground/80 hover:text-primary">
                                <span>How to verify?</span>
                                <span className="transition group-open:rotate-180">
                                    <ChevronRight size={16} />
                                </span>
                            </summary>
                            <p className="text-muted-foreground mt-2 text-xs group-open:animate-in group-open:fade-in group-open:slide-in-from-top-1">
                                Scan the QR code on the certificate using any standard QR scanner app.
                            </p>
                        </details>
                        <div className="border-b border-border my-2"></div>
                        <Button size="sm" variant="secondary" className="w-full">
                            <HelpCircle size={14} /> Contact Support
                        </Button>
                   </div>
               </Card>
           </div>
       </div>
    </div>
  );
}
