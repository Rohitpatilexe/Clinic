import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        // 1. Fetch the specific appointment to identify the patient
        const currentAppointment = await db.appointment.findUnique({
            where: { id },
        });

        if (!currentAppointment) {
            return NextResponse.json(
                { error: 'Patient/Appointment not found' },
                { status: 404 }
            );
        }

        // 2. Fetch all appointments for this patient (by phone)
        const history = await db.appointment.findMany({
            where: {
                phone: currentAppointment.phone,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // 3. Construct the response
        const profile = {
            name: currentAppointment.name,
            phone: currentAppointment.phone,
            age: currentAppointment.age || "N/A",
            gender: currentAppointment.gender || "N/A",
        };

        return NextResponse.json({
            profile,
            history
        });

    } catch (error) {
        console.error('Error fetching patient details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch patient details' },
            { status: 500 }
        );
    }
}
