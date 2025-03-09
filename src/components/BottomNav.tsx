'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaGamepad, FaUser, FaSignInAlt, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          // Import dynamically to avoid circular dependencies
          const { isUserAdmin } = await import('../lib/db');
          const adminStatus = await isUserAdmin(user.uid);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };
    
    if (!loading && user) {
      checkAdminStatus();
    }
  }, [user, loading]);
  
  if (loading) return null;
  
  // Define nav items based on authentication status
  const navItems = user 
    ? [
        { path: '/', label: 'Home', icon: <FaHome size={20} /> },
        { path: '/game', label: 'Play', icon: <FaGamepad size={20} /> },
        { path: '/profile', label: 'Profile', icon: <FaUser size={20} /> },
        ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: <FaChartBar size={20} /> }] : []),
      ]
    : [
        { path: '/', label: 'Home', icon: <FaHome size={20} /> },
        { path: '/login', label: 'Login', icon: <FaSignInAlt size={20} /> },
      ];
      
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 pwa-bottom-nav">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className="flex flex-col items-center justify-center w-full h-full py-2"
            >
              <div className="relative flex flex-col items-center">
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1 w-1 h-1 rounded-full bg-indigo-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={`${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                <span className={`text-xs mt-1 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 