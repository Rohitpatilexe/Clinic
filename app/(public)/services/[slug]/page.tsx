import { notFound } from 'next/navigation';
import { services } from '@/lib/servicesData';
import Link from 'next/link';
import { Check, ArrowRight, Phone } from 'lucide-react';
import type { Metadata } from 'next';

interface ServicePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        return {
            title: 'Service Not Found | Joint Care',
        };
    }

    return {
        title: `${service.title} | Dr. Rakesh Patil`,
        description: service.shortDesc,
    };
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-primary pt-24 pb-12 lg:pt-32 lg:pb-20 text-white">
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-sm font-medium text-teal-100 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/#services" className="hover:text-white transition-colors">Services</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">{service.title}</span>
                    </nav>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <service.icon className="w-8 h-8 lg:w-10 lg:h-10 text-teal-50" />
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">{service.title}</h1>
                    </div>
                    <p className="text-xl text-teal-50 max-w-2xl leading-relaxed opacity-90">
                        {service.shortDesc}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Left Column: Description & Benefits */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                About the Treatment
                            </h2>
                            <div
                                className="prose prose-lg prose-slate text-slate-600 leading-relaxed max-w-none [&>p]:mb-6"
                                dangerouslySetInnerHTML={{ __html: service.fullDesc }}
                            />
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Benefits</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {service.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                                        <div className="bg-primary text-white rounded-full p-1 mt-0.5 flex-shrink-0">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span className="font-semibold text-slate-800">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-50 border border-blue-100 sticky top-24">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to consult?</h3>
                            <p className="text-slate-600 mb-8">
                                Book an appointment with Dr. Rakesh Patil for {service.title} today.
                            </p>

                            <div className="space-y-4">
                                <a
                                    href="tel:+919876543210"
                                    className="flex items-center justify-center gap-2 w-full bg-secondary text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-100"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call to Book
                                </a>
                                <a
                                    href="https://wa.me/919876543210?text=Hi%20Dr%20Rakesh,%20I%20want%20to%20book%20an%20appointment"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-green-50 text-green-700 font-bold py-4 rounded-xl hover:bg-green-100 transition-colors border border-green-100"
                                >
                                    Chat on WhatsApp
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-500 mb-1">Clinic Timings</p>
                                <p className="font-semibold text-slate-900">Mon - Sat: 10:00 AM - 8:00 PM</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
