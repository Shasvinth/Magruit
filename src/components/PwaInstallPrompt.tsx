'use client';

import { useState, useEffect } from 'react';
import { FaDownload, FaTimes, FaApple, FaAndroid } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Define a type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  
  useEffect(() => {
    // Don't show if already in PWA mode
    const isStandalone = typeof window !== 'undefined' && 
      (window.matchMedia('(display-mode: standalone)').matches || 
       (window.navigator as { standalone?: boolean }).standalone);
      
    if (isStandalone) return;
    
    // Detect iOS
    const iOS = typeof navigator !== 'undefined' && 
                  /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                  !(window as { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);
    
    // Handle the beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };
    
    // Show the prompt after 3 seconds
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setShowPrompt(true);
      }
    }, 3000);
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // We've used the prompt, and can't use it again, discard it
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };
  
  const handleClose = () => {
    setShowPrompt(false);
    // Save to localStorage to avoid showing again in this session
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
  };
  
  if (!showPrompt || localStorage.getItem('pwa-install-prompt-dismissed')) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          className="pwa-install-prompt fixed z-[9999] bottom-6 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-96"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  {isIOS ? (
                    <FaApple className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <FaAndroid className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Install MagRuit</h3>
              </div>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Install our app for a better experience with faster loading and offline access!
            </p>
            
            {isIOS ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">To install on iOS:</p>
                <ol className="text-sm space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="flex-shrink-0 mr-2">1.</span>
                    Tap the share button at the bottom of the screen
                  </li>
                  <li className="flex items-center">
                    <span className="flex-shrink-0 mr-2">2.</span>
                    Scroll down and tap &quot;Add to Home Screen&quot;
                  </li>
                  <li className="flex items-center">
                    <span className="flex-shrink-0 mr-2">3.</span>
                    Tap &quot;Add&quot; in the top right
                  </li>
                </ol>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                disabled={!isInstallable}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <FaDownload className="mr-2" />
                Install App
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 