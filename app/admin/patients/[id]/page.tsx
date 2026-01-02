"use client";

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Calendar, Clock, Save, Plus, Trash2, CheckCircle, Printer } from 'lucide-react';
import { getAppointmentById, updateAppointment, Appointment } from '@/utils/storage';
import { useReactToPrint } from 'react-to-print';
import PrescriptionPrintable from '@/components/PrescriptionPrintable';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const id = parseInt(resolvedParams.id);
    const router = useRouter();

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [notes, setNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState<string[]>([]);
    const [newPrescription, setNewPrescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Print Ref
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Prescription-${id}`,
    });

    useEffect(() => {
        const data = getAppointmentById(id);
        if (data) {
            setAppointment(data);
            setNotes(data.notes || '');
            setPrescriptions(data.prescriptions || []);
        }
        setIsLoading(false);
    }, [id]);

    const handleSaveNotes = () => {
        if (!appointment) return;
        setIsSaving(true);

        updateAppointment(appointment.id, {
            notes,
            prescriptions
        });

        setTimeout(() => {
            setIsSaving(false);
        }, 500);
    };

    const handleAddPrescription = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPrescription.trim()) return;
        setPrescriptions([...prescriptions, newPrescription.trim()]);
        setNewPrescription('');
    };

    const removePrescription = (index: number) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const handleComplete = () => {
        if (!appointment) return;
        if (confirm('Are you sure you want to mark this appointment as Completed?')) {
            updateAppointment(appointment.id, { status: 'Completed' });
            router.push('/admin/patients');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading patient...</div>;
    if (!appointment) return <div className="p-8 text-center text-slate-500">Patient not found</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Back Button */}
            <Link href="/admin/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Patients
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{appointment.name}</h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ''}
                ${appointment.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : ''}
                ${appointment.status === 'Completed' ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' : ''}
                ${appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : ''}
            `}>
                            {appointment.status}
                        </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">{appointment.type} Consultation</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Print Button */}
                    <button
                        onClick={() => handlePrint()}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98] dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        <Printer className="w-5 h-5" />
                        Print Rx
                    </button>

                    {appointment.status !== 'Completed' && (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-[0.98]"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Mark as Completed
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Patient Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Patient Details
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg"><Phone className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold">Phone</p>
                                    <p>{appointment.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg"><Calendar className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold">Age / Gender</p>
                                    <p>{appointment.age ? `${appointment.age} yrs` : 'N/A'} • {appointment.gender || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg"><Clock className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold">Appointment Time</p>
                                    <p>{appointment.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Doctor's Console */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Medical Notes */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Medical Notes</h2>
                            <button
                                onClick={handleSaveNotes}
                                disabled={isSaving}
                                className="text-primary hover:text-teal-700 dark:hover:text-teal-400 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Notes'}
                            </button>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter clinical observations, diagnosis, and treatment plan..."
                            className="w-full h-48 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Prescriptions */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Prescription</h2>

                        <form onSubmit={handleAddPrescription} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newPrescription}
                                onChange={(e) => setNewPrescription(e.target.value)}
                                placeholder="e.g. Paracetamol 500mg (1-0-1) x 3 days"
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <button
                                type="submit"
                                className="bg-primary hover:bg-teal-700 text-white p-2 rounded-xl transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="space-y-2">
                            {prescriptions.length === 0 && (
                                <p className="text-slate-400 italic text-sm">No medications added yet.</p>
                            )}
                            {prescriptions.map((script, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg group">
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                        {idx + 1}. {script}
                                    </span>
                                    <button
                                        onClick={() => removePrescription(idx)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {prescriptions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                <button
                                    onClick={handleSaveNotes}
                                    disabled={isSaving}
                                    className="text-primary hover:text-teal-700 dark:hover:text-teal-400 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? 'Saving...' : 'Save Prescriptions'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden Printable Area */}
            <div className="hidden print:block">
                <PrescriptionPrintable
                    ref={printRef}
                    patient={appointment}
                    prescriptions={prescriptions}
                    notes={notes}
                />
            </div>

        </div>
    );
}
