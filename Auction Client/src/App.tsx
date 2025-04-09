import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import UserIdModal from './components/UserIdModal';

export default function App() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId && !isNaN(+storedId)) {
      setUserId(+storedId);
    }
  }, []);

  const handleSetUserId = (id: number) => {
    localStorage.setItem('userId', String(id));
    setUserId(id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {!userId && <UserIdModal onConfirm={handleSetUserId} />}
      {userId && (
        <>
          <nav className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">🎯 Live Auction</h1>
            <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auction/:id" element={<AuctionDetailPage userId={userId} />} />
          </Routes>
        </>
      )}
    </div>
  );
}
