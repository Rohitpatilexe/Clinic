import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-center px-4">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Oops! Page not found.</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-md">
                It seems you have wandered off. Let's get you back to the clinic.
            </p>
            <Link
                href="/"
                className="inline-block bg-primary hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors"
            >
                Go Back Home
            </Link>
        </div>
    );
}
