'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EnquiryContextType {
  isOpen: boolean;
  selectedVehicle: string;
  openEnquiry: (vehicleName?: string) => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('General Question');

  const openEnquiry = (vehicleName?: string) => {
    setSelectedVehicle(vehicleName || 'General Question');
    setIsOpen(true);
  };

  const closeEnquiry = () => {
    setIsOpen(false);
    setSelectedVehicle('General Question');
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, selectedVehicle, openEnquiry, closeEnquiry }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}
