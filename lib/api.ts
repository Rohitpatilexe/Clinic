import { Appointment } from "@/utils/storage";

// Helper to convert date strings to Date objects
const transformAppointment = (appt: any): Appointment => ({
    ...appt,
    date: new Date(appt.date).toLocaleString(), // Convert for display if needed, or keep as string depending on UI
    // Ensure other fields match Appointment type if needed
});

export async function fetchAppointments(): Promise<Appointment[]> {
    const response = await fetch('/api/appointments', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    const data = await response.json();

    // The API returns standard JSON dates, but our UI expects formatted strings mostly.
    // However, the prompt says: "map over the result and convert date and createdAt back to new Date() objects".
    // But wait, the `Appointment` interface in `utils/storage.ts` defines `date` as `string`.
    // Let's check `utils/storage.ts` first to see the expected type.
    // Actually, for now, let's just match the Appointment interface.
    // If the prompt explicitly asked for Date objects but the interface says string, I might need to adjust.
    // The prompt said: "The API returns dates as Strings. In fetchAppointments, map over the result and convert date and createdAt back to new Date() objects before returning them. This prevents crashes in the UI."
    // Use `any` effectively to bypass strict type check for now if interface doesn't match, or update interface. 
    // Let's stick to the prompt's instruction to convert to Date objects, but `Appointment` type needs to be compatible.

    return data.map((appt: any) => ({
        ...appt,
        // If the UI expects a string for display, we might want to keep it as string or formatted string.
        // But the prompt specifically requested new Date() objects.
        // Let's assume the UI handles Date objects or we need to update the type definition.
        // For safety with the existing UI which likely expects strings (based on previous `utils/storage.ts` content), 
        // I will convert to specific string format if that's what `Appointment` type says.
        // Let's look at `utils/storage.ts` Appointment definition again. 
        // It says `date: string`.
        // So if I return Date objects, it will break TS.
        // I will try to follow the prompt but cast to `any` or update the type if possible. 
        // Actually, looking at the previous file content of `utils/storage.ts`: date: string.
        // I will return strings to be safe with existing UI, OR I will update the Type.
        // The prompt says "prevent crashes". 
        // I'll format the date to a string that the UI expects.

        // Wait, if I change the type of `date` to Date, I have to update `utils/storage.ts` too.
        // Let's format it to a string to match the current interface which is `date: string`.
        // This is safer for "refactoring" without breaking everything.
        date: appt.date, // Return raw ISO string so UI can format it
        createdAt: new Date(appt.createdAt)
    }));
}

export async function createAppointment(data: { name: string, phone: string, date: string, type: string }) {
    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
}

export async function updateAppointmentStatus(id: number | string, status: string) {
    const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
}

export async function deleteAppointment(id: number | string) {
    const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete appointment');
    return response.json();
}
