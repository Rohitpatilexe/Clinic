import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import PrescriptionWrapper from './wrapper';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PrescriptionPage({ params }: PageProps) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
        return notFound();
    }

    const appointment = await db.appointment.findUnique({
        where: { id },
    });

    if (!appointment) {
        return notFound();
    }

    // Map Prisma type to UI type
    // The UI expects 'date' as string (usually for display)
    // and other fields.
    const mappedAppointment = {
        ...appointment,
        date: appointment.date.toLocaleString(),
        // Ensure status is one of the allowed literals if needed, or cast
        status: appointment.status as any,
        // prescriptions is String[] in Prisma, which matches string[] in UI
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <PrescriptionWrapper
                appointment={mappedAppointment}
                prescriptions={appointment.prescriptions}
                notes={appointment.notes || ''}
            />
        </div>
    );
}
