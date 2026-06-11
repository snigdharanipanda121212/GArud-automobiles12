import type { Metadata } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { EnquiryProvider } from '@/hooks/use-enquiry';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';

const sansFont = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Garud Automobiles | Premium Electric Vehicles Ganjam',
  description: 'Authorized Dealership for high-specification E-Scooters, Heavy Duty Cargo Loaders, E-Rickshaws and Commercial Food/Ice Cream Vans. Bijipur Main Rd, Sundar Nagar, Brahmapur, Odisha.',
  verification: {
    google: 'CrcPdaWrQNKrs-HHFI0mgGv4IejwNgeKVJ0JvIakGDI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
      <body className="bg-black text-zinc-300 font-sans min-h-screen flex flex-col antialiased">
        <EnquiryProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <EnquiryModal />
        </EnquiryProvider>
      </body>
    </html>
  );
}
