'use client';

import React, { useState, useEffect } from 'react';
import { 
  getVehicles, 
  saveVehicle, 
  deleteVehicle, 
  getEnquiries, 
  saveEnquiry, 
  deleteEnquiry, 
  Vehicle, 
  Enquiry,
  Review,
  getReviews,
  saveReview,
  deleteReview
} from '@/lib/store';
import { 
  Lock, 
  TrendingUp, 
  Mail, 
  Phone, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Archive, 
  Sliders, 
  Landmark, 
  Sparkles,
  BookOpenCheck,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  FolderOpen,
  Image as ImageIcon,
  X
} from 'lucide-react';

const VEHICLE_IMAGE_LIBRARY = [
  {
    name: 'Standard Cargo Loader (Ocean Blue)',
    category: 'E-Loader',
    url: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Robust Industrial Hauler (Red/Black)',
    category: 'E-Loader',
    url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Modern Garud Cargo Loader Core',
    category: 'E-Loader',
    url: 'https://picsum.photos/seed/eloader/600/400',
  },
  {
    name: 'Classic Yellow Cab E-Rickshaw',
    category: 'E-Rickshaw',
    url: 'https://picsum.photos/seed/erickshaw/600/400',
  },
  {
    name: 'Smart Urban Passenger Trike',
    category: 'E-Rickshaw',
    url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Deluxe Multi-Passenger E-Rickshaw',
    category: 'E-Rickshaw',
    url: 'https://picsum.photos/seed/evsco/600/400',
  },
  {
    name: 'Garud Mobile Food Van Core',
    category: 'Food Van',
    url: 'https://picsum.photos/seed/foodvan/600/400',
  },
  {
    name: 'Stainless Steel Snack Stall Mobile',
    category: 'Food Van',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Garud Polar Freezer Unit',
    category: 'Ice Cream Van',
    url: 'https://picsum.photos/seed/icecream/600/400',
  },
  {
    name: 'Streetside Mobile Parlor Dispenser',
    category: 'Ice Cream Van',
    url: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Garud Smart Lithium Cell Pack',
    category: 'Battery',
    url: 'https://picsum.photos/seed/battery/600/400',
  },
  {
    name: 'Active Pack BMS Lithium Unit',
    category: 'Battery',
    url: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=600&auto=format&fit=crop&q=80',
  },
];

export default function AdminHubPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CRM state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'inventory' | 'reviews'>('leads');

  // Form states - Add Review
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState<Omit<Review, 'id'>>({
    name: '',
    role: '',
    vehicleModel: 'Garud Passenger E-Rickshaw',
    rating: 5,
    comment: '',
    createdDate: '',
    verified: true
  });

  // Form states - Add Vehicle
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id' | 'featured'>>({
    name: '',
    category: 'E-Loader',
    price: '₹1,45,000',
    range: '90-100 km',
    batteryType: '60V Lithium Cells',
    chargingTime: '4 Hours',
    capacity: '750 kg',
    warranty: '3 Years Cells',
    imageUrl: 'https://picsum.photos/seed/evsco/600/400',
    status: 'In Stock',
    features: ['LED Projection Lamp', 'Regenerative Braking'],
    motorType: '1200W Waterproof Brushless DC Motor'
  });

  // Image Library state managers
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<'All' | Vehicle['category']>('All');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  // Active editing notes state
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    setIsMounted(true);
    // Check local login status
    const logged = localStorage.getItem('garuda_admin_logged');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
    setVehicles(getVehicles());
    setEnquiries(getEnquiries());
    setReviews(getReviews());
  }, []);

  const handleDeleteReview = (id: string) => {
    if (confirm('Permanently delete this customer review/feedback from live dashboard?')) {
      const updated = deleteReview(id);
      setReviews(updated);
    }
  };

  const handleToggleReviewVerified = (id: string) => {
    const matched = reviews.find(r => r.id === id);
    if (matched) {
      const updatedReview: Review = { ...matched, verified: !matched.verified };
      const updated = saveReview(updatedReview);
      setReviews(updated);
    }
  };

  const handleCreateReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      alert('Reviewer name and comment feedback are required.');
      return;
    }
    const created: Review = {
      ...newReview,
      id: 'rev-usr-' + Math.random().toString(36).substr(2, 5),
      createdDate: new Date().toISOString()
    };
    const updated = saveReview(created);
    setReviews(updated);
    setIsAddingReview(false);
    setNewReview({
      name: '',
      role: '',
      vehicleModel: 'Garud Passenger E-Rickshaw',
      rating: 5,
      comment: '',
      createdDate: '',
      verified: true
    });
  };

  if (!isMounted) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('garuda_admin_logged', 'true');
        setIsLoggedIn(true);
        setLoginError('');
      } else {
        setLoginError(data.error || 'Invalid dealership username or password coordinates. Make sure there are no typos.');
      }
    } catch (err) {
      setLoginError('Authentication service is currently offline. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('garuda_admin_logged');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // CRM status transition
  const handleUpdateLeadStatus = (id: string, status: Enquiry['status']) => {
    const matched = enquiries.find(e => e.id === id);
    if (matched) {
      const updated = saveEnquiry({
        ...matched,
        status
      });
      setEnquiries(updated);
    }
  };

  const handleSaveAdminNotes = (id: string) => {
    const matched = enquiries.find(e => e.id === id);
    const noteText = editingNotes[id];
    if (matched && typeof noteText !== 'undefined') {
      const updated = saveEnquiry({
        ...matched,
        adminNotes: noteText
      });
      setEnquiries(updated);
      alert('Admin notes updated successfully for Ganjam file.');
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Delete this customer trade enquiry record permanently?')) {
      const updated = deleteEnquiry(id);
      setEnquiries(updated);
    }
  };

  // Inventory Management
  const handleCreateVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.price) {
      alert('Name of model and price are required.');
      return;
    }
    const created: Vehicle = {
      ...newVehicle,
      id: 'ev-user-' + Math.random().toString(36).substr(2, 5),
      featured: false
    };
    const updated = saveVehicle(created);
    setVehicles(updated);
    setIsAddingVehicle(false);
    // Reset form
    setNewVehicle({
      name: '',
      category: 'E-Loader',
      price: '₹1,45,005',
      range: '90-100 km',
      batteryType: '60V Lithium Cells',
      chargingTime: '4 Hours',
      capacity: '750 kg',
      warranty: '3 Years Cells',
      imageUrl: 'https://picsum.photos/seed/evsco/600/400',
      status: 'In Stock',
      features: ['LED Projection Lamp', 'Regenerative Braking'],
      motorType: '1200W Waterproof Brushless DC Motor'
    });
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Selected file is not an image. Please pick an image file (PNG/JPG/WEBP).');
      return;
    }

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onloadend = () => {
             setNewVehicle(prevVeh => ({
               ...prevVeh,
               imageUrl: reader.result as string
             }));
             setUploadProgress(null);
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Permanently remove this vehicle configuration from live catalog?')) {
      const updated = deleteVehicle(id);
      setVehicles(updated);
    }
  };

  // Calculations for dashboard
  const totalLeads = enquiries.length;
  const newLeads = enquiries.filter(e => e.status === 'New').length;
  const closedLeads = enquiries.filter(e => e.status === 'Closed').length;

  if (!isLoggedIn) {
    return (
      <div className="bg-black min-h-[80vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="mx-auto bg-amber-500/10 text-amber-500 p-3 h-12 w-12 rounded-xl flex items-center justify-center animate-pulse">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-none font-sans uppercase">
              GARUD DEALER HUB
            </h1>
            <p className="text-zinc-500 text-xs tracking-wide">
              Authorized CRM & Inventory control center access.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase font-mono">Dealer Username</label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all font-sans"
                placeholder="Username e.g. Garud..."
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase font-mono">Brahmapur Key Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all font-sans"
                  placeholder="Password codes e.g. garud..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-500 transition-all p-1 cursor-pointer flex items-center justify-center"
                  style={{ background: 'none', border: 'none' }}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-xs flex gap-1.5 items-center">
                <AlertCircle className="w-3.5 h-3.5" />
                {loginError}
              </p>
            )}

            <div className="pt-2">
              <button
                id="admin-login-submit"
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? "Signing In to CRM..." : "Sign In to CRM Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-12 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hub Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-900 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ganjam CRM Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1.5">
              Authorized Showroom Hub
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-805 text-zinc-400 text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Terminal Logout
          </button>
        </div>

        {/* Dashboard Analytics mini badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <span className="text-zinc-550 text-xs uppercase font-mono tracking-wider">Total Enquiries</span>
              <BookOpenCheck className="w-4 h-4 text-amber-550" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-3">{totalLeads}</div>
            <p className="text-[10px] text-zinc-550 mt-1.5">Active database rows logged</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <span className="text-zinc-555 text-xs uppercase font-mono tracking-wider">Pending (New) Trade Leads</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono mt-3">{newLeads}</div>
            <p className="text-[10px] text-zinc-550 mt-1.5">Requires callback or WhatsApp action</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <span className="text-zinc-555 text-xs uppercase font-mono tracking-wider">Catalog Models</span>
              <Sliders className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-3">{vehicles.length}</div>
            <p className="text-[10px] text-zinc-550 mt-1.5">Registered specification variants</p>
          </div>
        </div>

        {/* Dynamic Controls Switch */}
        <div className="border-b border-zinc-900 flex gap-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-4 px-2 font-bold text-sm transition relative cursor-pointer ${
              activeTab === 'leads' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Leads Center ({enquiries.length})
            {activeTab === 'leads' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-4 px-2 font-bold text-sm transition relative cursor-pointer ${
              activeTab === 'inventory' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Manage Catalog Grid ({vehicles.length})
            {activeTab === 'inventory' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-2 font-bold text-sm transition relative cursor-pointer ${
              activeTab === 'reviews' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Feedbacks & Reviews ({reviews.length})
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Dynamic Tab Body content */}
        <div>
          {activeTab === 'leads' && (
            /* Tab 1: Leads CRM */
            <div className="space-y-6">
              {enquiries.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-12 text-center text-zinc-500">
                  <Archive className="w-10 h-10 mx-auto text-zinc-650 mb-3" />
                  <p className="text-sm">No customer enquiries database traces found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((lead) => (
                    <div 
                      key={lead.id}
                      className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6 hover:border-zinc-800 transition"
                    >
                      {/* Flex row metadata */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-900 pb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-extrabold text-base">{lead.fullName}</span>
                            <span className="bg-zinc-900 border border-zinc-800 text-[10px] text-amber-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              {lead.vehicleInterest}
                            </span>
                          </div>
                          
                          <div className="flex gap-4 text-xs text-zinc-500 mt-2 font-sans flex-wrap">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {lead.phone}
                            </span>
                            {lead.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                {lead.email}
                              </span>
                            )}
                            <span>Created: {new Date(lead.createdDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Drop down Status update */}
                        <div className="flex items-center gap-3">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Enquiry['status'])}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="New">🔴 New Lead</option>
                            <option value="Contacted">🟡 Contacted</option>
                            <option value="Follow-up">🔵 Follow-up</option>
                            <option value="Closed">🟢 Closed File</option>
                          </select>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 bg-zinc-900 hover:bg-zinc-850 hover:text-red-500 rounded-xl transition border border-zinc-850 cursor-pointer"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div>
                        <span className="text-[10px] text-zinc-550 uppercase font-mono block mb-1">Customer requirements details:</span>
                        <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-950/40 p-4 border border-zinc-905 rounded-xl italic">
                          &quot;{lead.message}&quot;
                        </p>
                      </div>

                      {/* Admin Notes block */}
                      <div className="space-y-2 border-t border-zinc-900 pt-5">
                        <label className="block text-zinc-550 text-[10px] uppercase font-mono">Dealership Admin call notes / action-tracker:</label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            defaultValue={lead.adminNotes || ''}
                            onChange={(e) => setEditingNotes({ ...editingNotes, [lead.id]: e.target.value })}
                            placeholder="Add action records (e.g., Quotation shared via WhatsApp, trade financing approved...)"
                            className="flex-1 bg-zinc-900/60 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={() => handleSaveAdminNotes(lead.id)}
                            className="bg-zinc-900 hover:bg-zinc-850 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition cursor-pointer"
                          >
                            Save Log
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'inventory' && (
            /* Tab 2: Inventory control center */
            <div className="space-y-8">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white tracking-tight">Active Vehicles (Showroom Display)</h3>
                <button
                  onClick={() => setIsAddingVehicle(!isAddingVehicle)}
                  className="flex items-center gap-1.5 bg-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer hover:brightness-105 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  {isAddingVehicle ? 'Collapse Panel' : 'Register New Vehicle'}
                </button>
              </div>

              {/* Add Vehicle panel form */}
              {isAddingVehicle && (
                <form 
                  onSubmit={handleCreateVehicleSubmit} 
                  className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-6 duration-300"
                >
                  <div className="col-span-3 border-b border-zinc-900 pb-3 mb-1">
                    <h4 className="text-sm font-bold text-amber-500 font-mono tracking-wider uppercase">Add Specification Sheet</h4>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Model Name *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="e.g. Garud Cargo 900"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Category *</label>
                    <select
                      value={newVehicle.category}
                      onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value as Vehicle['category'] })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="E-Loader">E-Loader</option>
                      <option value="E-Rickshaw">E-Rickshaw</option>
                      <option value="Food Van">Food Van</option>
                      <option value="Ice Cream Van">Ice Cream Van</option>
                      <option value="Battery">Battery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Ex-Showroom Price *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.price}
                      onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="₹1,50,000"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Drive Range *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.range}
                      onChange={(e) => setNewVehicle({ ...newVehicle, range: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="100 km"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Battery Physics *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.batteryType}
                      onChange={(e) => setNewVehicle({ ...newVehicle, batteryType: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="60V 100Ah Lithium Battery"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Charging Time *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.chargingTime}
                      onChange={(e) => setNewVehicle({ ...newVehicle, chargingTime: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="3.5 Hours"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Payload Capacity *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.capacity}
                      onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="650 kg"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Dealer Warranty *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.warranty}
                      onChange={(e) => setNewVehicle({ ...newVehicle, warranty: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="3 Years Cell Warranty"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Motor Physics / Type *</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.motorType}
                      onChange={(e) => setNewVehicle({ ...newVehicle, motorType: e.target.value })}
                      className="w-full bg-zinc-905 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      placeholder="1200W High Torque Brushless DC Motor"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-3 bg-zinc-900/10 border border-zinc-900/40 p-4 rounded-2xl flex flex-col md:flex-row gap-5">
                    {/* Visual thumbnail preview */}
                    <div className="w-full md:w-40 h-28 relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/80 flex flex-col items-center justify-center group shrink-0">
                      {newVehicle.imageUrl ? (
                        <>
                          <img
                            src={newVehicle.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] text-zinc-400 font-mono">Active Link</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3">
                          <ImageIcon className="w-6 h-6 text-zinc-650 mx-auto mb-1" />
                          <span className="text-[10px] text-zinc-550 font-mono">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Controls & Inputs */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <label className="block text-zinc-400 text-xs font-semibold uppercase font-mono tracking-wider">Vehicle Catalog Image *</label>
                        <div className="flex items-center gap-2">
                          {/* Choose from Preset Library Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const currentCat = newVehicle.category;
                              setSelectedLibraryCategory(currentCat);
                              setShowImageLibrary(true);
                            }}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-500 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            Browse Library Presets
                          </button>

                          {/* Upload Local File Button */}
                          <label className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95">
                            <Upload className="w-3.5 h-3.5" />
                            Upload Local Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLocalImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={newVehicle.imageUrl}
                          onChange={(e) => setNewVehicle({ ...newVehicle, imageUrl: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-4 pr-16 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-mono"
                          placeholder="Or paste direct image URL links here..."
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 font-mono">
                          URL LINK
                        </div>
                      </div>

                      {/* Upload loader status if loading */}
                      {uploadProgress !== null && (
                        <div className="space-y-1 animate-pulse">
                          <div className="flex justify-between text-[10px] font-mono text-amber-500">
                            <span>Uploading local media...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 transition-all duration-150" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                        Customize catalog preview using real-time local file uploads (supports auto-base64 offline sync) or curated stock configurations from our Brahmapur image library setup.
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 pt-4 border-t border-zinc-900 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingVehicle(false)}
                      className="text-zinc-500 hover:text-white text-xs font-semibold px-4 py-2 transition"
                    >
                      Dismiss Form
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 text-black font-extrabold text-xs px-6 py-2.5 rounded-xl hover:brightness-105 active:scale-95 transition"
                    >
                      Save Configuration Sheet
                    </button>
                  </div>
                </form>
              )}

              {/* Inventory Table Grid */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm text-zinc-400">
                    <thead className="bg-zinc-900/60 text-zinc-500 text-[10px] uppercase font-mono tracking-wider border-b border-zinc-900">
                      <tr>
                        <th className="p-4 sm:p-5 font-bold">Model Plate</th>
                        <th className="p-4 sm:p-5 font-bold">Category</th>
                        <th className="p-4 sm:p-5 font-bold">Price</th>
                        <th className="p-4 sm:p-5 font-bold">Drive specs</th>
                        <th className="p-4 sm:p-5 font-bold text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 font-sans">
                      {vehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-zinc-900/30 transition">
                          <td className="p-4 sm:p-5 font-bold text-white">{v.name}</td>
                          <td className="p-4 sm:p-5">
                            <span className="bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-500 font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {v.category}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 font-mono text-amber-500 font-bold">{v.price}</td>
                          <td className="p-4 sm:p-5 text-xs text-zinc-500">
                            <div>Range: {v.range}</div>
                            <div className="line-clamp-1">Battery: {v.batteryType}</div>
                            <div className="line-clamp-1 text-amber-500/80 font-mono text-[10px]">Motor: {v.motorType || '1200W Heavy Duty BLDC'}</div>
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="text-zinc-600 hover:text-red-500 transition cursor-pointer p-1.5 inline-block"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'reviews' && (
            /* Tab 3: Reviews control center */
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white tracking-tight">Customer Feedbacks & Testimonials</h3>
                <button
                  onClick={() => setIsAddingReview(!isAddingReview)}
                  className="flex items-center gap-1.5 bg-amber-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer hover:brightness-105 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  {isAddingReview ? 'Cancel Manual Input' : 'Add Client Review'}
                </button>
              </div>

              {/* Add Manual Review form */}
              {isAddingReview && (
                <form 
                  onSubmit={handleCreateReviewSubmit} 
                  className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6 animate-in slide-in-from-top-6 duration-300"
                >
                  <div className="border-b border-zinc-900 pb-3 mb-1">
                    <h4 className="text-sm font-bold text-amber-500 font-mono tracking-wider uppercase">Add Offline Client Testimonial</h4>
                    <p className="text-xs text-zinc-500 mt-1">Directly record driver reviews or offline customer feedback given at Brahmapur depot</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Client Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-sans"
                        placeholder="e.g. Ramesh Chandra Das"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Client Role / Profession *</label>
                      <input
                        type="text"
                        required
                        value={newReview.role}
                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-sans"
                        placeholder="e.g. Brahmapur Cargo Delivery Partner"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-1.5">E-Vehicle Bought *</label>
                      <select
                        value={newReview.vehicleModel}
                        onChange={(e) => setNewReview({ ...newReview, vehicleModel: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer font-sans"
                      >
                        <option value="Garud Passenger E-Rickshaw">Garud Passenger E-Rickshaw</option>
                        <option value="Garud Cargo Loader 750">Garud Cargo Loader 750</option>
                        <option value="Garud Mobile Food Van">Garud Mobile Food Van</option>
                        <option value="Garud Polar Ice-Cream Dispenser">Garud Polar Ice-Cream Dispenser</option>
                        <option value="Garud Premium Lithium Battery Pack">Garud Premium Lithium Battery Pack</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Rating (1 to 5 Stars)</label>
                      <div className="flex items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: val })}
                            className="p-1 transition-transform active:scale-95 cursor-pointer"
                          >
                            <Star 
                              className={`w-5 h-5 ${
                                val <= newReview.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-700'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-semibold mb-1.5">Feedback Comments *</label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 resize-none font-sans"
                      placeholder="Write driver comments about fuel savings, battery backup or vehicle durability..."
                    />
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsAddingReview(false)}
                      className="bg-zinc-900 hover:bg-zinc-850 hover:text-white text-zinc-400 text-xs font-semibold px-4 py-2.5 rounded-xl border border-zinc-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition hover:brightness-110 active:scale-95 cursor-pointer font-mono"
                    >
                      Save Testimonial
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List Stream */}
              <div className="grid grid-cols-1 gap-6">
                {reviews.length === 0 ? (
                  <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-12 text-center text-zinc-500">
                    <Star className="w-10 h-10 mx-auto text-zinc-650 mb-3" />
                    <p className="text-sm">No testimonies/reviews database records found in local memory.</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-zinc-800 transition"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex gap-3 items-center">
                          <div className="bg-gradient-to-tr from-amber-500 to-orange-500 h-10 w-10 rounded-full flex items-center justify-center text-black font-extrabold text-sm shadow">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                              {rev.name}
                              <span className="text-zinc-550 font-normal text-xs font-mono">({rev.role})</span>
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="bg-zinc-900 border border-zinc-805 text-[10px] text-amber-500 px-2 py-0.5 rounded-md font-mono">
                                {rev.vehicleModel}
                              </span>
                              <span className="text-[10px] text-zinc-550 font-mono">
                                {new Date(rev.createdDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {/* Verif pill toggler */}
                          <button
                            onClick={() => handleToggleReviewVerified(rev.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono transition cursor-pointer ${
                              rev.verified 
                                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-950' 
                                : 'bg-amber-950/40 border-amber-800/80 text-amber-400 hover:bg-amber-950'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{rev.verified ? 'VERIFIED' : 'PENDING APPROVAL'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-2 bg-zinc-900 hover:bg-zinc-850 hover:text-red-500 rounded-xl border border-zinc-850 transition cursor-pointer"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-zinc-300 text-sm leading-relaxed italic bg-zinc-950/30 p-4 border border-zinc-905 rounded-xl">
                        &quot;{rev.comment}&quot;
                      </p>

                      {/* Stars */}
                      <div className="flex gap-0.5 pt-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${
                              idx < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-800'
                            }`} 
                          />
                        ))}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Image Library Selector Modal */}
      {showImageLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button 
              type="button"
              onClick={() => setShowImageLibrary(false)}
              className="absolute right-6 top-6 text-zinc-500 hover:text-white transition cursor-pointer p-1.5 hover:bg-zinc-900 rounded-full flex items-center justify-center"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold font-mono tracking-wider text-amber-500 flex items-center gap-2 uppercase">
                <FolderOpen className="text-amber-500 w-5 h-5 animate-pulse" />
                Showroom Image Library Presets
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Select an optimized catalog image below to instantly register this vehicle's specification preview.
              </p>
              
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-1.5 bg-zinc-900/40 p-1 rounded-xl border border-zinc-800/80 mt-4 max-w-max">
                {(['All', 'E-Loader', 'E-Rickshaw', 'Food Van', 'Ice Cream Van', 'Battery'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedLibraryCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-2xs uppercase font-mono tracking-wider transition cursor-pointer ${
                      selectedLibraryCategory === cat 
                        ? 'bg-amber-500 text-black font-extrabold shadow-sm' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-2">
              {VEHICLE_IMAGE_LIBRARY
                .filter((item) => selectedLibraryCategory === 'All' || item.category === selectedLibraryCategory)
                .map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewVehicle(prev => ({ ...prev, imageUrl: item.url }));
                      setShowImageLibrary(false);
                    }}
                    className={`group flex flex-col text-left border rounded-2xl overflow-hidden hover:border-amber-500/80 active:scale-[0.98] transition duration-200 bg-zinc-900/10 ${
                      newVehicle.imageUrl === item.url 
                        ? 'border-amber-500 ring-2 ring-amber-500/20' 
                        : 'border-zinc-900'
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-zinc-950/80 backdrop-blur-sm border border-zinc-900 text-[8px] font-mono uppercase text-amber-500 px-1.5 py-0.5 rounded">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-900/30 flex-1 flex flex-col justify-between">
                      <h5 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-amber-400 transition">
                        {item.name}
                      </h5>
                      <span className="text-[9px] text-zinc-550 mt-1.5 font-mono line-clamp-1 truncate block">
                        {item.url}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImageLibrary(false)}
                className="bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition active:scale-95 border border-zinc-850"
              >
                Close Presets Picker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
