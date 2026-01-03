import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const appointments = await db.appointment.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(appointments);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch appointments', details: String(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Clone request for logging to avoid stream consumption issues
        // This is crucial for debugging "what did we actually receive?" without breaking the subsequent read
        const bodyCheck = await request.clone().json();
        console.log("POST Body:", bodyCheck);

        const body = await request.json();
        const { id, name, phone, date, type, status, prescriptions } = body;

        // Validation
        if (!name || !phone || !date || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            return NextResponse.json({ error: "Invalid Date" }, { status: 400 });
        }

        const newAppointment = await db.appointment.create({
            data: {
                // Keep ID logic to maintain sync with LocalStorage (which sends number-like strings)
                id: id ? id.toString() : Date.now().toString(),
                name,
                phone,
                date: appointmentDate,
                type,
                status: status || 'Pending',
                // Keep prescriptions logic
                prescriptions: prescriptions || [],
            },
        });

        return NextResponse.json(newAppointment);
    } catch (error) {
        console.error("POST Error Details:", error);
        // Return detailed error to help the user/frontend debug 500s
        return NextResponse.json({ error: "Database Error", details: String(error) }, { status: 500 });
    }
}
