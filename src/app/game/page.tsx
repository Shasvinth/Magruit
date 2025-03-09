'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { playGame } from '../../lib/game';
import { hasUserPlayedToday } from '../../lib/db';
import GameGrid from '../../components/GameGrid';
import { motion } from 'framer-motion';
import { FaStar, FaDice, FaGamepad, FaHistory } from 'react-icons/fa';

export default function Game() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'game' | 'rules'>('game');
  
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Check if user is authenticated and can play
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!loading) {
        if (!user) {
          router.push('/login');
          return;
        }
        
        try {
          const hasPlayed = await hasUserPlayedToday(user.uid);
          setCanPlay(!hasPlayed);
          setIsLoading(false);
        } catch (error) {
          console.error('Error checking play status:', error);
          setIsLoading(false);
        }
      }
    };
    
    checkUserStatus();
  }, [user, loading, router]);
  
  // Initialize empty grid
  useEffect(() => {
    setGrid([
      ['❓', '❓', '❓'],
      ['❓', '❓', '❓'],
      ['❓', '❓', '❓']
    ]);
  }, []);
  
  const handleSpin = async () => {
    if (!user || !canPlay) return;
    
    setIsSpinning(true);
    
    try {
      // Simulate spinning animation for 2 seconds
      setTimeout(async () => {
        const result = await playGame(user.uid, user.email || '');
        setGrid(result.grid);
        setMatches(result.matches);
        setCanPlay(false);
        setIsSpinning(false);
      }, 2000);
    } catch (error) {
      console.error('Error playing game:', error);
      setIsSpinning(false);
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-100 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="mt-6 text-lg text-indigo-700 font-medium">Loading your fruity adventure...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-2 px-4 bg-gradient-to-b from-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 text-4xl text-yellow-400 opacity-20"
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaStar />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 right-10 text-4xl text-pink-400 opacity-20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaDice />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 text-4xl text-indigo-400 opacity-20"
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaGamepad />
        </motion.div>
      </div>

      <div className="max-w-md mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          MagRuit
        </motion.h1>

        {/* Mode switcher for mobile */}
        <div className="flex bg-white rounded-full p-1 shadow-md mb-6">
          <button
            onClick={() => setViewMode('game')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'game' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Game
          </button>
          <button
            onClick={() => setViewMode('rules')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'rules' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            How to Play
          </button>
        </div>
        
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            height: viewMode === 'game' ? 'auto' : '0',
            display: viewMode === 'game' ? 'block' : 'none'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          {!canPlay && matches.length === 0 && !isSpinning && (
            <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-xl border-l-4 border-yellow-500">
              <p className="font-bold text-lg mb-1">You've already played today!</p>
              <p>Come back tomorrow for another chance to win amazing prizes!</p>
            </div>
          )}
          
          <GameGrid 
            grid={grid}
            isSpinning={isSpinning}
            matches={matches}
            onSpin={handleSpin}
            canPlay={canPlay}
          />
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            height: viewMode === 'rules' ? 'auto' : '0',
            display: viewMode === 'rules' ? 'block' : 'none'
          }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <FaHistory className="mr-2 text-indigo-500" /> How to Play
          </h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-2xl">🎮</span>
              <span>Spin the fruit grid once per day for your chance to win!</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-2xl">🍓</span>
              <span>Match 3 identical fruits in a row, column, or diagonal to win!</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-2xl">🔄</span>
              <span>Each player gets one chance per day - use it wisely!</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-2xl">🌟</span>
              <span>Come back tomorrow for another chance to hit the jackpot!</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
} 