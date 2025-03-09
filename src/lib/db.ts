import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  isAdmin: boolean;
  lastPlayed?: Timestamp;
  createdAt: Timestamp;
}

// Game result interface
export interface GameResult {
  uid: string;
  email: string;
  date: Timestamp;
  grid: string[][];
  won: boolean;
  matches: string[];
  createdAt: Timestamp;
}

// Create or update user profile
export const createUserProfile = async (user: User, isAdmin: boolean = false) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      isAdmin,
      createdAt: serverTimestamp(),
    });
  }
};

// Check if user is admin
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile;
    return userData.isAdmin || false;
  }
  
  return false;
};

// Check if user has played today
export const hasUserPlayedToday = async (uid: string): Promise<boolean> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile;
    if (userData.lastPlayed) {
      const lastPlayed = userData.lastPlayed.toDate();
      const today = new Date();
      
      return (
        lastPlayed.getDate() === today.getDate() &&
        lastPlayed.getMonth() === today.getMonth() &&
        lastPlayed.getFullYear() === today.getFullYear()
      );
    }
  }
  
  return false;
};

// Update user's last played time
export const updateLastPlayed = async (uid: string, email: string = '') => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    // Document exists, update it
    await updateDoc(userRef, {
      lastPlayed: serverTimestamp(),
    });
  } else {
    // Document doesn't exist, create it
    await setDoc(userRef, {
      uid,
      email,
      isAdmin: false,
      lastPlayed: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }
};

// Save game result
export const saveGameResult = async (result: Omit<GameResult, 'createdAt'>) => {
  const gamesCollection = collection(db, 'games');
  
  // Flatten the 2D grid array into a string representation
  const flattenedGrid = JSON.stringify(result.grid);
  
  await addDoc(gamesCollection, {
    ...result,
    // Replace the 2D grid with the flattened version
    grid: flattenedGrid,
    createdAt: serverTimestamp(),
  });
};

// Get all game results for admin
export const getAllGameResults = async (): Promise<GameResult[]> => {
  const gamesCollection = collection(db, 'games');
  const gamesSnapshot = await getDocs(gamesCollection);
  return gamesSnapshot.docs.map(doc => {
    const data = doc.data();
    // Parse the grid string back to a 2D array
    return {
      ...data,
      grid: data.grid ? JSON.parse(data.grid) : [],
    } as GameResult;
  });
};

// Get user's game history
export const getUserGameHistory = async (uid: string): Promise<GameResult[]> => {
  const gamesCollection = collection(db, 'games');
  const userGamesQuery = query(gamesCollection, where('uid', '==', uid));
  const gamesSnapshot = await getDocs(userGamesQuery);
  return gamesSnapshot.docs.map(doc => {
    const data = doc.data();
    // Parse the grid string back to a 2D array
    return {
      ...data,
      grid: data.grid ? JSON.parse(data.grid) : [],
    } as GameResult;
  });
}; 