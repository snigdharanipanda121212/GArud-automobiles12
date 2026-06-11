import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Authorization Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg w-9 h-9 flex items-center justify-center ring-1 ring-amber-500/25 shrink-0">
              <img
                src="/garud_emblem.png"
                alt="Garud Emblem"
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-white font-extrabold tracking-wider font-mono">
              GARUD AUTOMOBILES
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-500">
            Authorized dealer for Ganjam District. Delivering Eco-friendly, Cost-effective Cargo Loaders, E-Rickshaws, and Specialized Commercial Ice Cream & Food Vans across Brahmapur, Odisha.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10 w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Ganjam Dealer</span>
          </div>
        </div>

        {/* Showroom Timings Column */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-5 font-mono">
            Showroom Hours
          </h3>
          <ul className="space-y-3 text-xs leading-relaxed">
            <li className="flex gap-3">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-2 text-zinc-300">
                <div>
                  <p className="font-bold text-white font-sans">Mon, Tue, Thu, Sat</p>
                  <p className="font-mono text-zinc-400">10:00 AM - 2:00 PM</p>
                  <p className="font-mono text-zinc-400">4:00 PM - 8:00 PM</p>
                </div>
                <div>
                  <p className="font-bold text-white font-sans">Wed, Fri</p>
                  <p className="font-mono text-zinc-400">10:00 AM - 2:00 PM</p>
                  <p className="font-mono text-zinc-400">5:00 PM - 9:00 PM</p>
                </div>
                <div>
                  <p className="font-bold text-white font-sans">Sunday</p>
                  <p className="font-mono text-zinc-400">10:00 AM - 2:00 PM</p>
                  <p className="text-[10px] text-zinc-500 italic block">Evening Closed</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Information Column */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-5 font-mono">
            Contact Details
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
              <div>
                <a href="tel:+918221822926" className="block text-zinc-300 hover:text-white transition">
                  +91 82218 22926
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-500 shrink-0 font-mono" />
              <a href="mailto:garudautomobiles694@gmail.com" className="text-zinc-300 hover:text-white transition">
                garudautomobiles694@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Location Column */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-5 font-mono">
            Location Address
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
              <span className="text-zinc-300 leading-relaxed font-sans">
                Shop No .3, Bijipur Main Rd,<br />
                near Vegetables Market, Sundar Nagar,<br />
                Brahmapur, Odisha 760001
              </span>
            </li>
            <li>
              <a 
                href="https://maps.google.com/?q=Garud+Automobiles+Shop+No+.3+Bijipur+Main+Rd+Brahmapur+Odisha" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center text-xs text-amber-400 hover:text-amber-300 hover:underline font-semibold gap-1"
              >
                View on Google Maps →
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div>
          © {new Date().getFullYear()} Garud Automobiles. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="/vehicles" className="hover:text-zinc-300 transition">Models</Link>
          <Link href="/about" className="hover:text-zinc-300 transition">About Ganjam Dealership</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition">Request Catalog</Link>
          <Link href="/admin" className="hover:text-zinc-300 transition">Dealer Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
