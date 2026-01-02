"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Phone,
    Calendar,
    ChevronRight,
    UserX
} from 'lucide-react';
import { getAppointments, Appointment } from '@/utils/storage';
import EmptyState from '@/components/EmptyState';

export default function PatientsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        setAppointments(getAppointments());
    }, []);

    const filteredAppointments = appointments.filter(appt => {
        const matchesSearch = appt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appt.phone.includes(searchQuery);
        const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Patients</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage patient records and appointments.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredAppointments.length === 0 ? (
                        <EmptyState
                            title="No Patients Found"
                            description={searchQuery ? "Try adjusting your search terms or filters." : "No patient records available."}
                            icon={UserX}
                            actionLabel={searchQuery ? "Clear Search" : undefined}
                            onAction={searchQuery ? () => { setSearchQuery(''); setStatusFilter('All'); } : undefined}
                        />
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Appt. Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredAppointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <Link href={`/admin/patients/${appt.id}`} className="font-medium text-slate-900 dark:text-white hover:text-primary transition-colors block">
                                                    {appt.name}
                                                </Link>
                                                <span className="text-xs text-slate-500">{appt.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                {appt.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {appt.date}
                                            </div>
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
                                            <Link href={`/admin/patients/${appt.id}`} className="text-slate-400 hover:text-primary transition-colors">
                                                <ChevronRight className="w-5 h-5 ml-auto" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
