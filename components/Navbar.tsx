import { Phone } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-3xl font-bold text-primary tracking-tight">
          Joint Care
        </Link>
        <div className="flex items-center gap-3 text-secondary bg-blue-50 px-4 py-2 rounded-full">
          <Phone className="w-6 h-6" />
          <span className="text-xl font-bold">Call: +91 [Placeholder]</span>
        </div>
      </div>
    </nav>
  );
}
