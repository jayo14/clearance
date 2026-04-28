import React from 'react';
import { ShieldCheck, GraduationCap, Award, CheckCircle } from 'lucide-react';
import { Student } from '../types';

export const Certificate = ({ student }: { student: Student }) => {
    return (
        <div className="bg-white text-slate-900 p-12 aspect-[1/1.414] max-w-4xl mx-auto border-[16px] border-double border-slate-200 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-12">
                <GraduationCap size={600} />
            </div>

            <div className="relative z-10 border-4 border-slate-900 h-full p-8 flex flex-col items-center text-center">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center">
                        <GraduationCap size={32} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-black uppercase tracking-tighter">University Clearance</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Office of the Registrar</p>
                    </div>
                </div>

                <div className="my-12">
                    <h1 className="text-5xl font-black mb-4 tracking-tighter text-slate-900">CERTIFICATE</h1>
                    <p className="text-xl font-bold text-slate-500 uppercase tracking-[0.3em]">of Clearance</p>
                </div>

                <p className="text-lg font-medium text-slate-600 mb-8 italic">This is to certify that</p>

                <h3 className="text-4xl font-black text-slate-900 mb-2">{student.name}</h3>
                <p className="text-sm font-black text-slate-500 mb-12 uppercase tracking-widest">Matric Number: {student.jamb_number}</p>

                <div className="max-w-md text-slate-600 leading-relaxed mb-16 font-medium">
                    Has successfully completed all university clearance requirements, including departmental, medical, and administrative verifications for the 2024 academic session.
                </div>

                <div className="mt-auto w-full grid grid-cols-2 gap-12 items-end px-8">
                    <div className="border-t-2 border-slate-900 pt-4">
                        <p className="font-black text-sm uppercase">Registrar</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Authorized Signature</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full border-4 border-slate-900 flex items-center justify-center mb-2 relative">
                             <ShieldCheck size={48} className="text-slate-900" />
                             <div className="absolute inset-0 animate-spin-slow opacity-20">
                                 <Award size={96} className="text-slate-900" />
                             </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">Digitally Verified</p>
                        <p className="text-[8px] font-mono text-slate-400">{new Date().toISOString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
