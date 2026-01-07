"use client";

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Calendar, Clock, Save, Plus, Trash2, CheckCircle, Printer, Send } from 'lucide-react';
import { Appointment, updateAppointment } from '@/utils/storage';
import { useReactToPrint } from 'react-to-print';
import PrescriptionPrintable from '@/components/PrescriptionPrintable';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AppointmentDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [notes, setNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState<string[]>([]);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [newPrescription, setNewPrescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Print Ref
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Prescription-${id}`,
    });

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await fetch(`/api/appointments/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAppointment({
                        ...data,
                        age: data.age,
                        gender: data.gender
                    }); // Ensure we have the latest fields
                    setNotes(data.notes || '');
                    setPrescriptions(data.prescriptions || []);
                    setAge(data.age ? String(data.age) : '');
                    setGender(data.gender || '');
                } else {
                    console.error('Failed to fetch appointment');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

    const handleSaveNotes = async () => {
        if (!appointment) return;
        setIsSaving(true);

        // 1. Update Local Storage (Backward compatibility / Optimistic UI)
        // 1. Update Local Storage (Backward compatibility / Optimistic UI)
        updateAppointment(appointment.id, {
            notes,
            prescriptions,
            age,
            gender
        });

        // 2. Sync to DB
        try {
            await fetch(`/api/appointments/${appointment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes,
                    prescriptions,
                    age,
                    gender
                })
            });
        } catch (error) {
            console.error("Failed to sync to DB", error);
            alert("Saved locally but failed to sync to server database.");
        }

        setTimeout(() => {
            setIsSaving(false);
        }, 500);
    };

    const handleWhatsAppShare = () => {
        if (!appointment) return;

        // 1. Clean Phone Number (Remove spaces, dashes)
        let phone = appointment.phone.replace(/\D/g, '');
        // Default to India (+91) if no country code provided
        if (phone.length === 10) {
            phone = '91' + phone;
        }

        // 2. Format Date
        const dateStr = new Date(appointment.date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        // 3. Build Message
        const prescriptionText = prescriptions.length > 0
            ? prescriptions.map(p => `- ${p}`).join('\n')
            : "General Consultation - No specific meds added.";

        const text = `*Joint Care Clinic Appointment Summary*
--------------------------------
👤 *Patient:* ${appointment.name}
📅 *Date:* ${dateStr}
--------------------------------
💊 *Prescription / Notes:*
${prescriptionText}
--------------------------------
👨‍⚕️ *Dr. Rakesh Patil*
📍 *Location:* https://maps.app.goo.gl/YourMapLinkHere`;

        // 4. Open WhatsApp
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
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
            // Also sync to DB
            fetch(`/api/appointments/${appointment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Completed' })
            });
            // Go back to patient history
            router.push(`/admin/patients/${appointment.id}`); // Wait, appointment.id is the ID, but we want to go to the patient view.
            // The patient view is /admin/patients/[appointment_id]. 
            // Wait, my design for Patient View uses Appointment ID as Patient ID? 
            // "1. Fetch the specific appointment using params.id. Step 2: ... Extract the phone number"
            // Yes, currently the "Patient ID" in the URL IS an Appointment ID (the one clicked in the list).
            // So router.push(`/admin/patients/${appointment.id}`) will work, but it might be confusing if they came from a different appointment ID for the same patient.
            // Ideally, we'd have a real patient ID. But for now, this works as the "Patient View" just needs *any* appointment ID belonging to the patient.
            router.back();
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading appointment...</div>;
    if (!appointment) return <div className="p-8 text-center text-slate-500">Appointment not found</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Back Button */}
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Patient History
            </button>

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
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(appointment.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{appointment.type} Consultation</span>
                    </div>
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

                    {/* WhatsApp Button */}
                    <button
                        onClick={handleWhatsAppShare}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98]"
                    >
                        <Send className="w-5 h-5" />
                        Send to WA
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

                {/* Left Column: Medical Notes */}
                <div className="lg:col-span-2 space-y-6">
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

                {/* Right Column: Key Vitals (Placeholder) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Patient Info</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Phone className="w-4 h-4" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold">Phone</p>
                                    <p>{appointment.phone}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-semibold mb-1 block">Age</label>
                                    <input
                                        type="text"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="e.g. 45"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-semibold mb-1 block">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Hidden Printable Area */}
            <div className="hidden print:block">
                <PrescriptionPrintable
                    ref={printRef}
                    patient={{ ...appointment, age: age, gender: gender }}
                    prescriptions={prescriptions}
                    notes={notes}
                />
            </div>

        </div>
    );
}
