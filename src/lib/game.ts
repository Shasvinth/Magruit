import { Timestamp } from 'firebase/firestore';
import { saveGameResult, updateLastPlayed } from './db';

// Available fruit symbols for the game
export const FRUITS = [
  '🍎', // apple
  '🍌', // banana
  '🍒', // cherry
  '🍇', // grapes
  '🍋', // lemon
  '🍊', // orange
  '🍑', // peach
  '🍓', // strawberry
  '🥝', // kiwi
];

// Generate random grid
export const generateGrid = (size: number = 3): string[][] => {
  const grid: string[][] = [];
  
  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      const randomIndex = Math.floor(Math.random() * FRUITS.length);
      row.push(FRUITS[randomIndex]);
    }
    grid.push(row);
  }
  
  return grid;
};

// Check for winning combinations
export const checkWinningCombinations = (grid: string[][]): { won: boolean; matches: string[] } => {
  const size = grid.length;
  const matches: string[] = [];
  
  // Check rows
  for (let i = 0; i < size; i++) {
    if (grid[i].every(fruit => fruit === grid[i][0])) {
      matches.push(`row-${i}`);
    }
  }
  
  // Check columns
  for (let j = 0; j < size; j++) {
    let isColumnMatch = true;
    for (let i = 1; i < size; i++) {
      if (grid[i][j] !== grid[0][j]) {
        isColumnMatch = false;
        break;
      }
    }
    if (isColumnMatch) {
      matches.push(`col-${j}`);
    }
  }
  
  // Check main diagonal
  let isDiagonal1Match = true;
  for (let i = 1; i < size; i++) {
    if (grid[i][i] !== grid[0][0]) {
      isDiagonal1Match = false;
      break;
    }
  }
  if (isDiagonal1Match) {
    matches.push('diag-1');
  }
  
  // Check secondary diagonal
  let isDiagonal2Match = true;
  for (let i = 1; i < size; i++) {
    if (grid[i][size - 1 - i] !== grid[0][size - 1]) {
      isDiagonal2Match = false;
      break;
    }
  }
  if (isDiagonal2Match) {
    matches.push('diag-2');
  }
  
  return {
    won: matches.length > 0,
    matches,
  };
};

// Play game and save result
export const playGame = async (uid: string, email: string) => {
  // Generate a random 3x3 grid
  const grid = generateGrid(3);
  
  // Check for winning combinations
  const { won, matches } = checkWinningCombinations(grid);
  
  // Save game result to database
  await saveGameResult({
    uid,
    email,
    date: Timestamp.now(),
    grid,
    won,
    matches,
  });
  
  // Update user's last played timestamp - also pass the email
  await updateLastPlayed(uid, email);
  
  return {
    grid,
    won,
    matches,
  };
}; 