"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { getAppointments, updateStatus, Appointment } from '@/utils/storage';

export default function PatientsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadData = () => {
        const data = getAppointments();
        setAppointments(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
        const handleStorageChange = () => loadData();
        window.addEventListener('appointment-updated', handleStorageChange);
        return () => {
            window.removeEventListener('appointment-updated', handleStorageChange);
        };
    }, []);

    const handleAction = (action: 'Approve' | 'Reject', id: number) => {
        const newStatus = action === 'Approve' ? 'Confirmed' : 'Cancelled';
        updateStatus(id, newStatus);
    };

    const filteredAppointments = appointments.filter(apt =>
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.phone.includes(searchTerm)
    );

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading patients...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Patients</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage all appointment requests.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
                {filteredAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wide">
                                    <th className="p-4 font-semibold">Patient Name</th>
                                    <th className="p-4 font-semibold">Service</th>
                                    <th className="p-4 font-semibold">Date & Time</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                {filteredAppointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4">
                                            <Link href={`/admin/patients/${apt.id}`} className="group block">
                                                <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{apt.name}</p>
                                                <p className="text-xs text-slate-400">{apt.phone}</p>
                                            </Link>
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{apt.type}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{apt.date}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${apt.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        ${apt.status === 'Completed' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : ''}
                        ${apt.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {apt.status === 'Pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction('Approve', apt.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('Reject', apt.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-default">
                                                    <MoreVertical className="w-5 h-5 opacity-0" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No patients found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
