"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Calendar, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Appointment } from '@/utils/storage';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [patientData, setPatientData] = useState<{
        profile: { name: string; phone: string; age: string; gender: string };
        history: Appointment[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null); // State for single expanded row

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await fetch(`/api/patients/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPatientData(data);
                } else {
                    console.error('Failed to fetch patient data');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientData();
    }, [id]);

    const toggleExpand = (apptId: string) => {
        setExpandedId(prev => prev === apptId ? null : apptId);
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading patient profile...</div>;
    if (!patientData) return <div className="p-8 text-center text-slate-500">Patient not found</div>;

    const { profile, history } = patientData;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Back Button */}
            <Link href="/admin/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Patients
            </Link>

            {/* Header / Profile Card */}
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
                                <span className="text-slate-300">|</span>
                                <span>{profile.age} • {profile.gender}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="flex items-center gap-2 bg-primary hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98]"
                        onClick={() => alert('Follow-up booking logic here')}
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
                    <div className="overflow-x-auto">
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
                                {history.map((appt) => {
                                    // Normally ID would be number from types, but route returns string ID from DB. 
                                    // Types might be mismatch in Utils vs DB, converting to string safe.
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
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                    {appt.type}
                                                </td>
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
                                                                    <p className="text-sm text-slate-400 italic">No notes or prescriptions recorded for this visit.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
