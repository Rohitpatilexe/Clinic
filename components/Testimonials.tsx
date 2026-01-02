import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Shubhada Kulkarni",
        tag: "Knee Replacement",
        text: "Dr. Rakesh Patil performed my grandmother’s knee replacement surgery with exceptional skill and care. The replacement was successful and her recovery has been smooth. He ensured both patient and family felt confident."
    },
    {
        name: "Govind Kulkarni",
        tag: "Patient Counseling",
        text: "One of the best doctors for ortho. He is down to earth and responds to all queries. If anyone has fear in mind for knee replacement, better speak to the doctor once and see the results."
    },
    {
        name: "Vishruth",
        tag: "Sports Injury",
        text: "Had a good experience in the recovery of my wrist injury. Sir regularly checks on me and gives solutions according to my current condition. Helped a lot in healing my wrist."
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-16 lg:py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-12">
                    Patient Stories
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            <div className="mb-4">
                                <span className="inline-block bg-blue-100 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {testimonial.tag}
                                </span>
                            </div>

                            <p className="text-slate-600 mb-6 flex-grow italic relative">
                                "{testimonial.text}"
                            </p>

                            <div className="font-bold text-slate-900 border-t border-slate-100 pt-4">
                                {testimonial.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
