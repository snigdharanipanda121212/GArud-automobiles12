'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Landmark, Send, Phone } from 'lucide-react';
import { useEnquiry } from '@/hooks/use-enquiry';

export default function Navbar() {
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const links = [
    { label: 'Showroom', path: '/' },
    { label: 'E-Vehicles', path: '/vehicles' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'About', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Admin Hub', path: '/admin' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative bg-gradient-to-tr from-amber-500 to-amber-300 p-2.5 rounded-xl text-black shadow-lg shadow-amber-950/20 group-hover:scale-105 transition-all">
              <Landmark className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-wider text-white uppercase font-mono">
                GARUD
              </span>
              <span className="block text-[10px] font-bold text-amber-500 tracking-[0.25em] uppercase leading-none">
                AUTOMOBILES
              </span>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-amber-400 bg-zinc-900/60 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-amber-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              id="nav-phone-btn"
              href="tel:+918221822926"
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-amber-400 hover:text-amber-300 font-medium text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Call Now</span>
            </a>
            <button
              id="nav-enquiry-btn"
              onClick={() => openEnquiry('General Question')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/15 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Book Consultation
            </button>
          </div>

          {/* Hamburger Mobile Menu */}
          <div className="md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800/80 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'text-amber-400 bg-zinc-900/80 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 px-4 border-t border-zinc-900 space-y-2.5">
            <a
              id="mobile-phone-btn"
              href="tel:+918221822926"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-amber-400 font-bold py-3 rounded-xl active:scale-95 transition-all text-sm cursor-pointer"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              Call Now (+91 82218 22926)
            </a>
            <button
              id="mobile-enquiry-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiry('General Question');
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Book Consultation
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
