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
  deleteReview,
  VehicleColor
} from '@/lib/store';
import { 
  Lock, 
  Mail, 
  Phone, 
  Trash2, 
  Plus, 
  AlertCircle, 
  Archive, 
  Sliders, 
  Sparkles,
  BookOpenCheck,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  FolderOpen,
  Image as ImageIcon,
  X,
  Pencil,
  Palette
} from 'lucide-react';

const AVAILABLE_COLORS: VehicleColor[] = [
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Golden Yellow', hex: '#EAB308' },
  { name: 'Signal Red', hex: '#DC2626' },
  { name: 'Sunset Orange', hex: '#EA580C' },
  { name: 'Sky Blue', hex: '#0284C7' },
  { name: 'Cyan Ocean', hex: '#06B6D4' },
  { name: 'Pastel Pink', hex: '#EC4899' },
  { name: 'Glossy Black', hex: '#18181B' },
  { name: 'Snow White', hex: '#F8FAFC' },
];

const VEHICLE_IMAGE_LIBRARY = [
  {
    name: 'Garud Royal Blue Cargo Loader 750 (Heavy Duty)',
    category: 'E-Loader',
    color: 'Royal Blue',
    url: '/vehicles/cargo_loader_blue.jpg',
  },
  {
    name: 'Industrial Heavy Duty Hauler (Signal Red)',
    category: 'E-Loader',
    color: 'Signal Red',
    url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Commercial Heavy Loader (Vibrant Yellow)',
    category: 'E-Loader',
    color: 'Golden Yellow',
    url: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Garud Passenger E-Rickshaw (Emerald Green & Gold)',
    category: 'E-Rickshaw',
    color: 'Emerald Green',
    url: '/vehicles/erickshaw_passenger.jpg',
  },
  {
    name: 'Classic Yellow Cab E-Rickshaw Passenger Toto',
    category: 'E-Rickshaw',
    color: 'Golden Yellow',
    url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Urban Electric Trike (Electric Blue)',
    category: 'E-Rickshaw',
    color: 'Sky Blue',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Garud Mobile Food Van (Flame Red & Yellow)',
    category: 'Food Van',
    color: 'Flame Red',
    url: '/vehicles/ev_food_van.jpg',
  },
  {
    name: 'Mobile Street Delights Snack Van (Bright Yellow)',
    category: 'Food Van',
    color: 'Sunflower Yellow',
    url: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Garud Polar Ice-Cream Dispenser (Cyan & Pastel Pink)',
    category: 'Ice Cream Van',
    color: 'Cyan Ocean',
    url: '/vehicles/ev_icecream_van.jpg',
  },
  {
    name: 'Mobile Gelato Parlor Cart (Pastel Blue)',
    category: 'Ice Cream Van',
    color: 'Pastel Blue',
    url: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Garud 60V Smart Lithium Battery Unit (Cyan BMS Display)',
    category: 'Battery',
    color: 'Electric Blue',
    url: '/vehicles/ev_lithium_pack.jpg',
  },
  {
    name: 'High Capacity Active Lithium Cell Pack',
    category: 'Battery',
    color: 'Titanium Grey',
    url: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=800&auto=format&fit=crop&q=80',
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
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [imageTarget, setImageTarget] = useState<'new' | 'edit'>('new');

  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id' | 'featured'>>({
    name: '',
    category: 'E-Loader',
    price: '₹1,45,000',
    range: '90-100 km',
    batteryType: '60V Lithium Cells',
    chargingTime: '4 Hours',
    capacity: '750 kg',
    warranty: '3 Years Cells',
    imageUrl: '/vehicles/cargo_loader_blue.jpg',
    status: 'In Stock',
    features: ['LED Projection Lamp', 'Regenerative Braking'],
    motorType: '1200W Waterproof Brushless DC Motor',
    colors: [
      { name: 'Royal Blue', hex: '#1D4ED8' },
      { name: 'Sunset Orange', hex: '#EA580C' }
    ]
  });

  // Image Library state managers
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<'All' | Vehicle['category']>('All');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  // Active editing notes state
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  // Custom Color Add Bar state
  const [customColorNameNew, setCustomColorNameNew] = useState('');
  const [customColorHexNew, setCustomColorHexNew] = useState('#1D4ED8');

  const [customColorNameEdit, setCustomColorNameEdit] = useState('');
  const [customColorHexEdit, setCustomColorHexEdit] = useState('#1D4ED8');

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
    } catch {
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
      price: '₹1,45,000',
      range: '90-100 km',
      batteryType: '60V Lithium Cells',
      chargingTime: '4 Hours',
      capacity: '750 kg',
      warranty: '3 Years Cells',
      imageUrl: '/vehicles/cargo_loader_blue.jpg',
      status: 'In Stock',
      features: ['LED Projection Lamp', 'Regenerative Braking'],
      motorType: '1200W Waterproof Brushless DC Motor',
      colors: [
        { name: 'Royal Blue', hex: '#1D4ED8' },
        { name: 'Sunset Orange', hex: '#EA580C' }
      ]
    });
  };

  const handleEditVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    const updated = saveVehicle(editingVehicle);
    setVehicles(updated);
    setEditingVehicle(null);
  };

  const handleAddCustomColorNew = () => {
    const trimmed = customColorNameNew.trim();
    if (!trimmed) return;
    const current = newVehicle.colors || [];
    const existsIndex = current.findIndex(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existsIndex >= 0) {
      setNewVehicle(prev => ({
        ...prev,
        colors: (prev.colors || []).map((c, i) => i === existsIndex ? { ...c, hex: customColorHexNew } : c)
      }));
    } else {
      setNewVehicle(prev => ({
        ...prev,
        colors: [...(prev.colors || []), { name: trimmed, hex: customColorHexNew }]
      }));
    }
    setCustomColorNameNew('');
  };

  const handleRemoveNewVehicleColor = (colorName: string) => {
    setNewVehicle(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c.name !== colorName)
    }));
  };

  const handleAddCustomColorEdit = () => {
    const trimmed = customColorNameEdit.trim();
    if (!trimmed || !editingVehicle) return;
    const current = editingVehicle.colors || [];
    const existsIndex = current.findIndex(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existsIndex >= 0) {
      setEditingVehicle(prev => prev ? ({
        ...prev,
        colors: (prev.colors || []).map((c, i) => i === existsIndex ? { ...c, hex: customColorHexEdit } : c)
      }) : null);
    } else {
      setEditingVehicle(prev => prev ? ({
        ...prev,
        colors: [...(prev.colors || []), { name: trimmed, hex: customColorHexEdit }]
      }) : null);
    }
    setCustomColorNameEdit('');
  };

  const handleRemoveEditingVehicleColor = (colorName: string) => {
    if (!editingVehicle) return;
    setEditingVehicle(prev => prev ? ({
      ...prev,
      colors: (prev.colors || []).filter(c => c.name !== colorName)
    }) : null);
  };

  const toggleNewVehicleColor = (col: VehicleColor) => {
    const current = newVehicle.colors || [];
    const exists = current.some(c => c.name === col.name);
    if (exists) {
      setNewVehicle(prev => ({
        ...prev,
        colors: current.filter(c => c.name !== col.name)
      }));
    } else {
      setNewVehicle(prev => ({
        ...prev,
        colors: [...current, col]
      }));
    }
  };

  const toggleEditingVehicleColor = (col: VehicleColor) => {
    if (!editingVehicle) return;
    const current = editingVehicle.colors || [];
    const exists = current.some(c => c.name === col.name);
    if (exists) {
      setEditingVehicle(prev => prev ? ({
        ...prev,
        colors: current.filter(c => c.name !== col.name)
      }) : null);
    } else {
      setEditingVehicle(prev => prev ? ({
        ...prev,
        colors: [...current, col]
      }) : null);
    }
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit' = 'new') => {
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
             const result = reader.result as string;
             if (target === 'new') {
               setNewVehicle(prevVeh => ({
                 ...prevVeh,
                 imageUrl: result
               }));
             } else {
               setEditingVehicle(prevVeh => prevVeh ? ({
                 ...prevVeh,
                 imageUrl: result
               }) : null);
             }
             setUploadProgress(null);
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 30;
      });
    }, 120);
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

                  {/* Color Customization Palette with Custom Add Bar */}
                  <div className="col-span-1 md:col-span-3 bg-zinc-900/25 border border-zinc-900 p-4 sm:p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-zinc-200 text-xs font-bold uppercase font-mono tracking-wider flex items-center gap-1.5">
                          <Palette className="w-4 h-4 text-amber-500" />
                          Vehicle Colorways & Named Options
                        </label>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Configure customer-selectable colors for this model. You can type any custom name using the Add Bar below.
                        </p>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 rounded font-mono">
                        {(newVehicle.colors || []).length} active
                      </span>
                    </div>

                    {/* Active assigned colors chips */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold tracking-wider block">
                        Assigned Colors for this Model:
                      </span>
                      <div className="flex flex-wrap items-center gap-2 min-h-[38px] p-2.5 bg-zinc-950/90 rounded-xl border border-zinc-850">
                        {(!newVehicle.colors || newVehicle.colors.length === 0) ? (
                          <span className="text-xs text-zinc-500 italic px-1">
                            No colors assigned yet. Use the Color Add Bar below to name and add colorways.
                          </span>
                        ) : (
                          newVehicle.colors.map((col, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-1.5 rounded-xl group hover:border-amber-500/60 transition shadow-sm"
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/50 shrink-0 shadow"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span className="font-semibold text-zinc-200">{col.name}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">({col.hex})</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveNewVehicleColor(col.name)}
                                className="text-zinc-500 hover:text-red-400 hover:bg-zinc-800 p-1 rounded-md transition cursor-pointer ml-1"
                                title={`Remove ${col.name}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* DEDICATED ADD BAR TO NAME AND PICK CUSTOM COLOR */}
                    <div className="space-y-2 pt-1 border-t border-zinc-900">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          Color Add Bar — Type Name & Pick Shade
                        </label>
                        <span className="text-[10px] text-zinc-500 font-mono">Press Enter or click Add Color</span>
                      </div>

                      <div className="bg-zinc-950 border-2 border-amber-500/40 focus-within:border-amber-500 p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center gap-2.5 transition shadow-lg">
                        {/* Native Color Picker swatch + HEX code */}
                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                          <input
                            type="color"
                            value={customColorHexNew}
                            onChange={(e) => setCustomColorHexNew(e.target.value)}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-zinc-700 bg-transparent p-0"
                            title="Click to choose custom shade"
                          />
                          <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wide">
                            {customColorHexNew}
                          </span>
                        </div>

                        {/* Name Input field */}
                        <input
                          type="text"
                          value={customColorNameNew}
                          onChange={(e) => setCustomColorNameNew(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomColorNew();
                            }
                          }}
                          placeholder="Type custom color name (e.g. Matte Jet Black, Sea Green, Metallic Cyan)..."
                          className="flex-1 w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none placeholder:text-zinc-500"
                        />

                        {/* Add Button */}
                        <button
                          type="button"
                          onClick={handleAddCustomColorNew}
                          disabled={!customColorNameNew.trim()}
                          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow active:scale-95 font-mono"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Add Color</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick presets row */}
                    <div className="pt-1">
                      <span className="text-[10px] text-zinc-500 font-mono block mb-1.5">
                        Quick Preset Swatches (click to fill name & shade):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_COLORS.map((col) => {
                          const isSelected = (newVehicle.colors || []).some(c => c.name.toLowerCase() === col.name.toLowerCase());
                          return (
                            <button
                              key={col.name}
                              type="button"
                              onClick={() => {
                                setCustomColorNameNew(col.name);
                                setCustomColorHexNew(col.hex);
                                toggleNewVehicleColor(col);
                              }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                                isSelected
                                  ? 'bg-zinc-800 border-amber-500 text-amber-300 shadow-sm'
                                  : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                              }`}
                              title={`Click to toggle or prefill ${col.name}`}
                            >
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-black/40 shrink-0" 
                                style={{ backgroundColor: col.hex }} 
                              />
                              <span>{col.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
                            <span className="text-[10px] text-zinc-400 font-mono">Full Color</span>
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
                              setImageTarget('new');
                              setSelectedLibraryCategory(newVehicle.category);
                              setShowImageLibrary(true);
                            }}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-500 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            Browse Colorful Presets
                          </button>

                          {/* Upload Local File Button */}
                          <label className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95">
                            <Upload className="w-3.5 h-3.5" />
                            Load Colorful Image File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLocalImageUpload(e, 'new')}
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
                          IMAGE URL
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
                        <th className="p-4 sm:p-5 font-bold">Photo</th>
                        <th className="p-4 sm:p-5 font-bold">Model Plate</th>
                        <th className="p-4 sm:p-5 font-bold">Category & Colors</th>
                        <th className="p-4 sm:p-5 font-bold">Price</th>
                        <th className="p-4 sm:p-5 font-bold">Drive specs</th>
                        <th className="p-4 sm:p-5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 font-sans">
                      {vehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-zinc-900/30 transition">
                          <td className="p-4 sm:p-5">
                            <div className="w-16 h-11 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 relative shadow-sm">
                              <img
                                src={v.imageUrl}
                                alt={v.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 font-bold text-white">
                            <div>{v.name}</div>
                            <span className="text-[10px] text-zinc-500 font-mono font-normal">ID: {v.id}</span>
                          </td>
                          <td className="p-4 sm:p-5 space-y-1.5">
                            <span className="bg-zinc-900 border border-zinc-800 text-[9px] text-amber-400 font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                              {v.category}
                            </span>
                            {/* Color swatches preview */}
                            {v.colors && v.colors.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                {v.colors.map((c, i) => (
                                  <span
                                    key={i}
                                    title={c.name}
                                    className="w-2.5 h-2.5 rounded-full border border-black/50 shrink-0"
                                    style={{ backgroundColor: c.hex }}
                                  />
                                ))}
                                <span className="text-[9px] text-zinc-500 font-mono">{v.colors.length} colors</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 sm:p-5 font-mono text-amber-500 font-bold">{v.price}</td>
                          <td className="p-4 sm:p-5 text-xs text-zinc-500">
                            <div>Range: {v.range}</div>
                            <div className="line-clamp-1">Battery: {v.batteryType}</div>
                            <div className="line-clamp-1 text-amber-500/80 font-mono text-[10px]">Motor: {v.motorType || '1200W Heavy Duty BLDC'}</div>
                          </td>
                          <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingVehicle({ ...v });
                              }}
                              className="text-amber-400 hover:text-amber-300 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition cursor-pointer px-2.5 py-1.5 rounded-lg text-xs font-semibold mr-2 inline-flex items-center gap-1"
                              title="Edit specifications and colorful image"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit & Image</span>
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="text-zinc-600 hover:text-red-500 transition cursor-pointer p-1.5 inline-block"
                              title="Delete model"
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

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingVehicle(null)}
              className="absolute right-6 top-6 text-zinc-500 hover:text-white transition cursor-pointer p-1.5 hover:bg-zinc-900 rounded-full flex items-center justify-center"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-900 pb-4 mb-6">
              <span className="text-amber-500 text-xs font-mono font-bold uppercase tracking-wider">Vehicle Management</span>
              <h3 className="text-xl font-extrabold text-white">Edit Model & Colorful Image</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Update details, load vivid colorful vehicle photos, or customize available body colors for {editingVehicle.name}.
              </p>
            </div>

            <form onSubmit={handleEditVehicleSubmit} className="space-y-6">
              {/* Image Loading Box */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 relative shrink-0 shadow-md">
                  <img
                    src={editingVehicle.imageUrl}
                    alt={editingVehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300">
                    Live Photo
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="text-zinc-300 text-xs font-bold font-mono uppercase tracking-wider">
                      Vehicle Photo Link
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImageTarget('edit');
                          setSelectedLibraryCategory(editingVehicle.category);
                          setShowImageLibrary(true);
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        Choose Preset
                      </button>

                      <label className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        Load Colorful Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLocalImageUpload(e, 'edit')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    value={editingVehicle.imageUrl}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, imageUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="Enter image URL..."
                  />

                  {uploadProgress !== null && (
                    <div className="space-y-1 animate-pulse">
                      <div className="flex justify-between text-[10px] font-mono text-amber-500">
                        <span>Uploading colorful media...</span>
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
                </div>
              </div>

              {/* Color Customization Palette with Custom Add Bar */}
              <div className="bg-zinc-900/25 border border-zinc-900 p-4 sm:p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-zinc-200 text-xs font-bold uppercase font-mono tracking-wider flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-amber-500" />
                      Vehicle Colorways & Named Options
                    </label>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Configure customer-selectable colors for this model. You can type any custom name using the Add Bar below.
                    </p>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 rounded font-mono">
                    {(editingVehicle.colors || []).length} active
                  </span>
                </div>

                {/* Active assigned colors chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold tracking-wider block">
                    Assigned Colors for this Model:
                  </span>
                  <div className="flex flex-wrap items-center gap-2 min-h-[38px] p-2.5 bg-zinc-950/90 rounded-xl border border-zinc-850">
                    {(!editingVehicle.colors || editingVehicle.colors.length === 0) ? (
                      <span className="text-xs text-zinc-500 italic px-1">
                        No colors assigned yet. Use the Color Add Bar below to name and add colorways.
                      </span>
                    ) : (
                      editingVehicle.colors.map((col, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-1.5 rounded-xl group hover:border-amber-500/60 transition shadow-sm"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/50 shrink-0 shadow"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className="font-semibold text-zinc-200">{col.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">({col.hex})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditingVehicleColor(col.name)}
                            className="text-zinc-500 hover:text-red-400 hover:bg-zinc-800 p-1 rounded-md transition cursor-pointer ml-1"
                            title={`Remove ${col.name}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* DEDICATED ADD BAR TO NAME AND PICK CUSTOM COLOR */}
                <div className="space-y-2 pt-1 border-t border-zinc-900">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Color Add Bar — Type Name & Pick Shade
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">Press Enter or click Add Color</span>
                  </div>

                  <div className="bg-zinc-950 border-2 border-amber-500/40 focus-within:border-amber-500 p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center gap-2.5 transition shadow-lg">
                    {/* Native Color Picker swatch + HEX code */}
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                      <input
                        type="color"
                        value={customColorHexEdit}
                        onChange={(e) => setCustomColorHexEdit(e.target.value)}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-zinc-700 bg-transparent p-0"
                        title="Click to choose custom shade"
                      />
                      <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wide">
                        {customColorHexEdit}
                      </span>
                    </div>

                    {/* Name Input field */}
                    <input
                      type="text"
                      value={customColorNameEdit}
                      onChange={(e) => setCustomColorNameEdit(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomColorEdit();
                        }
                      }}
                      placeholder="Type custom color name (e.g. Matte Jet Black, Sea Green, Metallic Cyan)..."
                      className="flex-1 w-full bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none placeholder:text-zinc-500"
                    />

                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={handleAddCustomColorEdit}
                      disabled={!customColorNameEdit.trim()}
                      className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow active:scale-95 font-mono"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Add Color</span>
                    </button>
                  </div>
                </div>

                {/* Quick presets row */}
                <div className="pt-1">
                  <span className="text-[10px] text-zinc-500 font-mono block mb-1.5">
                    Quick Preset Swatches (click to fill name & shade):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_COLORS.map((col) => {
                      const isSelected = (editingVehicle.colors || []).some(c => c.name.toLowerCase() === col.name.toLowerCase());
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => {
                            setCustomColorNameEdit(col.name);
                            setCustomColorHexEdit(col.hex);
                            toggleEditingVehicleColor(col);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-800 border-amber-500 text-amber-300 shadow-sm'
                              : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                          }`}
                          title={`Click to toggle or prefill ${col.name}`}
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/40 shrink-0" 
                            style={{ backgroundColor: col.hex }} 
                          />
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.name}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Price</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.price}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, price: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Drive Range</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.range}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, range: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Battery Type</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.batteryType}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, batteryType: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Motor Drive</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.motorType}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, motorType: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-1">Stock Status</label>
                  <select
                    value={editingVehicle.status}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value as Vehicle['status'] })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Available">Available</option>
                    <option value="Special Order">Special Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-zinc-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer font-mono"
                >
                  Save Vehicle & Images
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                .map((item, idx) => {
                  const isCurrent = imageTarget === 'new' 
                    ? newVehicle.imageUrl === item.url 
                    : editingVehicle?.imageUrl === item.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (imageTarget === 'new') {
                          setNewVehicle(prev => ({ ...prev, imageUrl: item.url }));
                        } else {
                          setEditingVehicle(prev => prev ? ({ ...prev, imageUrl: item.url }) : null);
                        }
                        setShowImageLibrary(false);
                      }}
                      className={`group flex flex-col text-left border rounded-2xl overflow-hidden hover:border-amber-500/80 active:scale-[0.98] transition duration-200 bg-zinc-900/10 ${
                        isCurrent
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
                  );
                })}
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
