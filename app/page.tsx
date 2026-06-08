'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getVehicles, Vehicle } from '@/lib/store';
import { useEnquiry } from '@/hooks/use-enquiry';
import { 
  Sparkles, 
  ArrowRight, 
  BatteryCharging, 
  Coins, 
  Settings2, 
  MapPin, 
  Star, 
  ChevronRight, 
  BadgeCheck, 
  Wrench, 
  Phone, 
  ShieldCheck, 
  Truck, 
  ThumbsUp, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default function HomePage() {
  const { openEnquiry } = useEnquiry();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const container3dRef = useRef<HTMLDivElement>(null);
  
  // Interactive match states
  const [prefCategory, setPrefCategory] = useState<string>('All');
  const [prefBattery, setPrefBattery] = useState<string>('All');
  const [prefPriceLimit, setPrefPriceLimit] = useState<number>(250000);
  const [matchResult, setMatchResult] = useState<Vehicle[]>([]);

  // 3D Mouse tilt effect values
  const [rotateX, setRotateX] = useState(10);
  const [rotateY, setRotateY] = useState(-15);

  useEffect(() => {
    // Sync vehicles list
    const all = getVehicles();
    // Double safeguard to make sure no e-scooters are present
    const nonScooters = all.filter(v => v.category !== ('E-Scooter' as any));
    setVehicles(nonScooters);
    setFeaturedVehicles(nonScooters.filter(v => v.featured));
  }, []);

  // Sync Finder matched list
  useEffect(() => {
    if (vehicles.length === 0) return;

    let filtered = vehicles;

    if (prefCategory !== 'All') {
      filtered = filtered.filter(v => v.category === prefCategory);
    }
    
    if (prefBattery !== 'All') {
      filtered = filtered.filter(v => {
        if (prefBattery === 'Lithium') return v.batteryType.toLowerCase().includes('lithium') || v.batteryType.toLowerCase().includes('lfp');
        if (prefBattery === 'Lead') return v.batteryType.toLowerCase().includes('lead') || v.batteryType.toLowerCase().includes('tubular');
        return true;
      });
    }

    // Parse numeric value from price string e.g. "₹1,45,000" -> 145000
    filtered = filtered.filter(v => {
      const numericPrice = parseInt(v.price.replace(/[^0-9]/g, ''), 10);
      return numericPrice <= prefPriceLimit;
    });

    setMatchResult(filtered);
  }, [prefCategory, prefBattery, prefPriceLimit, vehicles]);

  // Handle subtle 3D hover tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!container3dRef.current) return;
    const rect = container3dRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Convert to minor rotation degrees
    const rX = -(mouseY / height) * 20 + 10; // offset defaults
    const rY = (mouseX / width) * 20 - 15;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(10);
    setRotateY(-15);
  };

  const stats = [
    { value: '₹50 / Day', label: 'Running Cost', desc: 'Highly efficient energy saves massive fuel daily' },
    { value: '3-4 Hours', label: 'Lithium Smart Charge', desc: 'Overnight cell-balanced balancing' },
    { value: '3 Years', label: 'Full Cell Warranty', desc: 'Instant authorized Ganjam replacements' },
    { value: '25+', label: 'Vehicles Working in Our Locality', desc: 'Active logistics and passenger commercial runs' }
  ];

  const whyChooseBenefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'Genuine Quality',
      desc: 'Sourced from verified manufacturers with full RTO Odisha approvals, fire-safe heavy gauge chassis sheets, and Grade-A certified Lithium Battery cells.'
    },
    {
      icon: <Wrench className="w-6 h-6 text-amber-500" />,
      title: 'Expert EV Service',
      desc: 'Our dedicated Ganjam depot in Sundar Nagar contains original component inventories, state-of-the-art computer diagnostic docks, and expert technicians.'
    },
    {
      icon: <Coins className="w-6 h-6 text-amber-500" />,
      title: 'Affordable Pricing',
      desc: 'Direct manufacturer dealership pricing, fully transparent down payment terms, low financing interest rates, and minimal recurring maintenance costs.'
    },
    {
      icon: <ThumbsUp className="w-6 h-6 text-amber-500" />,
      title: 'Customer First Support',
      desc: 'Enjoy specialized operational guidance, on-call support for fleet operators, customized metal bodies, and hassle-free document processing.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarita Panda',
      role: 'EV Auto Owner, Brahmapur',
      review: 'EV auto with Lithium battery, zero emissions, negligible maintenance and massive savings daily.',
      rating: 5
    },
    {
      name: 'Siba narayan Panda',
      role: 'EV Tuk-Tuk Operator, Ganjam',
      review: 'Superior buildup quality, lowest charging costs, and extremely supportive maintenance team at Bijipur.',
      rating: 5
    },
    {
      name: 'Subhasree Mohanty',
      role: 'Commercial Fleet Manager, Brahmapur',
      review: 'Excellent loaders. Performance on the flyovers with full weight is incredibly smooth and stable. Thank you so much Garud Automobiles!',
      rating: 5
    }
  ];

  return (
    <div className="relative min-h-screen bg-black">
      
      {/* 1. CINEMATIC HERO SECTION WITH INTEGRATED TILT 3D MODEL */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-zinc-900 px-4 pt-12">
        {/* Background mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Warm Premium Amber Ambient Glare */}
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[125px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Badge Label */}
            <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/30 px-3.5 py-1.5 rounded-full text-xs text-emerald-400 font-sans tracking-wide font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Join the Electric Revolution</span>
            </div>

            {/* Custom Requested Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
              Trusted Electric <br className="hidden sm:inline" />
              Vehicles & Auto Parts <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400">
                in Brahmapur
              </span>
            </h1>

            {/* Subheading Description */}
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed font-sans">
              Quality products, expert maintenance, and reliable service at competitive prices. Serving Brahmapur with pride since day one.
            </p>

            {/* Hero CTA Buttons - REQUESTED: Request Enquiry, Call Now, View Vehicles */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-4">
              <button
                id="hero-enquiry-cta"
                onClick={() => openEnquiry('General Question')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-650 text-black font-extrabold px-7 py-4 rounded-xl shadow-lg shadow-amber-505/10 hover:shadow-amber-505/20 transition-all text-xs uppercase tracking-wider cursor-pointer font-mono"
              >
                <span>Request Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="hero-phone-cta"
                href="tel:+918221822926"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-amber-400 font-bold px-7 py-4 rounded-xl transition-all text-xs uppercase tracking-wider font-mono cursor-pointer"
              >
                <Phone className="w-4 h-4 text-amber-550" />
                <span>Call Now</span>
              </a>

              <Link
                href="/vehicles"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-zinc-950 text-zinc-300 hover:text-white font-bold px-7 py-4 rounded-xl border border-zinc-850 hover:border-zinc-700 transition-all text-xs uppercase tracking-wider font-mono cursor-pointer"
              >
                <span>View Vehicles</span>
              </Link>
            </div>

            {/* Trust Badges Integrated directly below Hero details */}
            <div className="border-t border-zinc-900/80 pt-6 mt-8">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold block mb-3.5">Verified Showroom Accreditations:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  <span className="text-xs text-zinc-300 font-semibold font-sans">4.8 Google Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs text-zinc-300 font-semibold font-sans">Warranty Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs text-zinc-300 font-semibold font-sans">Expert Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs text-zinc-300 font-semibold font-sans">Genuine Parts</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Styled 3D Vehicle Model with Garud Branding */}
          <div className="lg:col-span-5 h-full flex items-center justify-center">
            <div 
              ref={container3dRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full max-w-[420px] aspect-square rounded-3xl bg-zinc-950/60 border border-zinc-900 p-8 flex flex-col justify-between relative overflow-hidden group [perspective:1000px] cursor-grab"
            >
              {/* Subtle visual lighting glows on model */}
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">BRAND IDENTITY EMBLEM</span>
                  <h4 className="text-sm font-extrabold text-white mt-1">Official Garud Emblem</h4>
                </div>
              </div>

              {/* Holographic Isometric EV SVG Model representing Rickshaw & Loader with "GARUD" branding */}
              <motion.div 
                style={{ 
                  transformStyle: 'preserve-3d',
                  rotateX: rotateX,
                  rotateY: rotateY,
                }}
                className="relative w-full h-[220px] flex items-center justify-center my-6 transition-all duration-100 ease-out"
              >
                {/* Embedded High Fidelity Gold Bird Wings Logo */}
                <svg viewBox="0 0 500 500" className="w-[85%] h-full text-zinc-500 drop-shadow-[0_15px_30px_rgba(245,158,11,0.25)]">
                  <defs>
                    <linearGradient id="goldGradTilt" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF176" />
                      <stop offset="30%" stopColor="#F5B041" />
                      <stop offset="70%" stopColor="#D35400" />
                      <stop offset="100%" stopColor="#F39C12" />
                    </linearGradient>
                    <linearGradient id="goldLightTilt" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D35400" />
                      <stop offset="50%" stopColor="#F4D03F" />
                      <stop offset="100%" stopColor="#F9E79F" />
                    </linearGradient>
                    <filter id="glowTilt" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer glowing dust */}
                  <circle cx="250" cy="220" r="160" fill="rgba(245, 158, 11, 0.03)" filter="url(#glowTilt)" />

                  {/* Golden Emblem Group with 3D depth */}
                  <g transform="translate(0, -10)">
                    {/* Eagle Head & Beak */}
                    <path 
                      d="M250,140 Q275,140 290,150 Q310,165 310,180 Q305,182 295,180 Q305,190 295,200 L275,195 Q255,235 250,260 Q245,235 225,195 L205,200 Q195,190 205,180 Q195,182 190,180 Q190,165 210,150 Q225,140 250,140 Z" 
                      fill="url(#goldGradTilt)" 
                      stroke="url(#goldLightTilt)" 
                      strokeWidth="2" 
                    />
                    
                    {/* Stylized sharp phoenix tail/base */}
                    <polygon points="250,240 270,290 250,335 230,290" fill="url(#goldGradTilt)" stroke="url(#goldLightTilt)" strokeWidth="1.5" />
                    
                    {/* Left Wing - Upper Layer */}
                    <path 
                      d="M235,215 Q145,170 100,70 Q130,150 200,210 Q215,220 235,215 Z" 
                      fill="url(#goldGradTilt)" 
                      stroke="url(#goldLightTilt)" 
                      strokeWidth="2" 
                    />
                    {/* Left Wing - Middle Layer */}
                    <path 
                      d="M225,230 Q120,195 95,140 Q120,200 190,240 Q210,250 225,230 Z" 
                      fill="url(#goldGradTilt)" 
                      stroke="url(#goldLightTilt)" 
                      strokeWidth="1.5" 
                    />
                    {/* Left Wing - Bottom Layer */}
                    <path 
                      d="M215,245 Q110,225 105,200 Q120,230 185,260 Q205,265 215,245 Z" 
                      fill="url(#goldGradTilt)" 
                      stroke="url(#goldLightTilt)" 
                      strokeWidth="1" 
                    />
                    {/* Left Wing - Lower Feather */}
                    <path 
                      d="M205,260 Q125,255 135,240 Q145,255 180,270 L205,260 Z" 
                      fill="url(#goldGradTilt)" 
                    />

                    {/* Right Wing - Upper Layer */}
                    <path 
                      d="M265,215 Q355,170 400,70 Q370,150 300,210 Q285,220 265,215 Z" 
                      fill="url(#goldGradTilt)" 
                      stroke="url(#goldLightTilt)" 
                      strokeWidth="2" 
                    />
                    {/* Right Wing - Middle Layer */}
                    <path 
                      d="M275,230 Q380,195 405,140 Q380,200 310,240 Q290,250 275,230 Z" 
                      fill="url(#goldGradTilt)" 
                      stroke="url(#goldLightTilt)" 
                      strokeWidth="1.5" 
                    />
                    {/* Right Wing - Bottom Layer */}
                    <path 
                      d="M285,245 Q390,225 395,200 Q380,230 315,260 Q295,265 285,245 Z" 
                      fill="url(#goldGradTilt)" 
                      stroke="url(#goldLightTilt)" 
                      strokeWidth="1" 
                    />
                    {/* Right Wing - Lower Feather */}
                    <path 
                      d="M295,260 Q375,255 365,240 Q355,255 320,270 L295,260 Z" 
                      fill="url(#goldGradTilt)" 
                    />
                  </g>

                  {/* Brand Name Text: GARUD */}
                  <g transform="translate(0, 385)">
                    {/* Letter G */}
                    <path d="M80,0 L135,0 L135,12 L95,12 L95,30 L135,30 L135,18 L120,18 L120,12 L147,12 L147,42 L80,42 Z" fill="url(#goldGradTilt)" stroke="url(#goldLightTilt)" strokeWidth="1" />
                    
                    {/* Letter A */}
                    <path d="M165,42 L165,0 L205,0 L205,42 L192,42 L192,25 L178,25 L178,42 Z M178,14 L192,14 L192,6 L178,6 Z" fill="url(#goldGradTilt)" stroke="url(#goldLightTilt)" strokeWidth="1" />
                    
                    {/* Letter R */}
                    <path d="M220,42 L220,0 L265,0 Q278,0 278,12 Q278,24 262,24 L278,42 L262,42 L249,24 L233,24 L233,42 Z M233,14 L260,14 A5,5 0 0,0 260,6 L233,6 Z" fill="url(#goldGradTilt)" stroke="url(#goldLightTilt)" strokeWidth="1" />
                    
                    {/* Letter U */}
                    <path d="M295,0 L308,0 L308,30 L342,30 L342,0 L355,0 L355,42 L295,42 Z" fill="url(#goldGradTilt)" stroke="url(#goldLightTilt)" strokeWidth="1" />
                    
                    {/* Letter L */}
                    <path d="M375,42 L375,0 L415,0 Q435,0 435,21 Q435,42 415,42 Z M388,32 L412,32 A10,10 0 0,0 412,10 L388,10 Z" fill="url(#goldGradTilt)" stroke="url(#goldLightTilt)" strokeWidth="1" />
                  </g>
                </svg>

                {/* Animated status indicators floating */}
                <div className="absolute top-1/4 right-[5%] bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-300 px-2 py-1 rounded shadow block font-mono">
                  🔥 Wings of Ganjam
                </div>
                <div className="absolute bottom-1/4 left-[2%] bg-zinc-900/90 border border-zinc-800 text-[10px] text-amber-500 px-2 py-1 rounded shadow block font-mono">
                  ⚡ 60V Lithium Power
                </div>
              </motion.div>

              <div className="border-t border-zinc-900 pt-3 flex justify-between text-[10px] text-zinc-550 font-mono relative z-10">
                <span>OFFICIAL GARUD GOLD EMBLEM</span>
                <span>BIJIPUR MAIN RD</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS OVERVIEW SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/60 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">{stat.value}</div>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider font-mono mt-1.5">{stat.label}</p>
              <p className="text-zinc-600 text-xs mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE GARUD EV SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs font-mono">Core Dealer Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Why Choose Garud EV?</h2>
          <p className="text-zinc-500 text-sm leading-relaxed font-sans">
            We build and configure robust commercial fleet setups designed specifically to endure Odisha summer road conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseBenefits.map((benefit, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 p-7 rounded-2xl space-y-4 transition duration-300">
              <div className="bg-amber-500/10 text-amber-500 p-3.5 w-fit rounded-xl">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-white font-sans">{benefit.title}</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE VEHICLE CATALOG CATALOG (SpecFinder & Configurator Mock-up) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-900 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Find Your Perfect E-Vehicle</h2>
            <p className="text-zinc-400 text-sm max-w-2xl font-sans">
              Filter configurations live! Customize your battery specs, drive system needs, and ex-showroom price limits to discover your ideal local neighborhood helper.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 font-mono border-b border-amber-400/20 pb-1 cursor-pointer transition shrink-0"
          >
            Open Complete Showroom Catalogue
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Filter Parameters Panel */}
          <div className="lg:col-span-4 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Select Preferences</h3>
              <p className="text-[11px] text-zinc-550 mt-1">Refine options representing actual stock in our depot</p>
            </div>

            {/* Category selection */}
            <div className="space-y-2.5">
              <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block font-mono">Vehicle Segment</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'E-Loader', 'E-Rickshaw', 'Food Van', 'Ice Cream Van', 'Battery'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPrefCategory(cat)}
                    className={`text-[10px] px-3 py-2 rounded-xl border font-extrabold cursor-pointer transition uppercase tracking-wider font-mono ${
                      prefCategory === cat
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-zinc-900/60 border-zinc-805 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Physics Selection */}
            <div className="space-y-2.5">
              <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block font-mono">Battery Technology</label>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'Lithium', 'Lead'].map(batt => (
                  <button
                    key={batt}
                    onClick={() => setPrefBattery(batt)}
                    className={`text-[10px] py-2.5 px-1.5 rounded-xl border text-center font-extrabold cursor-pointer transition uppercase tracking-wider font-mono ${
                      prefBattery === batt
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-zinc-900/40 border-zinc-805 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {batt === 'All' ? 'All' : batt === 'Lithium' ? 'Lithium' : 'Lead-Acid'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliding Price Coordinates */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[11px] text-zinc-400 font-bold uppercase tracking-wider font-mono">
                <span>Showroom Budget Upper Limit</span>
                <span className="text-amber-500 font-extrabold font-mono">₹{prefPriceLimit.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="60000"
                max="250000"
                step="5000"
                value={prefPriceLimit}
                onChange={(e) => setPrefPriceLimit(Number(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                <span>₹60,000</span>
                <span>₹2,50,000</span>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900/70 p-4 rounded-2xl">
              <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 font-bold uppercase tracking-wider font-mono mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Odisha Finance Desk Enrolled</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                All catalog setups match local commercial loan subsidies. Inquire to calculate custom low-EMI interest details.
              </p>
            </div>
          </div>

          {/* Right Matching Columns with responsive high-fidelity cards */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <span className="text-zinc-500 text-xs font-mono uppercase">SHOWROOM COMPATIBLE MATCHES ({matchResult.length})</span>
              <span className="text-[10px] text-zinc-700 uppercase font-mono">Instant Parameter Matching</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {matchResult.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="bg-zinc-950 border border-zinc-905 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 hover:shadow-[0_15px_40px_-5px_rgba(245,158,11,0.15)] hover:-translate-y-2 duration-300 ease-out"
                  >
                    <div>
                      {/* Image header part */}
                      <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.name}
                          className="w-full h-full object-cover grayscale brightness-95 opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                        />
                        
                        {/* Dynamic category badge + Finance Available label */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                          <div className="bg-zinc-950/95 backdrop-blur border border-zinc-800 px-3 py-1 rounded-md text-[10px] font-bold text-amber-400 tracking-wider uppercase font-mono">
                            {vehicle.category}
                          </div>
                          <div className="bg-emerald-950/90 backdrop-blur border border-emerald-800/80 px-2 sm:px-2.5 py-1 rounded-md text-[9px] font-extrabold text-emerald-450 tracking-normal uppercase font-sans flex items-center gap-1 shadow">
                            <span>💰 Finance Available Here</span>
                          </div>
                        </div>

                        {/* Status Label */}
                        <div className="absolute top-3 right-3 bg-black/85 backdrop-blur border border-zinc-805/80 px-2 py-0.5 rounded text-[9px] font-semibold text-zinc-400 tracking-wider font-mono">
                          {vehicle.status}
                        </div>
                      </div>

                      {/* Specs card info blocks - Precise Order: Name -> Price -> Battery -> Capacity -> Motor */}
                      <div className="p-5 sm:p-6 space-y-4">
                        {/* Name of vehicle */}
                        <h3 className="font-extrabold text-white text-base sm:text-lg group-hover:text-amber-450 transition tracking-tight leading-tight">
                          {vehicle.name}
                        </h3>

                        {/* Ex-showroom Pricing */}
                        <div className="flex items-baseline gap-2 pt-1 border-b border-zinc-900 pb-3">
                          <span className="text-amber-400 font-mono font-black text-xl tracking-tight">{vehicle.price}</span>
                          <span className="text-[9px] text-zinc-550 uppercase font-mono">Ex-Showroom Base</span>
                        </div>

                        {/* Spec parameters definitions */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start justify-between py-1 border-b border-zinc-900/50">
                            <span className="text-zinc-500 font-mono">Battery Physics</span>
                            <span className="text-zinc-205 font-bold text-right truncate max-w-[170px]">{vehicle.batteryType}</span>
                          </div>

                          <div className="flex items-start justify-between py-1 border-b border-zinc-900/50">
                            <span className="text-zinc-500 font-mono">Payload Limit</span>
                            <span className="text-zinc-205 font-bold text-right">{vehicle.capacity}</span>
                          </div>

                          <div className="flex items-start justify-between py-1 border-b border-zinc-900/50">
                            <span className="text-zinc-500 font-mono">BLDC Motor Setup</span>
                            <span className="text-amber-500 font-extrabold text-right">{vehicle.motorType || '1200W Heavy Duty Motor'}</span>
                          </div>

                          <div className="flex items-start justify-between py-1">
                            <span className="text-zinc-500 font-mono font-semibold">Drive Range Limit</span>
                            <span className="text-zinc-205 font-extrabold text-right">{vehicle.range}</span>
                          </div>
                        </div>

                        {/* Custom customisable specs features */}
                        <div className="space-y-1.5 pt-3 border-t border-zinc-900">
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Customisable Features:</span>
                          <div className="space-y-1">
                            {vehicle.features.slice(0, 3).map((feat, i) => (
                              <div key={i} className="flex items-center gap-2 text-zinc-300 text-xs">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Bottom CTA Button summoning enquiry popup */}
                    <div className="p-5 sm:p-6 pt-0">
                      <button
                        onClick={() => openEnquiry(vehicle.name)}
                        className="w-full text-center bg-zinc-905 hover:bg-zinc-900 hover:text-white border border-zinc-850 text-zinc-350 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Specs & Inquire Direct Quote
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {matchResult.length === 0 && (
                <div className="col-span-1 sm:col-span-2 py-16 text-center space-y-4 bg-zinc-950/20 border border-dashed border-zinc-900 rounded-3xl">
                  <span className="text-zinc-400 font-semibold block text-sm">No heavy-duty vehicles match your selection.</span>
                  <button
                    onClick={() => {
                      setPrefCategory('All');
                      setPrefBattery('All');
                      setPrefPriceLimit(250000);
                    }}
                    className="text-xs text-amber-500 font-mono hover:underline cursor-pointer font-bold"
                  >
                    Reset Filter Rules
                  </button>
                </div>
              )}
            </div>

            {matchResult.length > 0 && (
              <div className="text-[10px] text-zinc-600 text-center border-t border-zinc-905 pt-5 leading-relaxed font-mono">
                * All listings represent real-time dealer stock coordinates at Sundar Nagar depot. Operational range depends on freight loading parameters.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-505 font-bold uppercase tracking-widest text-xs font-mono">Customer Endorsements</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Operator Reviews</h2>
          <p className="text-zinc-505 text-xs sm:text-sm leading-relaxed font-sans">
            Hear from small business operators, wholesale food sellers, and passenger operators running Garud energy lineups around Brahmapur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 p-8 rounded-2xl flex flex-col justify-between hover:border-zinc-850 transition">
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(test.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic font-sans">
                  &quot;{test.review}&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-amber-500 to-orange-500 h-10 w-10 rounded-full flex items-center justify-center text-black font-extrabold text-xs">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-none">{test.name}</h4>
                  <span className="text-zinc-500 text-xs mt-1.5 block font-mono">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LOCATION & MAP SECTION */}
      <section className="py-24 bg-zinc-950/30 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Location details card */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs block font-mono">
              Brahmapur Flagship Showroom
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Visit our Showroom & Service Facility
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-sans">
              We are conveniently situated near the local Vegetables Market in Sundar Nagar. Stop by to inspect full chassis setups, review battery warranties, or schedule structural customization requests.
            </p>

            <div className="space-y-4 bg-zinc-950/80 border border-zinc-900 p-6 rounded-2xl">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider font-mono block mb-1">Showroom Location</span>
                  <p className="text-zinc-350 text-xs sm:text-sm font-sans leading-relaxed">
                    Shop No .3, Bijipur Main Rd, near Vegetables Market, Sundar Nagar, Brahmapur, Odisha 760001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-zinc-900">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider font-mono block mb-1">Direct Help coordinates</span>
                  <a href="tel:+918221822926" className="text-amber-500 hover:underline text-xs sm:text-sm font-semibold font-mono block">
                    +91 82218 22926
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Bijipur+Main+Rd,+Sundar+Nagar,+Brahmapur,+Odisha+760001"
                target="_blank"
                rel="noreferrer"
                id="maps-direct-redirect-btn"
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl border border-zinc-800 transition"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-550" />
              </a>
            </div>
          </div>

          {/* Interactive Stylized Map Representation */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-3xl p-4 min-h-[350px] relative overflow-hidden flex flex-col justify-between group">
            {/* Ambient map color grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-[70px]" />
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3 relative z-10">
              <span className="text-zinc-500 text-xs font-mono uppercase font-semibold">interactive vector blueprint</span>
              <span className="text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-1">
                ● ACTIVE ROUTE ONLINE
              </span>
            </div>

            {/* Stylized vector map routes */}
            <div className="relative w-full h-[240px] flex items-center justify-center relative z-10">
              <svg viewBox="0 0 300 150" className="w-[90%] h-full text-zinc-650 opacity-80">
                {/* Roads */}
                <line x1="10" y1="75" x2="290" y2="75" stroke="#2c2c31" strokeWidth="6" strokeLinecap="round" />
                <line x1="80" y1="10" x2="80" y2="140" stroke="#2c2c31" strokeWidth="4" strokeLinecap="round" />
                <line x1="200" y1="10" x2="200" y2="140" stroke="#2c2c31" strokeWidth="4" strokeLinecap="round" />
                
                {/* Active connection highlighting path */}
                <line x1="80" y1="75" x2="200" y2="75" stroke="#f59e0b" strokeWidth="3" opacity="0.6" strokeDasharray="5,2" />

                {/* Landmarks */}
                <rect x="25" y="30" width="45" height="25" rx="3" fill="#18181b" stroke="#27272a" strokeWidth="1" />
                <text x="32" y="45" fill="#52525b" fontSize="6" fontWeight="bold" fontFamily="monospace">NH-16 BYPASS</text>

                <rect x="215" y="30" width="60" height="25" rx="3" fill="#18181b" stroke="#27272a" strokeWidth="1" />
                <text x="221" y="45" fill="#52525b" fontSize="6" fontWeight="bold" fontFamily="monospace">VEGETABLE MKT</text>

                {/* Showroom location marker pin */}
                <g transform="translate(140, 75)">
                  <circle cx="0" cy="0" r="14" fill="rgba(245,158,11,0.25)" className="animate-ping" />
                  <circle cx="0" cy="0" r="7" fill="#f59e0b" />
                  <path d="M-8,-25 L8,-25 L0,-12 Z" fill="#f59e0b" />
                  <text x="-13" y="-29" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">GARUD SHOWROOM</text>
                </g>

                {/* Ganjam logistics point marker pins */}
                <circle cx="80" cy="75" r="4" fill="#d97706" />
                <circle cx="200" cy="75" r="4" fill="#d97706" />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-zinc-500 font-mono pt-3 border-t border-zinc-900 relative z-10">
              <span>BIJIPUR MAIN ROAD ARTERY</span>
              <span>SUNDAR NAGAR AREA</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Ready to Modernize Your Fleet?
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans">
          Whether you need a heavy-duty loader cargo bed fabricated, or want high capacity smart Lithium Battery replacement packs for your existing e-rickshaw, we match prices and quality terms.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="final-enquiry-cta-btn"
            onClick={() => openEnquiry('General Question')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold px-8 py-4 rounded-xl transition duration-300 text-xs uppercase tracking-wider font-mono cursor-pointer"
          >
            <span>Launch Enquiry Sheet</span>
            <MessageSquare className="w-4 h-4" />
          </button>
          
          <a
            id="final-call-cta-btn"
            href="tel:+918221822926"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 font-bold px-8 py-4 rounded-xl border border-zinc-800 transition duration-300 text-xs uppercase tracking-wider font-mono cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call +91 82218 22926</span>
          </a>
        </div>
      </section>

    </div>
  );
}
