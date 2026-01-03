import { MapPin, Clock, Phone } from 'lucide-react';

export default function LocationBlock() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white lg:bg-slate-50 rounded-3xl overflow-hidden lg:shadow-xl lg:border border-slate-100">

                    {/* Left Column: Info */}
                    <div className="flex-1 p-0 lg:p-12 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Visit Our Clinic</h2>
                            <p className="text-slate-600">Accessible orthopedic care in the heart of Hubli.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full text-secondary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 block mb-1">Address</h3>
                                    <p className="text-slate-600">JOINTCARE, NMR Scan Center, Gokul Rd, opposite New Bus Stand, Industrial Estate, Hubballi, Karnataka 580030</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-full text-green-700">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 block mb-1">Clinic Timings</h3>
                                    <p className="text-slate-600">Mon - Sat: 5:00PM - 8:00 PM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full text-secondary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 block mb-1">Contact</h3>
                                        <a href="tel:+918133905968" className="text-slate-600 text-lg font-medium hover:text-secondary">+91 81339 05968</a>
                                    </div>                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Map */}
                    <div className="flex-1 h-[400px] lg:h-auto min-h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.608779667824!2d75.11708601247902!3d15.35118592813264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDIxJzA0LjMiTiA3NcKwMDcnMDEuNSJF!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full lg:rounded-r-3xl"
                        ></iframe>
                    </div>

                </div>
            </div>
        </section>
    );
}
