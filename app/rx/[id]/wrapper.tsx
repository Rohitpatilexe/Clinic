"use strict";
"use client";

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrescriptionPrintable from '@/components/PrescriptionPrintable';
import { Download } from 'lucide-react';
import Link from 'next/link';

export default function PrescriptionWrapper({ appointment, prescriptions, notes }: { appointment: any, prescriptions: string[], notes: string }) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Prescription-${appointment.name}-${appointment.date}`,
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Prescription View</h1>
                    <p className="text-sm text-slate-500">Viewing as valid public link.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handlePrint()}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98]"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* We render the Printable but it might be hidden or shown. 
                    For Public View, we likely want to SHOW it on screen too, not just for print. 
                    The PrescriptionPrintable is designed as a visual component (A4 size).
                */}
                <div className="overflow-auto p-4 bg-slate-500/10">
                    <div className="scale-[0.8] origin-top md:scale-100">
                        <PrescriptionPrintable
                            ref={printRef}
                            patient={appointment}
                            prescriptions={prescriptions}
                            notes={notes}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm underline">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
