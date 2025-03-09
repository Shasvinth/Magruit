'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import PwaInstallPrompt from './PwaInstallPrompt';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPwa, setIsPwa] = useState(false);
  
  // Fix hydration issues and detect PWA
  useEffect(() => {
    setIsMounted(true);
    
    // Check if the app is running in standalone mode (PWA installed)
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as { standalone?: boolean }).standalone ||
                          document.referrer.includes('android-app://');
      setIsPwa(isStandalone);
                          
      // Add class to body for PWA-specific styling
      if (isStandalone) {
        document.body.classList.add('pwa-mode');
      } else {
        document.body.classList.remove('pwa-mode');
      }
      
      // Add mobile class for mobile-specific styling
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.body.classList.add('is-mobile');
      } else {
        document.body.classList.remove('is-mobile');
      }
    }
  }, []);
  
  if (!isMounted) {
    return null;
  }

  return (
    <div className="scroll-container">
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className={`flex-grow ${isPwa ? 'pt-2 pb-20' : 'pt-0 pb-0'} px-0`}>
          {children}
        </main>
        {isPwa && <BottomNav />}
        <PwaInstallPrompt />
      </div>
    </div>
  );
} 