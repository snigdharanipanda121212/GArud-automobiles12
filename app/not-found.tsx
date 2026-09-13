import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs rounded-full uppercase tracking-wider mb-4">
        404 - Page Not Found
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Looking for a Garud EV Model?
      </h1>
      <p className="text-zinc-400 max-w-md text-sm mb-8">
        The specification page or document you are looking for might have been moved or updated in our catalog.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl hover:brightness-110 transition shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>Return to Showroom</span>
        </Link>
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Vehicles</span>
        </Link>
      </div>
    </div>
  );
}
