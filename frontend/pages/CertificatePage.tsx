import React, { useRef } from 'react';
import { Student, OverallStatus } from '../types';
import { Card, Button, PageHeader } from '../components/UI';
import { Certificate } from '../components/Certificate';
import { Download, Printer, Share2, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

interface Props {
  student: Student;
  onNavigate: (view: any) => void;
}

export default function CertificatePage({ student, onNavigate }: Props) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const isApproved = student.clearance_record?.overall_status === OverallStatus.APPROVED;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500 pb-20">
      <PageHeader
        title="Clearance Certificate"
        breadcrumbs={['Dashboard', 'Certificate']}
      />

      {isApproved ? (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <Card className="p-0 overflow-hidden border-none shadow-2xl print:shadow-none print:m-0">
               <div ref={certificateRef}>
                  <Certificate student={student} />
               </div>
            </Card>
          </div>

          <aside className="lg:col-span-4 space-y-6 print:hidden">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2 leading-tight">Verification Complete!</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">
                Your university clearance has been fully verified. You can now download or print your official certificate of clearance.
              </p>

              <div className="space-y-3">
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" onClick={handlePrint}>
                  <Printer size={20} /> Print Certificate
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-bold" onClick={() => alert('PDF generation would trigger here.')}>
                  <Download size={20} /> Download PDF
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-primary/10">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Official Verification</p>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-primary/20">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Digital Signature</p>
                    <p className="text-[10px] font-mono text-muted-foreground">ID: CL-2024-8892-X</p>
                  </div>
                </div>
              </div>
            </Card>

            <Button variant="ghost" className="w-full flex items-center gap-2 text-muted-foreground font-bold" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft size={18} /> Return to Dashboard
            </Button>
          </aside>
        </div>
      ) : (
        <Card className="p-12 text-center max-w-2xl mx-auto border-none bg-muted/30">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">Certificate Locked</h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-8">
            Your clearance process is still in progress. Once all administrative and departmental clearances are approved, your certificate will be generated automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-2xl" onClick={() => onNavigate('status')}>
              Check Clearance Status
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => onNavigate('dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
