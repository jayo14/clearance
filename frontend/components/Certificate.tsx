
import React from 'react';
import { Student } from '../types';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { OFFICE_CONFIG } from '../services/mockData';

export const Certificate = ({ student }: { student: Student }) => {
  return (
    <div className="bg-card p-8 md:p-12 border-4 border-double border-border max-w-[800px] mx-auto shadow-sm relative overflow-hidden print:shadow-none print:border-4 print:max-w-none print:w-full">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <ShieldCheck size={500} />
      </div>

      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-6 mb-8 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center border-4 border-blue-800 shadow-inner">
             <div className="text-white font-bold text-xs text-center leading-none tracking-tight">
                <span className="text-2xl block mb-1">🏛️</span>
                LASUSTECH
             </div>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-foreground font-extrabold mb-2 uppercase leading-tight px-4 tracking-wide">
          Lagos State University of<br/>Science and Technology
        </h1>
        <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-bold">Office of the Registrar</p>
      </div>

      {/* Title */}
      <div className="text-center mb-8 relative z-10">
        <span className="inline-block px-6 py-2 bg-primary/10 border border-emerald-100 rounded-full text-emerald-800 text-sm font-bold mb-4 uppercase tracking-wider">
            Official Document
        </span>
        <h2 className="text-3xl font-serif font-bold text-foreground uppercase mb-2 decoration-emerald-500/30 underline decoration-4 underline-offset-8">
          Certificate of Clearance
        </h2>
      </div>

      {/* Body Text */}
      <div className="mb-10 relative z-10">
        <p className="text-foreground/80 leading-loose text-lg text-justify px-4 md:px-8 font-serif">
          This is to certify that <strong className="text-foreground text-xl border-b border-slate-400 px-1">{student.name}</strong> 
          with Registration Number <strong className="text-foreground text-xl border-b border-slate-400 px-1 font-mono">{student.jamb_number}</strong> 
          of the Department of <strong className="text-foreground">{student.department}</strong> has successfully completed all necessary 
          clearance procedures for the <strong>{student.admission_year}</strong> Academic Session.
        </p>
      </div>

      {/* Clearance Checklist */}
      <div className="mb-10 px-4 relative z-10">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 text-center">Cleared Departments</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8">
              {OFFICE_CONFIG.map(office => (
                  <div key={office.id} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center">
                          <CheckCircle size={12} />
                      </div>
                      <span className="text-sm font-bold text-foreground/80">{office.label}</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Footer / Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-slate-200 relative z-10">
        <div className="text-center">
          <div className="w-28 h-28 bg-card mx-auto mb-2 border-2 border-slate-900 p-1">
            {/* QR Code Placeholder */}
            <div className="w-full h-full bg-secondary flex items-center justify-center text-white text-[10px] text-center p-1 leading-tight">
                QR CODE VERIFICATION
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Scan to Verify Authenticity</p>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">ID: {student.clearance_record.id.toUpperCase()}</p>
        </div>
        
        <div className="flex flex-col justify-end text-center">
          <div className="w-48 mx-auto border-b-2 border-slate-900 mb-2 pb-2 relative">
             {/* Signature Mock */}
            <div className="font-serif italic text-3xl text-blue-900 opacity-80 rotate-[-5deg]">Dr. Cole</div>
            <div className="absolute -top-6 right-0 w-16 h-16 border-4 border-double border-red-800 rounded-full opacity-30 rotate-12 flex items-center justify-center text-[8px] font-bold text-red-900 uppercase text-center p-1">
                Official Seal
            </div>
          </div>
          <p className="font-bold text-foreground uppercase text-sm">Dr. A. B. Cole</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Registrar</p>
          <p className="text-[10px] text-muted-foreground mt-1">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Digital Badge */}
      <div className="mt-8 bg-muted border border-slate-200 p-2 text-center text-[10px] text-muted-foreground uppercase tracking-widest relative z-10">
        Digitally Generated System Document • Valid without physical signature if verified online
      </div>
    </div>
  );
};
