"use client";

import { useState, useEffect } from 'react';
import { User, Bell, Shield, Moon, Save } from 'lucide-react';
import { useTheme } from 'next-themes';
import ChangePasswordModal from '@/components/ChangePasswordModal';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [newPatients, setNewPatients] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate save delay
        setTimeout(() => {
            setIsSaving(false);
            alert("Settings Saved successfully!");
        }, 800);
    };

    const Toggle = ({
        label,
        description,
        checked,
        onChange,
        icon: Icon
    }: {
        label: string,
        description: string,
        checked: boolean,
        onChange: (val: boolean) => void,
        icon: any
    }) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm text-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{label}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );

    if (!mounted) {
        return null;
    }

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account and clinic preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Profile */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Profile Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value="Dr. Rakesh Patil"
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value="admin@jointcare.com"
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="text-primary font-bold hover:text-teal-700 dark:hover:text-teal-400 hover:underline transition-colors text-sm"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preferences */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Preferences
                        </h2>

                        <div className="space-y-4">
                            <Toggle
                                label="Email Notifications"
                                description="Receive emails when new patients book."
                                checked={notifications}
                                onChange={setNotifications}
                                icon={Bell}
                            />

                            <Toggle
                                label="Accepting New Patients"
                                description="Hide booking form if disabled."
                                checked={newPatients}
                                onChange={setNewPatients}
                                icon={User}
                            />

                            <Toggle
                                label="Dark Mode"
                                description="Switch to a darker theme."
                                checked={theme === 'dark'}
                                onChange={(enabled) => setTheme(enabled ? 'dark' : 'light')}
                                icon={Moon}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />

        </div>
    );
}
