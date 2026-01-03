import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import twilio from 'twilio';

// Force dynamic to prevent caching of "today"
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Security Check
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // console.log("Warning: Unauthenticated cron request");
    }

    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;

        if (!accountSid || !token) {
            console.error("CRITICAL: Twilio Keys are missing from process.env");
            return NextResponse.json({ error: "Missing Twilio Keys" }, { status: 500 });
        }

        // Initialize client inside Handler to ensure it picks up the latest env vars
        const client = twilio(accountSid, token);

        // Calculate "Today" in UTC/Target Timezone
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Find appointments for today where status is NOT Cancelled
        const appointments = await db.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: {
                    not: 'Cancelled',
                },
            },
        });

        let count = 0;

        for (const appt of appointments) {
            if (!appt.phone) continue;

            // Phone Formatting Logic
            // Goal: "whatsapp:+919880270389"
            let formattedPhone = appt.phone.trim();

            if (!formattedPhone.startsWith('whatsapp:')) {
                // Remove any existing plus if we are going to logic check it, 
                // but simpler is to check if it has country code. 
                // Prompt: "If phone doesn't start with +91, add it."
                if (!formattedPhone.startsWith('+')) {
                    // Assume Indian number if no plus
                    formattedPhone = '+91' + formattedPhone;
                }
                // Prepend whatsapp:
                formattedPhone = 'whatsapp:' + formattedPhone;
            }

            const message = `Hello ${appt.name}, this is a reminder for your ${appt.type} appointment today at Joint Care Clinic. Please reply to confirm.`;

            try {
                console.log("Attempting to send to:", formattedPhone);

                const response = await client.messages.create({
                    body: message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: formattedPhone,
                });

                console.log("Twilio Success via:", response.sid);
                // console.log("Message Status:", response.status); 
                count++;
            } catch (twilioError: any) {
                console.error("Twilio FAILED. Code:", twilioError.code);
                console.error("Twilio Message:", twilioError.message);
                console.error("More Info:", twilioError.moreInfo);
                console.error(`Failed to send to ${formattedPhone}`, twilioError);
            }
        }

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
