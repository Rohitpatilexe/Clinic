"use client";

import { useState } from 'react';
import { X, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { createAppointment } from '@/lib/api';
import { z } from 'zod';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Zod Schema
const schema = z.object({
    name: z.string().min(2, "Name is too short"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    date: z.string().refine((val) => {
        if (!val) return true; // Allow empty if opt, but here assuming required if field exists
        return new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0));
    }, "Date cannot be in the past")
});

export default function CallbackModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const validate = () => {
        const result = schema.safeParse(formData);
        if (!result.success) {
            const flattened = result.error.flatten();
            const fieldErrors: Record<string, string> = {};

            Object.keys(flattened.fieldErrors).forEach((key) => {
                const msgs = flattened.fieldErrors[key as keyof typeof flattened.fieldErrors];
                if (msgs && msgs.length > 0) {
                    fieldErrors[key] = msgs[0];
                }
            });

            setErrors(fieldErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            await createAppointment({
                name: formData.name,
                phone: formData.phone,
                type: 'General Inquiry',
                date: formData.date
            });

            setIsSubmitting(false);
            setIsSuccess(true);

            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({
                    name: '',
                    phone: '',
                    date: new Date().toISOString().split('T')[0]
                });
                setErrors({});
            }, 2000);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            alert("Failed to submit request. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                </button>

                {/* Success State */}
                {isSuccess ? (
                    <div className="p-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Sent!</h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Thank you, {formData.name}. Dr. Patil's team will call you shortly on {formData.phone}.
                        </p>
                    </div>
                ) : (
                    /* Form State */
                    <div className="flex flex-col">
                        <div className="bg-primary p-6 text-white text-center">
                            <h3 className="text-2xl font-bold mb-2">Request a Callback</h3>
                            <p className="text-teal-100 text-sm">Fill the form below and we will get back to you immediately.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={twMerge(
                                        "w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 dark:text-white outline-none transition-all",
                                        errors.name
                                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                            : "border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    )}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, ''); // Only numbers
                                        setFormData({ ...formData, phone: val });
                                    }}
                                    className={twMerge(
                                        "w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 dark:text-white outline-none transition-all",
                                        errors.phone
                                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                            : "border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    )}
                                    placeholder="Enter 10-digit mobile number"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Preferred Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className={twMerge(
                                        "w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 dark:text-white outline-none transition-all",
                                        errors.date
                                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                            : "border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    )}
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-secondary hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="w-5 h-5" />
                                        Request Call Now
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                                Your details are safe with us. We do not spam.
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
