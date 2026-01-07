import Hero from "@/components/Hero";
import DoctorProfile from "@/components/DoctorProfile";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import LocationBlock from "@/components/LocationBlock";
import FAQ from "@/components/FAQ";
import { Phone, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <Hero />
      <Services />
      <DoctorProfile />
      <Testimonials />
      <FAQ />
      <LocationBlock />

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex gap-3 z-50 md:hidden">
        <a
          href="tel:+918133905968"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-500 text-emerald-600 font-semibold py-3 rounded-xl active:bg-emerald-50 transition-colors"
        >
          <Phone size={20} /> Call
        </a>
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
        >
          <Calendar size={20} /> Book
        </button>
      </div>
    </div>
  );
}
