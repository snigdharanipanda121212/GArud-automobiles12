'use client';

import React from 'react';

export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/918221822926?text=Hi%20Garud%20Automobiles,%20I%20want%20price%20details";

  return (
    <aside aria-label="Customer WhatsApp Contact" className="fixed bottom-6 right-6 z-50 flex items-center">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Garud Automobiles on WhatsApp"
        className="relative group flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        {/* Pulsing radar ripple effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />

        {/* WhatsApp Official SVG Logo */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-6 sm:h-6 fill-current relative z-10 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2a13.9 13.9 0 0 0-12 21l-1.9 7 7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.3 1.1 1.1-4.2-.3-.4A11.6 11.6 0 1 1 16 27.5zm6.4-8.6c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1-1.1 1.3-.4.3-.7.1a9.2 9.2 0 0 1-2.7-1.7 10.2 10.2 0 0 1-1.9-2.3c-.2-.3 0-.5.1-.7s.3-.4.5-.6l.3-.5c.1-.2 0-.4 0-.5s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7a1.4 1.4 0 0 0-1 1 5.3 5.3 0 0 0 1.6 4.3 12.3 12.3 0 0 0 5 4.3 17 17 0 0 0 1.7.6 4.1 4.1 0 0 0 1.9.1 3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.4-.3-.7-.5z" />
        </svg>

        {/* Text Pill label visible on desktop or group-hover */}
        <span className="hidden sm:inline font-mono font-bold text-xs uppercase tracking-wider relative z-10 pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}
