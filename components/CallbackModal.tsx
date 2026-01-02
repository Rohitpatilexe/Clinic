"use client";

import { useState } from 'react';
import { X, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { saveAppointment } from '@/utils/storage';

export default function CallbackModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network delay and save to "database"
        setTimeout(() => {
            saveAppointment({
                name,
                phone,
                type: 'General Inquiry',
                date: new Date().toLocaleString()
            });

            setIsSubmitting(false);
            setIsSuccess(true);

            // Close modal after showing success message
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setName('');
                setPhone('');
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                {/* Success State */}
                {isSuccess ? (
                    <div className="p-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                        <p className="text-slate-600">
                            Thank you, {name}. Dr. Patil's team will call you shortly on {phone}.
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
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Ten digit mobile number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Enter 10-digit mobile number"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-secondary hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending Request...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="w-5 h-5" />
                                        Request Call Now
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-slate-400">
                                Your details are safe with us. We do not spam.
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
