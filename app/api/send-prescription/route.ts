import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import twilio from 'twilio';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { appointmentId } = body;

        if (!appointmentId) {
            return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });
        }

        const id = appointmentId.toString();

        const appointment = await db.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const link = `${process.env.NEXT_PUBLIC_APP_URL}/rx/${id}`;
        const message = `Dr. Rakesh has updated your prescription. View and download it here: ${link}`;

        if (!appointment.phone) {
            console.error("Patient phone number missing for ID:", id);
            return NextResponse.json({ error: 'Patient phone number missing' }, { status: 400 });
        }

        console.log(`Attempting to send prescription to: ${appointment.phone}`);
        try {
            const messageResponse = await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: appointment.phone,
            });
            console.log("Twilio Success via:", messageResponse.sid);
            console.log("Message Status:", messageResponse.status);
        } catch (twilioError: any) {
            console.error("Twilio FAILED. Code:", twilioError.code);
            console.error("Twilio Message:", twilioError.message);
            console.error("More Info:", twilioError.moreInfo);
            throw twilioError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to send prescription:', error);
        return NextResponse.json({ error: 'Failed to send WhatsApp message' }, { status: 500 });
    }
}
