'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVehicles, Vehicle } from '@/lib/store';
import { useEnquiry } from '@/hooks/use-enquiry';
import { Search, SlidersHorizontal, BatteryCharging, Milestone, ShieldCheck, HeartCrack } from 'lucide-react';

export default function VehiclesPage() {
  const { openEnquiry } = useEnquiry();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const list = getVehicles();
    setVehicles(list);
    setFilteredVehicles(list);
  }, []);

  // Sync Search and Filters
  useEffect(() => {
    let result = vehicles;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(v => v.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(q) || 
        v.batteryType.toLowerCase().includes(q) ||
        v.features.some(f => f.toLowerCase().includes(q))
      );
    }

    setFilteredVehicles(result);
  }, [searchQuery, selectedCategory, vehicles]);

  const categories = [
    { label: 'All Vehicles', value: 'All' },
    { label: 'E-Loader', value: 'E-Loader' },
    { label: 'E-Rickshaw', value: 'E-Rickshaw' },
    { label: 'E-Food Van', value: 'Food Van' },
    { label: 'E-Ice Cream Van', value: 'Ice Cream Van' },
    { label: 'Lithium Battery', value: 'Battery' }
  ];

  return (
    <div className="bg-black min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-amber-505 font-bold uppercase tracking-widest text-xs block font-mono">
            Online Showroom Catalog
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none font-sans">
            Our Vehicle Lineup
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
            Authorized Brahmapur dealership for certified zero emission commercial solutions. From structural heavy duty cargo loaders to comfortable passenger rickshaws, explore detailed specifications and request quotes.
          </p>
        </div>

        {/* Search controls + categorization tabs */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                id="catalog-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all font-sans"
                placeholder="Search models, batteries or features (e.g., Lithium, GPS)..."
              />
            </div>

            {/* Layout filter label */}
            <div className="col-span-1 hidden md:flex justify-end text-zinc-500 text-xs font-mono">
              <SlidersHorizontal className="w-4 h-4" />
            </div>

            {/* Category selection */}
            <div className="md:col-span-6 flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  id={`catalog-cat-${cat.value}`}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`text-xs px-4 py-2.5 rounded-xl border font-bold cursor-pointer transition ${
                    selectedCategory === cat.value
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Vehicles Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-zinc-950 border border-zinc-905 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 hover:shadow-[0_15px_40px_-5px_rgba(245,158,11,0.15)] hover:-translate-y-2.5 transition-all duration-300 ease-out"
              >
                <div>
                  {/* Image banner with layout */}
                  <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="w-full h-full object-cover grayscale brightness-95 opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                    />
                    
                    {/* Status Badge & Finance available tag */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <div className="bg-zinc-950/95 backdrop-blur border border-zinc-800 px-3 py-1 rounded-md text-[10px] font-bold text-amber-400 tracking-wider uppercase font-mono">
                        {vehicle.category}
                      </div>
                      <div className="bg-emerald-950/90 backdrop-blur border border-emerald-800 px-2.5 py-1 rounded-md text-[9px] font-extrabold text-emerald-400 tracking-normal uppercase font-sans flex items-center gap-1 shadow">
                        <span>💰 Finance Available</span>
                      </div>
                    </div>

                    {/* Stock level tag */}
                    <div className="absolute top-3 right-3 bg-black/85 backdrop-blur border border-zinc-805/80 px-2.5 py-1 rounded text-[9px] font-semibold text-zinc-400 tracking-wider font-mono">
                      {vehicle.status}
                    </div>
                  </div>

                  {/* Pricing + specifications ordered precisely: Name -> Price -> Battery -> Capacity -> Motor */}
                  <div className="p-6 space-y-4">
                    {/* 1. Name */}
                    <h3 className="font-extrabold text-white text-xl tracking-tight group-hover:text-amber-400 transition leading-tight">
                      {vehicle.name}
                    </h3>

                    {/* 2. Price */}
                    <div className="flex items-baseline gap-2 pt-1 border-b border-zinc-900 pb-3">
                      <span className="text-amber-400 font-mono font-extrabold text-2xl tracking-tight">{vehicle.price}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Ex-Showroom Price</span>
                    </div>

                    {/* 3. Specs list: Battery, Capacity, Motor, Range */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-start justify-between text-xs py-1.5 border-b border-zinc-900/40">
                        <span className="text-zinc-500 font-mono">Battery Physics</span>
                        <span className="text-zinc-200 font-bold text-right max-w-[185px] truncate">{vehicle.batteryType}</span>
                      </div>

                      <div className="flex items-start justify-between text-xs py-1.5 border-b border-zinc-900/40">
                        <span className="text-zinc-500 font-mono">Payload Capacity</span>
                        <span className="text-zinc-200 font-bold text-right">{vehicle.capacity}</span>
                      </div>

                      <div className="flex items-start justify-between text-xs py-1.5 border-b border-zinc-900/40">
                        <span className="text-zinc-500 font-mono">Motor Drive</span>
                        <span className="text-amber-500 font-bold text-right">{vehicle.motorType || '1200W Heavy Duty BLDC'}</span>
                      </div>

                      <div className="flex items-start justify-between text-xs py-1.5">
                        <span className="text-zinc-500 font-mono font-medium">Drive Range</span>
                        <span className="text-zinc-200 font-extrabold text-right">{vehicle.range}</span>
                      </div>
                    </div>

                    {/* Features block (renamed key layout specs to customizable features) */}
                    <div className="space-y-2 pt-3 border-t border-zinc-900">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold block">Customisable Features:</span>
                      <div className="space-y-1.5">
                        {vehicle.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-zinc-300 text-xs">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Inquiry Specs Trigger button */}
                <div className="p-6 pt-0 mt-6 border-t border-zinc-900">
                  <button
                    id={`catalog-v-specs-btn-${vehicle.id}`}
                    onClick={() => openEnquiry(vehicle.name)}
                    className="w-full text-center bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs py-3 rounded-xl shadow-md hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
                  >
                    View Specifications & WhatsApp Quote
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Fallback layout for empty search query */}
          {filteredVehicles.length === 0 && (
            <div className="col-span-3 py-20 text-center bg-zinc-950 border border-zinc-900 rounded-2xl p-8 space-y-4">
              <div className="mx-auto bg-zinc-900 text-zinc-500 p-4 h-16 w-16 rounded-full flex items-center justify-center">
                <HeartCrack className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Vehicles Match Details</h3>
              <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                Could not find any models matching &quot;<span className="text-amber-500 font-semibold">{searchQuery}</span>&quot; in the {selectedCategory} category.
              </p>
              <button
                id="reset-catalog-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-zinc-900 hover:bg-zinc-800 text-xs text-amber-500 px-5 py-2 rounded-lg transition"
              >
                Clear Search Constraints
              </button>
            </div>
          )}
        </div>

        {/* Bottom Ganjam District compliance disclaimer */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-amber-550 font-bold uppercase tracking-widest text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Ganjam District Authorized Dealership Depot</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              All vehicles displayed carry complete RTO Odisha compliance approvals. Batteries are supplied with official manufacturer warranties. Showroom test drives and custom shell fabrications are fully available at our Brahmapur terminal.
            </p>
          </div>
          <button
            id="catalog-general-enquiry-btn"
            onClick={() => openEnquiry('General Question')}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-6 py-3 rounded-xl border border-zinc-800 whitespace-nowrap transition cursor-pointer"
          >
            Custom Fleet Configuration Request
          </button>
        </div>

      </div>
    </div>
  );
}
