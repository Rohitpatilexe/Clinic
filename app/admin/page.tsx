"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Calendar,
    Users,
    Clock,
    CheckCircle,
    ArrowRight,
    CalendarX,
    Trash2
} from 'lucide-react';
import { fetchAppointments, updateAppointmentStatus, deleteAppointment } from '@/lib/api';
import { Appointment } from '@/utils/storage'; // Keep interface for now
import EmptyState from '@/components/EmptyState';

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetchAppointments();
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        loadData();

        // Poll for updates every 10 seconds (reduced frequency for API)
        const interval = setInterval(loadData, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handleStatusUpdate = async (id: number, newStatus: Appointment['status']) => {
        setIsLoading(true);
        try {
            await updateAppointmentStatus(id, newStatus);
            await loadData(); // Refresh immediately
        } catch (error) {
            console.error('Failed to update status', error);
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            setIsLoading(true);
            try {
                await deleteAppointment(id);
                await loadData();
            } catch (error) {
                console.error('Failed to delete appointment', error);
                setIsLoading(false);
            }
        }
    };

    const pendingCount = appointments.filter(a => a.status === 'Pending').length;
    const todayCount = appointments.filter(a => {
        const apptDate = new Date(a.date).toDateString();
        const today = new Date().toDateString();
        return apptDate === today;
    }).length;
    const completedCount = appointments.filter(a => a.status === 'Completed').length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400">Welcome back, Dr. Patil. Here's what's happening today.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Requests"
                    value={pendingCount}
                    icon={Clock}
                    color="bg-amber-500"
                />
                <StatCard
                    title="Today's Appointments"
                    value={todayCount}
                    icon={Calendar}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Patients"
                    value={appointments.length}
                    icon={Users}
                    color="bg-teal-500"
                />
                <StatCard
                    title="Completed"
                    value={completedCount}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
            </div>

            {/* Conditional Rendering for Table vs Empty State */}
            {isLoading ? (
                <div className="text-center py-10 text-slate-500">Loading dashboard data...</div>
            ) : appointments.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-10">
                    <EmptyState
                        title="All Caught Up!"
                        description="No appointments scheduled for today."
                        icon={CalendarX}
                    />
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Appointments</h2>
                        <Link href="/admin/patients" className="text-primary hover:text-teal-700 dark:hover:text-teal-400 font-medium text-sm flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Patient Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {[...appointments].reverse().slice(0, 5).map((appt) => (
                                    <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{appt.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium border
                        ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ''}
                        ${appt.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : ''}
                        ${appt.status === 'Completed' ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' : ''}
                        ${appt.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : ''}
`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <span title={`Booked on: ${new Date(appt.createdAt || 0).toLocaleString()}`}>
                                                {new Date(appt.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{appt.type}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {appt.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt.id, 'Confirmed')}
                                                        className="text-green-600 hover:text-green-800 dark:hover:text-green-400 text-sm font-medium"
                                                    >
                                                        Accept
                                                    </button>
                                                )}
                                                {appt.status === 'Confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt.id, 'Completed')}
                                                        className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 text-sm font-medium"
                                                    >
                                                        Complete
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(appt.id)}
                                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Stat Component
function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p - 4 rounded - xl ${color} bg - opacity - 10 text - ${color.replace('bg-', '')} `}>
                <Icon className={`w - 6 h - 6 ${color.replace('bg-', 'text-')} `} />
            </div>
        </div>
    )
}
