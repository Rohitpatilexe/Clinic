import { Phone, MessageCircle } from 'lucide-react';

export default function MobileContactBar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {/* Call Button */}
            <a
                href="tel:+910000000000"
                className="flex-1 bg-secondary text-white flex items-center justify-center gap-2 font-bold text-lg active:bg-blue-800 transition-colors"
                aria-label="Call clinic"
            >
                <Phone className="w-5 h-5" />
                Call Now
            </a>

            {/* WhatsApp Button */}
            <a
                href="https://wa.me/910000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white flex items-center justify-center gap-2 font-bold text-lg active:bg-green-700 transition-colors"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
            </a>
        </div>
    );
}
