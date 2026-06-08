'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Send, PhoneCall, Battery, Milestone, ShieldCheck, CheckCircle2, MessageSquareText } from 'lucide-react';
import { useEnquiry } from '@/hooks/use-enquiry';
import { getVehicles, saveEnquiry, Vehicle } from '@/lib/store';

const enquirySchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  requirementType: z.enum(['Purchase Enquiry', 'Service Booking', 'Parts Enquiry', 'General Question']),
  preferredContact: z.enum(['Call', 'WhatsApp', 'Email']),
  message: z.string().min(5, 'Message must be at least 5 characters')
});

type EnquiryFormProps = z.infer<typeof enquirySchema>;

export default function EnquiryModal() {
  const { isOpen, selectedVehicle, closeEnquiry } = useEnquiry();
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isValid, isSubmitting } } = useForm<EnquiryFormProps>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      requirementType: 'Purchase Enquiry',
      preferredContact: 'WhatsApp',
      message: '',
      email: ''
    }
  });

  // Fetch match details for the selected vehicle name if it exists
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      reset({
        requirementType: selectedVehicle !== 'General Question' ? 'Purchase Enquiry' : 'General Question',
        preferredContact: 'WhatsApp',
        fullName: '',
        phone: '',
        email: '',
        message: selectedVehicle !== 'General Question' 
          ? `I would like to enquire about the starting price, booking process, and financing options for the ${selectedVehicle}.`
          : 'Please details your query...'
      });

      const vehiclesList = getVehicles();
      const match = vehiclesList.find(v => v.name.toLowerCase() === selectedVehicle.toLowerCase());
      setActiveVehicle(match || null);
    }
  }, [isOpen, selectedVehicle, reset]);

  if (!isOpen) return null;

  // Pre-populated WhatsApp configuration
  const dealerWhatsAppNumber = '918221822926'; // Authorized contact
  const waPrepopulatedText = encodeURIComponent(
    `Hello Garud Automobiles Brahmapur, I am making a direct enquiry regarding the "${selectedVehicle || 'E-Vehicles'}". Please provide me with details on price quotations, color availability, down-payment schemes, and delivery dates.`
  );
  const handleWhatsAppDirectRedirect = () => {
    window.open(`https://wa.me/${dealerWhatsAppNumber}?text=${waPrepopulatedText}`, '_blank');
  };

  const onSubmit = (data: EnquiryFormProps) => {
    try {
      saveEnquiry({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || undefined,
        vehicleInterest: selectedVehicle,
        requirementType: data.requirementType,
        preferredContact: data.preferredContact,
        message: data.message,
        sourcePage: `Showroom Dialog: ${selectedVehicle}`
      });
      setSuccess(true);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="enquiry-modal-container"
        className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh] md:max-h-[85vh]"
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={closeEnquiry}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Vehicle Details (Active when a vehicle name is chosen) */}
        <div className="md:col-span-5 bg-zinc-900/50 border-r border-zinc-800/60 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs block mb-2 font-mono">
              Vehicle Spec Sheet
            </span>
            <h2 id="modal-vehicle-title" className="text-2xl font-extrabold text-white tracking-tight leading-tight">
              {selectedVehicle === 'General Question' ? 'Garud Showroom Enquiry' : selectedVehicle}
            </h2>

            {activeVehicle ? (
              <div className="mt-6 space-y-5">
                {/* Image & Price banner */}
                <div className="relative rounded-xl overflow-hidden border border-zinc-850 aspect-video bg-zinc-950">
                  <img
                    src={activeVehicle.imageUrl}
                    alt={activeVehicle.name}
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                  <div className="absolute bottom-3 left-3 bg-zinc-950/90 backdrop-blur border border-zinc-800 px-3 py-1 rounded-lg">
                    <span className="text-amber-400 text-sm font-bold">{activeVehicle.price}</span>
                    <span className="text-[10px] text-zinc-500 block">Ex-Showroom Price</span>
                  </div>
                </div>

                {/* Spec List */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-905">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                      <Milestone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Drive Range</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-100">{activeVehicle.range}</span>
                  </div>

                  <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-905">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                      <Battery className="w-3.5 h-3.5 text-amber-500" />
                      <span>Battery Spec</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-100 line-clamp-1">{activeVehicle.batteryType}</span>
                  </div>
                </div>

                {/* Secondary Specs */}
                <div className="space-y-2 text-xs border-t border-zinc-850 pt-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Charging Duration</span>
                    <span className="text-zinc-300 font-medium">{activeVehicle.chargingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Payload Capacity</span>
                    <span className="text-zinc-300 font-medium">{activeVehicle.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Dealer Warranty</span>
                    <span className="text-zinc-300 font-medium">{activeVehicle.warranty}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-1.5">
                  <span className="text-zinc-500 text-xs font-semibold block uppercase tracking-wider">Highlight Features:</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {activeVehicle.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Connect with the official Garud Automobiles showroom located at Sundar Nagar, Bijipur Main Rd, Brahmapur. Submit your contact details, and an expert will get back to you with custom quotes.
                </p>
                <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-xl space-y-3.5">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">Why Choose Garud EV?</h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex gap-2">✓ High efficiency Lithium Battery technology</li>
                    <li className="flex gap-2">✓ Authorised Ganjam sales and servicing depot</li>
                    <li className="flex gap-2">✓ Comprehensive loan & financing approvals</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-850">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified authorised dealership process</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions & Forms */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* DIRECT WHATSAPP ACTION HERO COMPONENT */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 p-4 sm:p-5 rounded-xl mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 select-none text-emerald-500">
                <MessageSquareText className="w-24 h-24 stroke-[1]" />
              </div>

              <span className="bg-emerald-500 text-emerald-950 font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-2 font-mono">
                ⚡ Fastest Channel
              </span>
              <h3 className="text-sm font-bold text-white mb-2">
                Instant Response via WhatsApp Business
              </h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed max-w-md">
                Skip filling the layout form entirely! Ask our showroom advisors on WhatsApp in one click with your pre-configured enquiry.
              </p>

              {/* DIRECT WHATSAPP ENQUIRY BUTTON */}
              <button
                id="direct-whatsapp-enquiry-btn"
                type="button"
                onClick={handleWhatsAppDirectRedirect}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946 C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.455 4.811 1.456 5.486 0 9.95-4.461 9.954-9.94.002-2.654-1.031-5.15-2.903-7.025-1.873-1.874-4.364-2.907-7.015-2.908-5.49 0-9.957 4.463-9.961 9.943-.001 1.838.504 3.633 1.464 5.22l-.994 3.626 3.714-.974zm11.08-5.385c-.3-.15-1.771-.875-2.046-.975-.276-.102-.476-.151-.676.15-.2.299-.774.975-.949 1.174-.175.2-.35.224-.65.074-1.05-.525-1.802-.916-2.502-2.12-.175-.299.175-.279.5-.929.054-.108.027-.206-.014-.306-.041-.1-.375-.904-.515-1.241-.132-.317-.267-.274-.367-.279-.095-.005-.205-.006-.315-.006-.11 0-.289.041-.44.206-.151.166-.576.561-.576 1.368 0 .807.589 1.589.67 1.7.083.11 1.158 1.768 2.806 2.48.392.17.697.271.936.347.394.125.753.107 1.036.065.316-.047 1.771-.725 2.021-1.393.25-.668.25-1.241.175-1.393-.075-.15-.275-.224-.575-.374z"/>
                </svg>
                Direct WhatsApp Enquiry
              </button>
            </div>

            {/* Standard HTML Form */}
            {success ? (
              <div 
                id="modal-success-screen"
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="mx-auto bg-amber-500/10 text-amber-500 p-3 h-14 w-14 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Spec Sheet Request Logged!</h3>
                <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Thank you for your enquiry. Your requirement for the <span className="text-amber-500 font-semibold">{selectedVehicle}</span> has been synced with the Ganjam Regional Sales desk.
                </p>
                <button
                  onClick={closeEnquiry}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-6 py-2.5 rounded-lg transition"
                >
                  Return to Showroom
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
                <div className="text-zinc-500 text-xs uppercase font-mono tracking-widest mb-2">
                  Or submit callback form
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Full Name *</label>
                    <input
                      id="form-fullname-input"
                      type="text"
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all font-sans"
                      placeholder="e.g. Ramesh Patnaik"
                      {...register('fullName')}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">WhatsApp / Phone *</label>
                    <input
                      id="form-phone-input"
                      type="tel"
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all font-sans"
                      placeholder="10-digit mobile layout"
                      {...register('phone')}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email field */}
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Email Address (Optional)</label>
                    <input
                      id="form-email-input"
                      type="email"
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all font-sans"
                      placeholder="name@gmail.com"
                      {...register('email')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Requirement type */}
                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Requirement Type *</label>
                    <select
                      id="form-reqtype-select"
                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all cursor-pointer font-sans"
                      {...register('requirementType')}
                    >
                      <option value="Purchase Enquiry">Purchase Enquiry</option>
                      <option value="Service Booking">Service Booking</option>
                      <option value="Parts Enquiry">Parts Enquiry</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Contact & Selected Vehicle Info info only */}
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Preferred Contact Mode *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['WhatsApp', 'Call', 'Email'].map((mode) => (
                      <label 
                        key={mode} 
                        className="flex items-center justify-center gap-2 bg-zinc-900/40 border border-zinc-800 p-2.5 rounded-xl cursor-pointer hover:bg-zinc-900/80 transition-all text-xs text-zinc-300 font-sans"
                      >
                        <input
                          id={`form-contact-${mode.toLowerCase()}`}
                          type="radio"
                          value={mode}
                          {...register('preferredContact')}
                          className="accent-amber-500"
                        />
                        <span>{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message field */}
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Enquiry Notes / Core Message *</label>
                  <textarea
                    id="form-message-area"
                    rows={3}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-zinc-900 transition-all resize-none font-sans"
                    placeholder="Provide information on target timelines, custom sheet fabrication requirements, or test drives."
                    {...register('message')}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {/* Submit Form Button */}
                <button
                  id="form-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl text-sm font-extrabold cursor-pointer transition-all bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg hover:brightness-110 active:scale-[0.99]"
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
  );
}
