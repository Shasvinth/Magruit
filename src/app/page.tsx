'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { FaGamepad, FaUser, FaStar, FaMagic, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setIsMounted] = useState(false);
  
  // Floating fruit animation
  const floatingFruits = [
    '🍎', '🍌', '🍒', '🍇', '🍋', '🍊', '🍑', '🍓', '🥝', 
    '🍏', '🍍', '🥭', '🍈', '🍉', '🍐', '🥥'
  ];

  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-indigo-50 to-purple-100 relative overflow-hidden">
        {/* Animated floating fruits */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingFruits.map((fruit, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl sm:text-4xl opacity-20"
              initial={{ 
                x: Math.random() * 100 - 50, 
                y: -20,
                rotate: 0
              }}
              animate={{ 
                y: window.innerHeight,
                x: Math.random() * 100 - 50 + (i * 100),
                rotate: 360
              }}
              transition={{ 
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {fruit}
            </motion.div>
          ))}
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <motion.div 
            className="max-w-4xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-shadow-sm">
              <span className="inline-block animate-bounce delay-100">M</span>
              <span className="inline-block animate-bounce delay-150">a</span>
              <span className="inline-block animate-bounce delay-200">g</span>
              <span className="inline-block animate-bounce delay-250">R</span>
              <span className="inline-block animate-bounce delay-300">u</span>
              <span className="inline-block animate-bounce delay-350">i</span>
              <span className="inline-block animate-bounce delay-400">t</span>
            </h1>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Match three identical fruits in a row, column, or diagonal to win amazing prizes! 🎮 🎲 🎯
            </motion.p>
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => router.push('/game')}
                  variant="fun"
                  className="text-xl py-4 px-8"
                >
                  Play Now!
                </Button>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    onClick={() => router.push('/login')}
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => router.push('/register')}
                    className="border-white text-white hover:bg-indigo-700"
                  >
                    Register
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-gray-900 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="relative inline-block">
                How To Play
                <span className="absolute -top-6 -right-6 text-yellow-400 text-xl">
                  <FaStar className="animate-pulse"/>
                </span>
                <span className="absolute -bottom-6 -left-6 text-yellow-400 text-xl">
                  <FaStar className="animate-pulse delay-300"/>
                </span>
              </span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-blue-500 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Create Your Profile</h3>
                <p className="text-gray-600">
                  Sign up with your email and password to start your fruit matching adventure!
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGamepad className="text-purple-500 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Spin the Fruits</h3>
                <p className="text-gray-600">
                  Each day, spin the magical fruit wheel and see what combinations you get!
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-green-500 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Win Prizes</h3>
                <p className="text-gray-600">
                  Match 3 identical fruits in a row, column, or diagonal to win exciting prizes!
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/dots.svg')] opacity-10"></div>
          <motion.div 
            className="max-w-4xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready for Some Fruity Fun?</h2>
            <p className="text-xl mb-8 text-gray-700">
              Join thousands of players and see if you can match three fruits in a row!
            </p>
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => router.push('/game')}
                  variant="fun"
                >
                  Play Now!
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => router.push('/register')}
                  variant="fun"
                >
                  Start Playing!
                </Button>
              </motion.div>
            )}
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <FaStar className="mr-1" /> Fun for Kids
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <FaMagic className="mr-1" /> New Fruits Daily
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <FaTrophy className="mr-1" /> Win Prizes
              </span>
        </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
