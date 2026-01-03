import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const appointments = await db.appointment.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        const uniquePatientsMap = new Map();

        appointments.forEach((appt) => {
            // Use phone number as the unique identifier
            if (!uniquePatientsMap.has(appt.phone)) {
                uniquePatientsMap.set(appt.phone, {
                    id: appt.id, // Using the latest appointment ID as reference
                    name: appt.name,
                    phone: appt.phone,
                    date: appt.date, // Last visit date
                    status: appt.status, // Status of the last visit
                    type: appt.type
                });
            }
        });

        const patients = Array.from(uniquePatientsMap.values());

        console.log(`Found ${appointments.length} appointments, returning ${patients.length} unique patients`);

        return NextResponse.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        return NextResponse.json(
            { error: 'Failed to fetch patients' },
            { status: 500 }
        );
    }
}
