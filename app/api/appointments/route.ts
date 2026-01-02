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
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, date, type } = body;

        if (!name || !phone || !date || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newAppointment = await db.appointment.create({
            data: {
                name,
                phone,
                date: new Date(date),
                type,
                status: 'Pending',
            },
        });

        return NextResponse.json(newAppointment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}
