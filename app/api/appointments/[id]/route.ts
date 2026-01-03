import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = params.id;
        const appointment: any = await db.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        // Auto-fill Age/Gender from previous visits if missing
        if (!appointment.age || !appointment.gender) {
            const previousVisit: any = await db.appointment.findFirst({
                where: {
                    phone: appointment.phone,
                    id: { not: appointment.id }, // Exclude current
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            if (previousVisit) {
                // Only fill if currently missing
                if (!appointment.age && previousVisit.age) {
                    appointment.age = previousVisit.age;
                }
                if (!appointment.gender && previousVisit.gender) {
                    appointment.gender = previousVisit.gender;
                }
            }
        }

        return NextResponse.json(appointment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = params.id;
        await db.appointment.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = params.id;
        const body = await request.json();
        const { status, notes, prescriptions, age, gender } = body;

        const updatedAppointment = await db.appointment.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes !== undefined && { notes }),
                ...(prescriptions !== undefined && { prescriptions }),
                ...(age !== undefined && { age }),
                ...(gender !== undefined && { gender }),
            },
        });

        return NextResponse.json(updatedAppointment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}
