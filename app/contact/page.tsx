'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getVehicles, saveEnquiry, Vehicle } from '@/lib/store';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Sliders } from 'lucide-react';

const contactSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  vehicleInterest: z.string().min(1, 'Please select your vehicle model of interest'),
  requirementType: z.enum(['Purchase Enquiry', 'Service Booking', 'Parts Enquiry', 'General Question']),
  preferredContact: z.enum(['Call', 'WhatsApp', 'Email']),
  message: z.string().min(5, 'Please provide enquiry details')
});

type ContactFormProps = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isValid, isSubmitting } } = useForm<ContactFormProps>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      requirementType: 'Purchase Enquiry',
      preferredContact: 'WhatsApp',
      vehicleInterest: 'General Question'
    }
  });

  useEffect(() => {
    // Sync vehicles for select drop-down
    setVehicles(getVehicles());
  }, []);

  const onSubmit = (data: ContactFormProps) => {
    try {
      saveEnquiry({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || undefined,
        vehicleInterest: data.vehicleInterest,
        requirementType: data.requirementType,
        preferredContact: data.preferredContact,
        message: data.message,
        sourcePage: 'Dedicated Contact Page /contact'
      });
      setSuccess(true);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  const contactInfos = [
    {
      icon: <Phone className="w-5 h-5 text-amber-500" />,
      title: 'Showroom Phone',
      value: '+91 82218 22926',
      desc: 'Call & WhatsApp support',
      link: 'tel:+918221822926'
    },
    {
      icon: <Mail className="w-5 h-5 text-amber-500" />,
      title: 'Email Address',
      value: 'garudautomobiles694@gmail.com',
      desc: 'Showroom & fleet requirements',
      link: 'mailto:garudautomobiles694@gmail.com'
    },
    {
      icon: <MapPin className="w-5 h-5 text-amber-500" />,
      title: 'Showroom Address',
      value: 'Shop No .3, Bijipur Main Rd',
      desc: 'Near Vegetables Market, Sundar Nagar, Brahmapur, Odisha 760001',
      link: 'https://maps.google.com/?q=Garud+Automobiles+Shop+No+.3+Bijipur+Main+Rd+Brahmapur+Odisha'
    }
  ];

  return (
    <div className="bg-black min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs block font-mono">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none">
            Speak to Our Advisors
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
            Have questions about range specs, battery replacement timelines, RTO approvals, or custom metal sheet designs? Fill the direct catalog query form below, or visit our showroom terminal in Ganjam.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info & Map Placeholder */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              {contactInfos.map((info, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex gap-4 items-start">
                  <div className="bg-amber-500/10 p-3 h-11 w-11 rounded-xl flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">{info.title}</h3>
                    <a 
                      href={info.link} 
                      className="block text-zinc-200 hover:text-amber-400 mt-1 font-semibold text-base transition duration-200"
                    >
                      {info.value}
                    </a>
                    <span className="text-zinc-500 text-xs mt-1 block">{info.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Timings Card */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs font-semibold uppercase tracking-widest border-b border-zinc-900 pb-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Operating Timings</span>
              </div>
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex justify-between border-b border-zinc-900/60 pb-1.5">
                  <span className="font-bold text-white">Mon, Tue, Thu, Sat</span>
                  <span className="text-right text-amber-400 font-mono font-medium">
                    10:00 AM - 2:00 PM<br />
                    4:00 PM - 8:00 PM
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/60 pb-1.5">
                  <span className="font-bold text-white">Wed, Fri</span>
                  <span className="text-right text-amber-400 font-mono font-medium">
                    10:00 AM - 2:00 PM<br />
                    5:00 PM - 9:00 PM
                  </span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span className="font-bold text-white">Sunday</span>
                  <span className="text-right text-zinc-200 font-mono font-medium">
                    10:00 AM - 2:00 PM<br />
                    <span className="text-[10px] text-zinc-500 italic">(Evening Closed)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Submission Form */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-90 w-full p-6 sm:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-mono text-[100px] font-extrabold text-zinc-500 pointer-events-none select-none">
              EV
            </div>

            <div className="relative">
              <h2 className="text-xl font-bold text-white tracking-tight mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                Showroom Query Desk
              </h2>

              {success ? (
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="mx-auto bg-amber-500/10 text-amber-500 p-3 h-14 w-14 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Log Complete!</h3>
                  <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you. Your showroom enquiry details have been synced. An authorized Garud executive from our Brahmapur desk will reach out shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-5 py-2 rounded-lg transition"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-2">Full Name *</label>
                      <input
                        id="contact-fullname"
                        type="text"
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all"
                        placeholder="Ramesh Mohanty"
                        {...register('fullName')}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-2">Mobile / WhatsApp *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all font-sans"
                        placeholder="e.g. 9437174641"
                        {...register('phone')}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email id */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-2">Email Address (Optional)</label>
                      <input
                        id="contact-email"
                        type="email"
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all"
                        placeholder="name@domain.com"
                        {...register('email')}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Selected vehicle drop down */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-2">Vehicle of Interest *</label>
                      <select
                        id="contact-vehicle-select"
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all cursor-pointer"
                        {...register('vehicleInterest')}
                      >
                        <option value="General Question">General / Fleet Guidance</option>
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.name}>{v.name} ({v.category})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Requirement drop down */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-2">Requirement Type *</label>
                      <select
                        id="contact-reqtype"
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all cursor-pointer"
                        {...register('requirementType')}
                      >
                        <option value="Purchase Enquiry">Purchase Enquiry</option>
                        <option value="Service Booking">Service Booking</option>
                        <option value="Parts Enquiry">Parts Enquiry</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>

                    {/* Preferred contact channel */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-2">Preferred Response Mode *</label>
                      <select
                        id="contact-preferred-node"
                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all cursor-pointer"
                        {...register('preferredContact')}
                      >
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="Call">Direct Cellular Call</option>
                        <option value="Email">Email Communication</option>
                      </select>
                    </div>
                  </div>

                  {/* Core description text box */}
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-2">Message Description *</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all resize-none"
                      placeholder="Details on down payment capabilities, custom color options, servicing bookings or parts specifications."
                      {...register('message')}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-extrabold cursor-pointer transition bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg shadow-amber-500/10 hover:brightness-105 active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                  </button>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
