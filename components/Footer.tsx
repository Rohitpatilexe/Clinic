export default function Footer() {
    return (
        <footer className="bg-slate-100 py-8 border-t border-slate-200 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">Joint Care</h2>
                    <p className="text-slate-600">Hubli, Karnataka</p>
                </div>
                <p className="text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} Dr. Rakesh Patil. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
