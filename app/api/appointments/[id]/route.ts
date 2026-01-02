import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
        const { status } = body;

        const updatedAppointment = await db.appointment.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedAppointment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}
