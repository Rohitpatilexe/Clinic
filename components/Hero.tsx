import Image from 'next/image';
import { Phone, MessageCircle } from 'lucide-react';

export default function Hero() {
    return (
        <section className="bg-blue-50/50 py-12 lg:py-20">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left space-y-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                        Center for <span className="text-primary">Joint Health</span> and Mobility.
                    </h1>
                    <p className="text-xl lg:text-2xl text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0">
                        Specialized Arthritis Treatment & Knee Replacement in Hubli.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                        {/* Primary CTA - WhatsApp */}
                        <a
                            href="https://wa.me/919876543210?text=Hi%20Dr%20Rakesh,%20I%20want%20to%20book%20an%20appointment"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-green-200"
                        >
                            <MessageCircle className="w-6 h-6" />
                            Chat on WhatsApp
                        </a>

                        {/* Secondary CTA - Call */}
                        <a
                            href="tel:+919876543210"
                            className="flex items-center justify-center gap-2 border-2 border-secondary text-secondary hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-bold transition-all"
                        >
                            <Phone className="w-6 h-6" />
                            Call Clinic
                        </a>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-lg lg:max-w-xl">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-100 border-4 border-white">
                        <Image
                            src="https://placehold.co/800x600/e2e8f0/1e3a8a?text=Joint+Care+Center"
                            alt="Dr. Rakesh Patil treating an elderly patient with care and expertise"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
