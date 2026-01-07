"use client";

import { useState } from 'react';
import { Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import CallbackModal from './CallbackModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-3xl font-bold text-primary tracking-tight">
            Joint Care
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex gap-6 items-center">
              <Link href="#about" className="text-slate-600 hover:text-primary font-medium text-lg">
                About
              </Link>
              <Link href="#services" className="text-slate-600 hover:text-primary font-medium text-lg">
                Services
              </Link>
              <Link href="#testimonials" className="text-slate-600 hover:text-primary font-medium text-lg">
                Testimonials
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <a href="tel:+918133905968" className="hidden lg:flex items-center gap-2 text-secondary bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                <Phone className="w-5 h-5" />
                <span className="font-bold"> +91 81339 05968</span>
              </a>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-teal-700 text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg shadow-emerald-500/30 transition-all active:scale-95 transform hover:scale-105 duration-200"
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">Book Appointment</span>
                <span className="sm:hidden">Book</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <CallbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
