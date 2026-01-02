"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "Is knee replacement surgery safe for elderly patients?",
        answer: "Yes. We use advanced minimal-incision techniques that ensure faster recovery and less pain, specifically designed for patients over 60."
    },
    {
        question: "Do I need surgery for all joint pain?",
        answer: "Not at all. 70% of our patients are treated with medication, physiotherapy, and lifestyle changes. Surgery is always the last resort."
    },
    {
        question: "How quickly can I walk after surgery?",
        answer: "With our rapid-recovery protocols, most patients take their first steps within 24 hours of the surgery."
    },
    {
        question: "Do you accept health insurance?",
        answer: "Yes, we accept all major health insurance providers and government schemes. Our staff will assist you with the paperwork."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-16 lg:py-24 bg-slate-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-12">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="text-xl font-bold text-slate-900 pr-8">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-slate-400 flex-shrink-0" />
                                )}
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed text-lg border-t border-slate-50 pt-4 animate-in slide-in-from-top-2 duration-200">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
