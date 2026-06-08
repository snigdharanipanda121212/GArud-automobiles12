'use client';

import React from 'react';
import { Landmark, MapPin, Award, Users, ShieldAlert, BadgeInfo } from 'lucide-react';
import { useEnquiry } from '@/hooks/use-enquiry';

export default function AboutPage() {
  const { openEnquiry } = useEnquiry();

  const values = [
    {
      icon: <Award className="w-5 h-5 text-amber-500" />,
      title: 'Certified OEM Standards',
      desc: 'All sheet metal, motors, and batteries are sourced directly from authorized assembly lines, adhering to standard AIS-156 safety norms.'
    },
    {
      icon: <Users className="w-5 h-5 text-amber-500" />,
      title: 'Ganjam Dedicated Servicing',
      desc: 'We maintain an exclusive servicing facility right beside our showroom at Sundar Nagar, stocked with original parts and smart battery diagnostic units.'
    },
    {
      icon: <Landmark className="w-5 h-5 text-amber-500" />,
      title: 'Localized Customizations',
      desc: 'Our specialized fabrications division configures custom shelving, stainless steel counter panels, and neon displays for local food and ice cream vendors.'
    }
  ];

  return (
    <div className="bg-black min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs block font-mono">
              About the Dealership
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none font-sans">
              Garud Automobiles
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Established as the flagship green mobility initiative in South Odisha, Garud Automobiles is the designated prime dealer for electric passenger vehicles and commercial loaders for Ganjam district.
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We started with a vision to build clean logistics alternatives for local traders, vendors, and commuters, preventing rising fuel costs from squeezing small trade margins. Today, our fleet supports over 600 active operations from Brahmapur to Chatrapur.
            </p>
            
            {/* Address Badge */}
            <div className="flex gap-3 bg-zinc-950 border border-zinc-900 p-4 rounded-xl items-start max-w-xl">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-zinc-500 block uppercase font-semibold font-mono">Brahmapur Flagship Terminal</span>
                <span className="text-sm text-zinc-300 font-medium h-auto block leading-relaxed font-sans">
                  Shop No .3, Bijipur Main Rd, near Vegetables Market, Sundar Nagar, Brahmapur, Odisha 760001
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden group">
            {/* Mesh pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30" />
            <div className="absolute -top-1/4 -right-1/4 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight font-sans">Authorized Sales & Support</h3>
              
              <div className="space-y-4 text-sm text-zinc-400">
                <p>
                  Our commitment goes beyond traditional sales. We understand that transition to EV requires robust local assistance:
                </p>
                <ul className="space-y-2.5 list-disc pl-4 text-xs font-sans">
                  <li>On-site emergency battery recovery across Ganjam.</li>
                  <li>Fast liaison with Odisha RTO for fast green numbering approvals.</li>
                  <li>Instant financing approvals through tied nationalised & private institutions.</li>
                  <li>Original copper winding motor replacements and diagnostic repairs.</li>
                </ul>
              </div>

              <button
                id="about-cta-btn"
                onClick={() => openEnquiry('General Question')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs py-3.5 rounded-xl shadow-md hover:brightness-110 transition cursor-pointer"
              >
                Inquire Showroom Fleet Quotes
              </button>
            </div>
          </div>
        </div>

        {/* Brand Values Block */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs font-mono">Dealer Standards</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Our Core Operating Pillars</h2>
            <p className="text-zinc-500 text-sm">
              We ensure our electric portfolio is customized for localized regional operational stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-90 w-full p-8 rounded-2xl space-y-4">
                <div className="bg-amber-500/10 text-amber-500 p-2.5 w-fit rounded-lg">
                  {val.icon}
                </div>
                <h3 className="text-base font-bold text-white">{val.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Depot Highlights */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-amber-505 text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-2">
                <BadgeInfo className="w-4 h-4 text-amber-500" />
                Regional Spare Parts Facility
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                No Downtime for Business Fleet Cargo Loaders
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                For commercial logistics, speed is revenue. Our spare parts repository keeps ready stock of high-capacity controllers, replacement tyres, heavy suspensions, chassis frames, and smart battery replacement modules.
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                * We promise standard components turnaround inside 24 hours for all local sub-dealers and operators who holds our custom-built e-loaders.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl relative overflow-hidden">
              <div className="text-amber-500 font-extrabold text-5xl font-mono mb-2">99%</div>
              <h4 className="text-white text-base font-bold mb-1.5 leading-none">Servicing Resolution Rate</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Our in-house staff holds custom certificates from leading EV technology manufacturers ensuring flawless diagnoses.
              </p>
              <div className="space-y-2 text-xs text-zinc-400 font-sans">
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span>Battery balancing diagnostics</span>
                  <span className="text-amber-400 font-semibold">Ready</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span>Chassis hydraulic tests</span>
                  <span className="text-amber-400 font-semibold">Available</span>
                </div>
                <div className="flex justify-between">
                  <span>Odisha trade approvals assistance</span>
                  <span className="text-amber-400 font-semibold">Consultations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
