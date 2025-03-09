import { useEffect, useState, useCallback } from 'react';
import Button from './Button';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface GameGridProps {
  grid: string[][];
  isSpinning: boolean;
  matches: string[];
  onSpin: () => void;
  canPlay: boolean;
}

export default function GameGrid({ grid, isSpinning, matches, onSpin, canPlay }: GameGridProps) {
  const [animationGrid, setAnimationGrid] = useState<string[][]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  // Simulated haptic feedback for mobile - wrapped in useCallback
  const simulateHapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      if (isSpinning) {
        // Small vibration during spinning
        navigator.vibrate(10);
      } else if (matches.length > 0) {
        // Pattern vibration for win
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
    }
  }, [isSpinning, matches.length]);

  // Set up initial animation grid
  useEffect(() => {
    if (!isSpinning) {
      setAnimationGrid(grid);
      
      // Show win animation if there are matches
      if (matches.length > 0) {
        setShowWinAnimation(true);
        
        // Fire confetti for win celebration
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Vibrate on win
        if (matches.length > 0) {
          simulateHapticFeedback();
        }
        
        // Reset animation after 5 seconds
        const timer = setTimeout(() => {
          setShowWinAnimation(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } else {
      // Vibrate during spinning
      simulateHapticFeedback();
      
      // Random spinning animation
      const interval = setInterval(() => {
        const tempGrid = Array(3).fill(0).map(() => {
          return Array(3).fill(0).map(() => {
            const randomIndex = Math.floor(Math.random() * 9);
            const fruits = ['🍎', '🍌', '🍒', '🍇', '🍋', '🍊', '🍑', '🍓', '🥝'];
            return fruits[randomIndex];
          });
        });
        setAnimationGrid(tempGrid);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isSpinning, grid, matches, simulateHapticFeedback]);

  const getCellClassName = (row: number, col: number) => {
    let baseClass = 'flex items-center justify-center text-5xl sm:text-6xl bg-white rounded-xl shadow-lg p-5 transition-all duration-300 transform hover:scale-105 fruit-cell';
    
    // Apply highlight to winning cells
    if (showWinAnimation) {
      // Check rows
      if (matches.includes(`row-${row}`)) {
        baseClass += ' bg-gradient-to-r from-green-200 to-green-300 animate-pulse shadow-green-300';
      }
      
      // Check columns
      if (matches.includes(`col-${col}`)) {
        baseClass += ' bg-gradient-to-r from-green-200 to-green-300 animate-pulse shadow-green-300';
      }
      
      // Check diagonals
      if (matches.includes('diag-1') && row === col) {
        baseClass += ' bg-gradient-to-r from-green-200 to-green-300 animate-pulse shadow-green-300';
      }
      
      if (matches.includes('diag-2') && row === 2 - col) {
        baseClass += ' bg-gradient-to-r from-green-200 to-green-300 animate-pulse shadow-green-300';
      }
    }
    
    return baseClass;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
        {animationGrid.map((row, rowIndex) => 
          row.map((fruit, colIndex) => (
            <motion.div 
              key={`${rowIndex}-${colIndex}`} 
              className={getCellClassName(rowIndex, colIndex)}
              style={{
                animationDelay: `${(rowIndex * 3 + colIndex) * 0.1}s`,
              }}
              animate={{
                rotateY: isSpinning ? [0, 180, 360] : 0,
                scale: showWinAnimation && 
                  (matches.includes(`row-${rowIndex}`) || 
                   matches.includes(`col-${colIndex}`) || 
                   (matches.includes('diag-1') && rowIndex === colIndex) || 
                   (matches.includes('diag-2') && rowIndex === 2 - colIndex)) 
                  ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: isSpinning ? 0.3 : 0.5,
                repeat: isSpinning ? Infinity : 0,
                ease: "easeInOut"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {fruit}
            </motion.div>
          ))
        )}
      </div>
      
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="w-full"
      >
        <Button 
          onClick={() => {
            onSpin();
            simulateHapticFeedback();
          }}
          disabled={!canPlay || isSpinning}
          isLoading={isSpinning}
          fullWidth
          size="lg"
          variant="fun"
          className="text-lg font-bold py-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          {canPlay ? 'SPIN THE FRUITS!' : 'Come back tomorrow!'}
        </Button>
      </motion.div>
      
      {matches.length > 0 && !isSpinning && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-xl text-center shadow-md"
        >
          <h3 className="text-2xl font-bold mb-2">🎉 YOU WON! 🎉</h3>
          <p className="text-lg">Congratulations! You matched 3 fruits in a row!</p>
        </motion.div>
      )}
    </div>
  );
} 