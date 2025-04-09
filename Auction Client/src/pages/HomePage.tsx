import React, { useEffect, useState } from 'react';
import { getAuctions, createAuction } from '../services/AuctionService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { socket } from '../services/AuctionService';

export default function HomePage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', startingPrice: '', duration: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadAuctions = async () => {
    try {
      const res = await getAuctions();
      setAuctions(res.data);
    } catch {
      setError('Failed to load auctions.');
    }
  };

  useEffect(() => {
    loadAuctions();
    socket.on('auction-list-updated', (data) => {
        console.log('[LIVE LIST UPDATE]', data);
        loadAuctions();
      });
    
      return () => socket.off('auction-list-updated');
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        startingPrice: parseFloat(form.startingPrice),
        duration: parseInt(form.duration)
      };
      await createAuction(payload);
      setForm({ name: '', description: '', startingPrice: '', duration: '' });
      loadAuctions();
      setError('');
    } catch {
      setError('Invalid data or failed to create item.');
    }
  };

  const isEnded = (item: any) => {
    const end = new Date(new Date(item.startTime).getTime() + item.duration * 1000);
    return new Date() > end;
  };

  return (
    <div>
      <motion.div
        className="bg-white p-6 rounded shadow mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold mb-3">Create New Auction</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input name="name" placeholder="Item name" className="border p-2 rounded" value={form.name} onChange={handleChange} />
          <input name="description" placeholder="Description" className="border p-2 rounded" value={form.description} onChange={handleChange} />
          <input name="startingPrice" type="number" placeholder="Starting price" className="border p-2 rounded" value={form.startingPrice} onChange={handleChange} />
          <input name="duration" type="number" placeholder="Duration (seconds)" className="border p-2 rounded" value={form.duration} onChange={handleChange} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create</button>
        </form>
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-lg font-semibold mb-2">Available Auctions</h2>
        {auctions.length === 0 ? (
          <p className="text-sm text-gray-500">No auctions available yet.</p>
        ) : (
          <ul className="space-y-3">
            {[...auctions]
  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  .map((item) =>  {
              const ended = isEnded(item);
              return (
                <li key={item.id} className="border p-3 rounded hover:bg-gray-50">
                  <div className="font-medium text-lg">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="text-sm">Starting Price: ${item.startingPrice}</div>
                  <div className={`text-sm font-semibold ${ended ? 'text-red-600' : 'text-green-600'}`}>
                    {ended ? 'Auction Ended' : 'Auction Live'}
                  </div>
                  <button
                    onClick={() => navigate(`/auction/${item.id}`)}
                    className="mt-2 text-blue-600 hover:underline text-sm"
                  >
                    View Auction →
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
}