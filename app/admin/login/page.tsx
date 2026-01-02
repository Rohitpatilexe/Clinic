"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'admin@jointcare.com' && password === 'admin123') {
            localStorage.setItem('admin_session', 'true');
            router.push('/admin');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="text-center mb-8">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
                <p className="text-slate-500">Secure simulated access</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@jointcare.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="admin123"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-2"
                >
                    Access Dashboard
                </button>
            </form>
        </div>
    );
}
