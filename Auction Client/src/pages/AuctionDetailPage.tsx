import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAuctionById,
  placeBid,
  subscribeToBidUpdates,
  unsubscribeFromBidUpdates
} from '../services/AuctionService';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function AuctionDetailPage({ userId }: { userId: number }) {
  const { id } = useParams();
  const auctionId = Number(id);
  const [auction, setAuction] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);

  const loadAuction = async () => {
    try {
      const res = await getAuctionById(auctionId);
      setAuction(res.data);
    } catch {
      setError('Failed to load auction.');
    }
  };

  useEffect(() => {
    loadAuction();

    subscribeToBidUpdates(auctionId, (data) => {
      setAuction(data);
      setAnimatePrice(true);
      setTimeout(() => setAnimatePrice(false), 500);
    });

    return () => unsubscribeFromBidUpdates(auctionId);
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;

    let confettiCount = 0;
    const endTime = new Date(new Date(auction.startTime).getTime() + auction.duration * 1000);

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0 && !hasEnded) {
        setHasEnded(true);

        if (!hasShownModal) {
          setHasShownModal(true);
          setShowWinnerModal(true);
          // Confetti burst
          const fire = () => {
            confetti({
              particleCount: 100,
              spread: 90,
              origin: { y: 0.6 },
              zIndex: 9999,
            });
          };
          fire();
          const confettiInterval = setInterval(() => {
            confettiCount++;
            if (confettiCount >= 2) {
              clearInterval(confettiInterval);
            } else {
              fire();
            }
          }, 800);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction, hasEnded, hasShownModal]);

  const handleBid = async () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) return;

    try {
      await placeBid(auctionId, { userId, amount });
      setBidAmount('');
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to place bid.');
    }
  };

  if (!auction || timeLeft === null) {
    return <div className="text-center py-10 text-gray-500 text-lg animate-pulse">Loading auction details...</div>;
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const highestBid = auction.bids?.length
    ? Math.max(...auction.bids.map((b: any) => parseFloat(b.amount)))
    : null;

  const winner = auction.bids?.length
    ? [...auction.bids].sort((a, b) => b.amount - a.amount)[0]
    : null;

  return (
    <div className="relative">
      {/* 🎉 Winner or No Bidders Modal */}
      <AnimatePresence>
        {showWinnerModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-3xl mb-4">📢 Auction Ended</div>

              {winner ? (
                <>
                  <p className="text-xl text-green-600 font-bold">
                    🏆 {winner.user.name} won <strong>{auction.name}</strong>
                  </p>
                  <p className="text-lg mt-2 text-yellow-500">Final Bid: ${winner.amount}</p>
                </>
              ) : (
                <p className="text-md text-gray-600">No one placed a bid on this item.</p>
              )}

              <button
                onClick={() => setShowWinnerModal(false)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧾 Auction Info */}
      <motion.div
        className="bg-white p-6 rounded shadow mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-1">{auction.name}</h2>
        <p className="text-sm text-gray-500">{auction.description}</p>

        <div className="mt-2 text-sm">
          <p>🟡 <strong>Starting Price:</strong> ${auction.startingPrice}</p>

          <AnimatePresence>
            {highestBid !== null && (
              <motion.p
                key={highestBid}
                className="text-green-700 font-semibold text-md mt-1"
                initial={{ scale: 1 }}
                animate={animatePrice ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                🟢 <strong>Current Price:</strong> ${highestBid}
              </motion.p>
            )}
          </AnimatePresence>

          <p className={`mt-1 text-sm font-medium ${hasEnded ? 'text-red-600' : 'text-green-600'}`}>
            {hasEnded ? '⛔ Auction Ended' : `⏳ Ends in: ${formatTime(timeLeft)}`}
          </p>
        </div>
      </motion.div>

      {/* 💰 Bid Input */}
      {!hasEnded ? (
        <motion.div
          className="bg-white p-4 rounded shadow mb-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold mb-2">Place Your Bid</h3>
          <input
            type="number"
            placeholder="Enter bid amount"
            className="border p-2 rounded w-full mb-2"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <button onClick={handleBid} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Submit Bid
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-semibold">⚠️ This auction has ended. Bidding is closed.</p>
        </motion.div>
      )}

      {/* 📜 Bid History */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Bid History</h3>
        {auction.bids && auction.bids.length > 0 ? (
          <ul className="divide-y text-sm">
            {[...auction.bids]
              .sort((a, b) => b.amount - a.amount)
              .map((bid: any) => (
                <li key={bid.id} className="py-2 flex justify-between">
                  <span>User {bid.user.name}</span>
                  <span>${bid.amount}</span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bids yet.</p>
        )}
      </div>
    </div>
  );
}