export interface Vehicle {
  id: string;
  name: string;
  category: 'E-Loader' | 'E-Rickshaw' | 'Food Van' | 'Ice Cream Van' | 'Battery';
  price: string;
  range: string;
  batteryType: string;
  chargingTime: string;
  capacity: string;
  warranty: string;
  imageUrl: string;
  featured: boolean;
  status: 'In Stock' | 'Available' | 'Special Order' | 'Out of Stock';
  features: string[];
  motorType: string;
}

export interface Enquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  vehicleInterest: string;
  requirementType: 'Purchase Enquiry' | 'Service Booking' | 'Parts Enquiry' | 'General Question';
  preferredContact: 'Call' | 'WhatsApp' | 'Email';
  message: string;
  sourcePage: string;
  createdDate: string;
  status: 'New' | 'Contacted' | 'Follow-up' | 'Closed';
  adminNotes?: string;
}

const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'ev-2',
    name: 'Garud Cargo Loader 750',
    category: 'E-Loader',
    price: '₹1,45,000',
    range: '90-100 km',
    batteryType: '60V 120Ah Tubular Lead-Acid',
    chargingTime: '7-8 Hours Standard Charge',
    capacity: '750 kg Payload Limit',
    warranty: '1 Year Full Pack Warranty',
    imageUrl: 'https://picsum.photos/seed/eloader/600/400',
    featured: true,
    status: 'In Stock',
    features: ['Reinforced Dual Suspensions', 'High-Torque Climbing Gear', 'Heavy Duty Sheet Metal Bed', 'Odisha RTO Load Certification'],
    motorType: '1000W High-Torque Brushless DC Motor'
  },
  {
    id: 'ev-3',
    name: 'Garud Passenger E-Rickshaw',
    category: 'E-Rickshaw',
    price: '₹1,65,000',
    range: '110-120 km',
    batteryType: '60V 100Ah Smart Lithium Battery',
    chargingTime: '4 Hours Smart Charging',
    capacity: '5 Passengers + 1 Driver',
    warranty: '3 Years Mechanical & Electrical',
    imageUrl: 'https://picsum.photos/seed/erickshaw/600/400',
    featured: true,
    status: 'Available',
    features: ['Waterproof Fabric Canopy', 'Dual Tone Soft Cushioned Seats', 'Smart Digital Cabin Cluster', 'Under-Seat Security Storage'],
    motorType: '1200W Waterproof Brushless DC Motor'
  },
  {
    id: 'ev-4',
    name: 'Garud Mobile Food Van',
    category: 'Food Van',
    price: '₹1,95,000',
    range: '80 km per Charge',
    batteryType: '60V 80Ah Lithium-Ion Battery',
    chargingTime: '3.5 Hours Fast Charge',
    capacity: '500 kg Flatbed Load',
    warranty: '2 Years Power Train',
    imageUrl: 'https://picsum.photos/seed/foodvan/600/400',
    featured: false,
    status: 'Special Order',
    features: ['Built-in 220V Inverter Port', 'Stainless Steel Dual Sinks', 'Extended Drop-down Shelf Tops', 'Full Overhead Dust Shields'],
    motorType: '1200W BLDC Geared Drive Motor'
  },
  {
    id: 'ev-5',
    name: 'Garud Polar Ice-Cream Dispenser',
    category: 'Ice Cream Van',
    price: '₹2,10,000',
    range: '85-90 km per Charge',
    batteryType: '60V 100Ah Lithium Battery Unit',
    chargingTime: '4.5 Hours',
    capacity: '450 kg Freezer Weight',
    warranty: '2 Years Structural Chassis',
    imageUrl: 'https://picsum.photos/seed/icecream/600/400',
    featured: false,
    status: 'Special Order',
    features: ['Direct DC Smart Freezer System', 'Colorful Built-in Music Player', 'Dynamic Multi-Color LED strip', 'Lockable Canopy Panels'],
    motorType: '1000W Direct-Drive BLDC Motor'
  },
  {
    id: 'ev-6',
    name: 'Garud Premium Lithium Battery Pack',
    category: 'Battery',
    price: '₹65,000',
    range: 'Up to 125 km (on single motor)',
    batteryType: '60V 100Ah Grade-A Active Lithium Cells',
    chargingTime: '3.5 Hours Balanced',
    capacity: 'Standard E-Rickshaw Casing Fit',
    warranty: '3 Years Full Replacement Warranty',
    imageUrl: 'https://picsum.photos/seed/battery/600/400',
    featured: false,
    status: 'In Stock',
    features: ['Integrated Smart BMS Board', 'Flame-Retardant Metal Shell', 'IP67 dust and water rating', 'High Precision Cell Balancing'],
    motorType: 'N/A (Battery Pack Unit)'
  }
];

const SEED_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    fullName: 'Ramesh Chandra Patnaik',
    phone: '9861023456',
    email: 'ramesh.patnaik@gmail.com',
    vehicleInterest: 'Garud Passenger E-Rickshaw',
    requirementType: 'Purchase Enquiry',
    preferredContact: 'Call',
    message: 'Interested in buying two E-Rickshaws for Brahmapur town operations. Do you offer financing options or government trade subsidies?',
    sourcePage: 'Home Showcase Form',
    createdDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    status: 'New',
    adminNotes: ''
  },
  {
    id: 'enq-102',
    fullName: 'Kunal Kumar Mohanty',
    phone: '8249051122',
    email: 'kunal.mohanty@live.com',
    vehicleInterest: 'Garud Cargo Loader 750',
    requirementType: 'Purchase Enquiry',
    preferredContact: 'WhatsApp',
    message: 'Need cargo vehicle to carry wholesale grocery goods from main market to local shops. Is the cargo bed steel insulated?',
    sourcePage: 'Contact page form /contact',
    createdDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'Contacted',
    adminNotes: 'Spoke on June 7th. Provided price quotations. Lead is discussing financing options with local bank.'
  }
];

function isClient() {
  return typeof window !== 'undefined';
}

export function getVehicles(): Vehicle[] {
  if (!isClient()) return SEED_VEHICLES;
  
  const saved = localStorage.getItem('garuda_vehicles');
  if (!saved) {
    localStorage.setItem('garuda_vehicles', JSON.stringify(SEED_VEHICLES));
    return SEED_VEHICLES;
  }
  try {
    const list = JSON.parse(saved);
    // Backward compatibility merge: ensure motorType and other properties are standard
    return list.map((vehicle: any) => {
      const defaultMatch = SEED_VEHICLES.find(s => s.id === vehicle.id);
      return {
        motorType: defaultMatch ? defaultMatch.motorType : '1200W High Torque Brushless DC Motor',
        ...vehicle
      };
    });
  } catch (e) {
    return SEED_VEHICLES;
  }
}

export function saveVehicle(vehicle: Vehicle): Vehicle[] {
  if (!isClient()) return SEED_VEHICLES;
  
  const current = getVehicles();
  const idx = current.findIndex(v => v.id === vehicle.id);
  if (idx > -1) {
    current[idx] = vehicle;
  } else {
    current.push(vehicle);
  }
  localStorage.setItem('garuda_vehicles', JSON.stringify(current));
  return current;
}

export function deleteVehicle(id: string): Vehicle[] {
  if (!isClient()) return SEED_VEHICLES;
  
  const current = getVehicles();
  const filtered = current.filter(v => v.id !== id);
  localStorage.setItem('garuda_vehicles', JSON.stringify(filtered));
  return filtered;
}

export function getEnquiries(): Enquiry[] {
  if (!isClient()) return SEED_ENQUIRIES;
  
  const saved = localStorage.getItem('garuda_enquiries');
  if (!saved) {
    localStorage.setItem('garuda_enquiries', JSON.stringify(SEED_ENQUIRIES));
    return SEED_ENQUIRIES;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return SEED_ENQUIRIES;
  }
}

export function saveEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdDate' | 'status'> & { id?: string; createdDate?: string; status?: Enquiry['status'] }): Enquiry[] {
  if (!isClient()) return SEED_ENQUIRIES;
  
  const current = getEnquiries();
  const fullEnquiry: Enquiry = {
    id: enquiry.id || 'enq-' + Math.random().toString(36).substr(2, 9),
    fullName: enquiry.fullName,
    phone: enquiry.phone,
    email: enquiry.email,
    vehicleInterest: enquiry.vehicleInterest,
    requirementType: enquiry.requirementType,
    preferredContact: enquiry.preferredContact,
    message: enquiry.message,
    sourcePage: enquiry.sourcePage || 'Showroom Action',
    createdDate: enquiry.createdDate || new Date().toISOString(),
    status: enquiry.status || 'New',
    adminNotes: enquiry.adminNotes || ''
  };

  const idx = current.findIndex(e => e.id === fullEnquiry.id);
  if (idx > -1) {
    current[idx] = fullEnquiry;
  } else {
    current.unshift(fullEnquiry);
  }
  localStorage.setItem('garuda_enquiries', JSON.stringify(current));
  return current;
}

export function deleteEnquiry(id: string): Enquiry[] {
  if (!isClient()) return SEED_ENQUIRIES;
  
  const current = getEnquiries();
  const filtered = current.filter(e => e.id !== id);
  localStorage.setItem('garuda_enquiries', JSON.stringify(filtered));
  return filtered;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  vehicleModel: string;
  rating: number;
  comment: string;
  createdDate: string;
  verified: boolean;
}

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Sarita Panda',
    role: 'EV Auto Fleet Operator',
    vehicleModel: 'Garud Passenger E-Rickshaw',
    rating: 5,
    comment: 'The smart Lithium battery in our Garud Rickshaw is giving an amazing mileage of 115km on a single overnight charge. Best passenger vehicle in Brahmapur hands down!',
    createdDate: '2026-05-15T10:30:00.000Z',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Siba Narayan Panda',
    role: 'Wholesale Grocery Vendor',
    vehicleModel: 'Garud Cargo Loader 750',
    rating: 5,
    comment: 'We haul up to 750 kg of raw grains and grocery packages daily from the Sundar Nagar cold warehouse to Bijipur retail shops. Extremely solid steel bed and heavy leaf springs.',
    createdDate: '2026-05-28T14:15:00.000Z',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Subhasree Mohanty',
    role: 'Food Stall Owner',
    vehicleModel: 'Garud Mobile Food Van',
    rating: 5,
    comment: 'Having a built-in high power inverter makes running our heating appliances and display lights exceptionally simple. Performance is incredibly smooth on Brahmapur highway!',
    createdDate: '2026-06-01T08:45:00.000Z',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Debasish Pradhan',
    role: 'Commercial Fleet Manager',
    vehicleModel: 'Garud Passenger E-Rickshaw',
    rating: 4,
    comment: 'Excellent passenger cushion comfort. Our recurring maintenance expenses have come down by almost 85% compared to our older diesel units.',
    createdDate: '2026-06-05T11:20:00.000Z',
    verified: true
  }
];

export function getReviews(): Review[] {
  if (!isClient()) return SEED_REVIEWS;
  const saved = localStorage.getItem('garuda_reviews');
  if (!saved) {
    localStorage.setItem('garuda_reviews', JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return SEED_REVIEWS;
  }
}

export function saveReview(review: Review): Review[] {
  if (!isClient()) return SEED_REVIEWS;
  const current = getReviews();
  const idx = current.findIndex(r => r.id === review.id);
  if (idx > -1) {
    current[idx] = review;
  } else {
    current.unshift(review);
  }
  localStorage.setItem('garuda_reviews', JSON.stringify(current));
  return current;
}

export function deleteReview(id: string): Review[] {
  if (!isClient()) return SEED_REVIEWS;
  const current = getReviews();
  const filtered = current.filter(r => r.id !== id);
  localStorage.setItem('garuda_reviews', JSON.stringify(filtered));
  return filtered;
}
