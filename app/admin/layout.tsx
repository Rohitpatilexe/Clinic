"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    // Check if we are on the login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        // If on login page, we don't need to check auth to render the form.
        // However, if already logged in, we might want to redirect to dashboard.
        // For simplicity, we just allow rendering login page.
        if (isLoginPage) {
            setAuthorized(true);
            return;
        }

        const session = localStorage.getItem('admin_session');
        if (!session) {
            router.push('/admin/login');
        } else {
            setAuthorized(true);
        }
    }, [router, isLoginPage]);

    // Prevent flash of unauthorized content
    if (!authorized) {
        return null;
    }

    // Login page layout (No Sidebar)
    if (isLoginPage) {
        return <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">{children}</div>;
    }

    // Protected Admin Layout (With Sidebar)
    return (
        <div className="min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
