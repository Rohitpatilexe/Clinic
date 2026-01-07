import Link from 'next/link';
import { services } from '@/lib/servicesData';

export default function Services() {
    return (
        <section id="services" className="py-16 lg:py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Specializations</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Comprehensive orthopedic care tailored to your needs, from non-surgical arthritis management to advanced joint replacement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <Link
                            href={`/services/${service.slug}`}
                            key={index}
                            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-lg hover:border-emerald-100 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="bg-blue-50 text-secondary p-4 rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <service.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{service.shortDesc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
