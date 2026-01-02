"use client";

import React from 'react';
import { Appointment } from '@/utils/storage';

interface PrescriptionPrintableProps {
    patient: Appointment;
    prescriptions: string[];
    notes?: string;
}

const PrescriptionPrintable = React.forwardRef<HTMLDivElement, PrescriptionPrintableProps>(
    ({ patient, prescriptions, notes }, ref) => {
        return (
            <div ref={ref} className="bg-white text-slate-900 p-8 max-w-[210mm] mx-auto min-h-[297mm] relative font-sans">

                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-teal-700 mb-2">Joint Care Clinic</h1>
                        <p className="text-sm text-slate-600">123, Health Avenue, Hubli, Karnataka - 580020</p>
                        <p className="text-sm text-slate-600">Phone: +91 98765 43210</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-900">Dr. Rakesh Patil</h2>
                        <p className="text-sm font-semibold text-slate-600">MBBS, MS Ortho</p>
                        <p className="text-xs text-slate-500">Reg. No: KMC 12345</p>
                        <p className="text-xs text-teal-600 mt-1">Consultant Orthopedic Surgeon</p>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="border border-slate-300 rounded-lg p-4 mb-8 bg-slate-50 flex flex-wrap gap-y-4 justify-between items-center text-sm">
                    <div className="w-1/2">
                        <span className="font-bold text-slate-700">Patient Name:</span>
                        <span className="ml-2 text-lg font-semibold">{patient.name}</span>
                    </div>
                    <div className="w-1/4">
                        <span className="font-bold text-slate-700">Age/Gender:</span>
                        <span className="ml-2">
                            {patient.age ? `${patient.age} Y` : 'N/A'} / {patient.gender || 'N/A'}
                        </span>
                    </div>
                    <div className="w-1/4 text-right">
                        <span className="font-bold text-slate-700">Date:</span>
                        <span className="ml-2">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="w-full mt-2 border-t border-slate-200 pt-2">
                        <span className="font-bold text-slate-700">ID:</span>
                        <span className="ml-2">JC-{patient.id}</span>
                    </div>
                </div>

                {/* Rx Symbol */}
                <div className="mb-6">
                    <span className="text-6xl font-serif font-bold text-slate-800 italic">Rx</span>
                </div>

                {/* Medicines List */}
                <div className="mb-12 space-y-6">
                    {prescriptions.length > 0 ? (
                        <ul className="list-decimal list-inside space-y-4">
                            {prescriptions.map((med, index) => (
                                <li key={index} className="text-lg pl-2">
                                    <span className="font-medium text-slate-900 border-b border-dotted border-slate-300 pb-1 inline-block min-w-[300px]">
                                        {med}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400 italic">No medications prescribed.</p>
                    )}
                </div>

                {/* Advice/Notes */}
                {notes && (
                    <div className="mb-12 p-4 border-l-4 border-teal-600 bg-teal-50/50">
                        <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-2">Advice / Instructions</h3>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="absolute bottom-12 left-8 right-8 border-t border-slate-200 pt-8 flex justify-between items-end">
                    <div>
                        <p className="font-bold text-slate-900">Emergency Contact</p>
                        <p className="text-2xl text-teal-700 font-bold mt-1">+91 98765 43210</p>
                    </div>
                    <div className="text-center">
                        <div className="h-16 mb-2 flex items-end justify-center">
                            {/* Signature Placeholder */}
                            <span className="text-slate-300 font-cursive text-2xl">Dr. Rakesh Patil</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 border-t border-slate-900 pt-1 w-48">Doctor's Signature</p>
                    </div>
                </div>

            </div>
        );
    }
);

PrescriptionPrintable.displayName = 'PrescriptionPrintable';

export default PrescriptionPrintable;
