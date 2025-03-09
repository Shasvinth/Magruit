'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getAllGameResults, isUserAdmin, GameResult } from '../../lib/db';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      if (!loading) {
        if (!user) {
          router.push('/login');
          return;
        }
        
        try {
          // Check if user is admin
          const adminStatus = await isUserAdmin(user.uid);
          setIsAdmin(adminStatus);
          
          if (adminStatus) {
            // Fetch all game results
            const results = await getAllGameResults();
            setGameResults(results);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      }
    };
    
    checkAdminAndFetchData();
  }, [user, loading, router]);
  
  if (loading || isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You do not have permission to access the admin dashboard.</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      </>
    );
  }
  
  // Group results by date
  const groupedResults = gameResults.reduce((acc, result) => {
    const date = result.date.toDate().toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(result);
    return acc;
  }, {} as Record<string, GameResult[]>);
  
  // Calculate statistics
  const totalPlays = gameResults.length;
  const totalWins = gameResults.filter(result => result.won).length;
  const winRate = totalPlays > 0 ? ((totalWins / totalPlays) * 100).toFixed(1) : '0';
  
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Total Plays</h2>
              <p className="text-3xl font-bold text-indigo-600">{totalPlays}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Total Wins</h2>
              <p className="text-3xl font-bold text-green-600">{totalWins}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Win Rate</h2>
              <p className="text-3xl font-bold text-blue-600">{winRate}%</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Game Results</h2>
            
            {Object.keys(groupedResults).length === 0 ? (
              <p className="text-gray-600">No game results available.</p>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedResults)
                  .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                  .map(([date, results]) => (
                    <div key={date} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-medium mb-4 text-gray-800">{date}</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Result
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Matches
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((result, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {result.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${result.won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {result.won ? 'Won' : 'Lost'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {result.matches.length > 0 ? result.matches.join(', ') : 'None'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {result.date.toDate().toLocaleTimeString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 