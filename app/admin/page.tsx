"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { getAppointments, updateStatus, Appointment } from '@/utils/storage';

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = () => {
        const data = getAppointments();
        setAppointments(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();

        // Listen for updates from other tabs or components
        const handleStorageChange = () => loadData();
        window.addEventListener('appointment-updated', handleStorageChange);

        return () => {
            window.removeEventListener('appointment-updated', handleStorageChange);
        };
    }, []);

    const pendingCount = appointments.filter(a => a.status === 'Pending').length;
    // Count appointments that match "Today" string
    const todayCount = appointments.filter(a => a.date.includes('Today')).length;

    const stats = [
        { label: "Today's Appointments", value: todayCount.toString(), icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { label: "Pending Requests", value: pendingCount.toString(), icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
        { label: "Total Patients", value: "1,240", icon: Users, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20" },
    ];

    const handleAction = (action: 'Approve' | 'Reject', id: number) => {
        const newStatus = action === 'Approve' ? 'Confirmed' : 'Cancelled';
        updateStatus(id, newStatus);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Welcome back, Dr. Rakesh.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Appointments Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Appointments</h2>
                    <Link href="/admin/patients" className="text-sm text-primary font-bold hover:underline">View All</Link>
                </div>

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
                            {appointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-900 dark:text-white">{apt.name}</p>
                                        <p className="text-xs text-slate-400">{apt.phone}</p>
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
                                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
