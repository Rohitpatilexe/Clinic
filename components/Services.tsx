import { Bone, HeartHandshake, Bandage, Activity } from 'lucide-react';

const services = [
    {
        title: "Knee Replacement",
        description: "Advanced surgical solutions for chronic knee pain.",
        icon: Bone
    },
    {
        title: "Arthritis Care",
        description: "Non-surgical and surgical management for joint health.",
        icon: HeartHandshake
    },
    {
        title: "Fracture Treatment",
        description: "Emergency care and rehabilitation for bone injuries.",
        icon: Bandage
    },
    {
        title: "Physiotherapy",
        description: "Post-surgery recovery and mobility exercises.",
        icon: Activity
    }
];

export default function Services() {
    return (
        <section className="py-16 lg:py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Specializations</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Comprehensive care for all your bone and joint needs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col items-center text-center">
                            <div className="bg-blue-50 text-secondary p-4 rounded-full mb-4">
                                <service.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
