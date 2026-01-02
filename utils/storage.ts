export interface Appointment {
    id: number;
    name: string;
    phone: string;
    type: string;
    date: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    notes?: string;
    prescriptions?: string[];
    age?: number;
    gender?: string;
    createdAt?: Date | string;
}

const MOCK_DATA: Appointment[] = [
    { id: 1, name: "Savitri Devi", phone: "+91 98765 12345", type: "Knee Pain", date: "Today, 10:30 AM", status: "Confirmed", age: 65, gender: "Female", notes: "Patient complains of severe knee pain...", prescriptions: ["Paracetamol 500mg"] },
    { id: 2, name: "Ramesh Kumar", phone: "+91 98765 67890", type: "Fracture Checkup", date: "Today, 11:15 AM", status: "Pending", age: 42, gender: "Male" },
    { id: 3, name: "Lakshmi Patil", phone: "+91 98765 24680", type: "Arthritis Care", date: "Tomorrow, 09:00 AM", status: "Pending", age: 58, gender: "Female" },
    { id: 4, name: "John Doe", phone: "+91 98765 13579", type: "Physiotherapy", date: "Oct 24, 4:00 PM", status: "Completed", age: 30, gender: "Male" },
    { id: 5, name: "Venkat Rao", phone: "+91 98765 97531", type: "Consultation", date: "Oct 25, 11:00 AM", status: "Pending", age: 50, gender: "Male" },
];

export const getAppointments = (): Appointment[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem('appointments');
    if (!stored) {
        localStorage.setItem('appointments', JSON.stringify(MOCK_DATA));
        return MOCK_DATA;
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse appointments", e);
        return MOCK_DATA;
    }
};

export const getAppointmentById = (id: number): Appointment | undefined => {
    const appointments = getAppointments();
    return appointments.find(a => a.id === id);
};

export const saveAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
    const appointments = getAppointments();
    const newAppointment: Appointment = {
        ...data,
        id: Date.now(), // Simple ID generation
        status: 'Pending',
        age: 0, // Default
        gender: 'Unknown' // Default
    };

    const updated = [newAppointment, ...appointments];
    localStorage.setItem('appointments', JSON.stringify(updated));

    // Trigger event for cross-component updates
    window.dispatchEvent(new Event('appointment-updated'));
};

export const updateStatus = (id: number, status: Appointment['status']) => {
    const appointments = getAppointments();
    const updated = appointments.map(apt =>
        apt.id === id ? { ...apt, status } : apt
    );

    localStorage.setItem('appointments', JSON.stringify(updated));
    window.dispatchEvent(new Event('appointment-updated'));
};

export const updateAppointment = (id: number, updates: Partial<Appointment>) => {
    const appointments = getAppointments();
    const updated = appointments.map(apt =>
        apt.id === id ? { ...apt, ...updates } : apt
    );

    localStorage.setItem('appointments', JSON.stringify(updated));
    window.dispatchEvent(new Event('appointment-updated'));
};

export const deleteAppointment = (id: number) => {
    const appointments = getAppointments();
    const updated = appointments.filter(a => a.id !== id);
    localStorage.setItem('appointments', JSON.stringify(updated));
    window.dispatchEvent(new Event('appointment-updated'));
};
