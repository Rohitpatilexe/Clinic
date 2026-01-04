"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Calendar, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import Link from 'next/link';

// Types
interface Appointment {
    id: string;
    date: string | Date;
    type: string;
    status: string;
    notes?: string;
    prescriptions?: string[];
}

interface PatientProfile {
    name: string;
    phone: string;
    age?: string;
    gender?: string;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    // State
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [history, setHistory] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [followUpDate, setFollowUpDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [followUpType, setFollowUpType] = useState("Follow-up");
    const [isBooking, setIsBooking] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/patients/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data.profile);
                setHistory(data.history);
            } else {
                console.error("Failed to fetch patient");
            }
        } catch (error) {
            console.error("Error fetching patient:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Handlers
    const toggleExpand = (apptId: string) => {
        setExpandedId(prev => prev === apptId ? null : apptId);
    };

    const handleBookFollowUp = async () => {
        if (!profile) return;
        setIsBooking(true);

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    date: followUpDate,
                    type: followUpType,
                    status: 'Confirmed'
                })
            });

            if (response.ok) {
                alert("Appointment Booked!");
                setIsModalOpen(false);
                fetchData(); // Refresh list immediately
            } else {
                const err = await response.json();
                alert(`Failed: ${err.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Booking failed", error);
            alert("Network error occurred.");
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading patient details...</div>;
    if (!profile) return <div className="p-10 text-center text-slate-500">Patient not found.</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto relative">
            {/* Back Button */}
            <Link href="/admin/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Patients
            </Link>

            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary dark:text-blue-400">
                            <User className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{profile.name}</h1>
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {profile.phone}
                                </span>
                                {profile.age && (
                                    <>
                                        <span className="text-slate-300">|</span>
                                        <span>{profile.age} • {profile.gender || 'N/A'}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        Book Follow-up
                    </button>
                </div>
            </div>

            {/* Appointment History */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white px-1">Appointment History</h2>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                                        No history found.
                                    </td>
                                </tr>
                            ) : (
                                history.map((appt) => {
                                    const apptId = String(appt.id);
                                    const isExpanded = expandedId === apptId;
                                    return (
                                        <React.Fragment key={apptId}>
                                            <tr
                                                onClick={() => toggleExpand(apptId)}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        {new Date(appt.date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{appt.type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                            ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ''}
                                                            ${appt.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : ''}
                                                            ${appt.status === 'Completed' ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' : ''}
                                                            ${appt.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : ''}
                                                        `}>
                                                        {appt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-slate-50 dark:bg-slate-900/30">
                                                    <td colSpan={4} className="px-6 py-4">
                                                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Doctor's Notes / Prescription</h3>
                                                                <Link
                                                                    href={`/admin/appointments/${appt.id}`}
                                                                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                                                                >
                                                                    Edit Record
                                                                </Link>
                                                            </div>
                                                            <div className="space-y-6">
                                                                {appt.notes && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Notes</p>
                                                                        <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed">
                                                                            {appt.notes}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                                {appt.prescriptions && appt.prescriptions.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Prescription</p>
                                                                        <ul className="list-decimal list-inside text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1">
                                                                            {appt.prescriptions.map((p, i) => (
                                                                                <li key={i} className="pl-2">{p}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {!appt.notes && (!appt.prescriptions || appt.prescriptions.length === 0) && (
                                                                    <p className="text-sm text-slate-400 italic">No notes or prescriptions recorded.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Book Follow-up</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={followUpDate}
                                    onChange={(e) => setFollowUpDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Type</label>
                                <select
                                    value={followUpType}
                                    onChange={(e) => setFollowUpType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                                >
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="General">General Consultation</option>
                                    <option value="Therapy">Therapy Session</option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex gap-3 justify-end bg-slate-50 dark:bg-slate-800/50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBookFollowUp}
                                disabled={isBooking}
                                className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-teal-700 shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isBooking ? 'Booking...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
