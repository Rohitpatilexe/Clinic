import Image from 'next/image';
import { Award } from 'lucide-react';

export default function DoctorProfile() {
    return (
        <section id="about" className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto bg-slate-50 rounded-3xl p-6 lg:p-12 shadow-xl shadow-slate-100 flex flex-col md:flex-row items-center gap-8 lg:gap-12">

                    {/* Image Column */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg lg:h-[500px]">
                            <Image
                                src="/images/doc.jpg"
                                alt="Dr. Rakesh Patil"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-secondary px-4 py-2 rounded-full font-bold text-sm mb-4">
                                <Award className="w-4 h-4" />
                                7+ Years of Experience
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                                Dr. Rakesh Patil
                            </h2>
                            <p className="text-xl text-primary font-semibold">
                                MBBS, MS (Orthopedics)
                            </p>
                        </div>

                        <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                            <p>
                                Dedicated to restoring movement and quality of life. Dr. Patil specializes in advanced knee replacement techniques and compassionate arthritis care.
                            </p>
                            <p>
                                He believes in a patient-first approach, ensuring every treatment plan is tailored to the individual's lifestyle and mobility goals.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
