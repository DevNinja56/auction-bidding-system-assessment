import React from "react"
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UserIdModal({ onConfirm }: { onConfirm: (id: number) => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const id = parseInt(input);
    if (!id || id < 1 || id > 100) {
      setError('Please enter a valid User ID between 1 and 100');
      return;
    }
    setError('');
    onConfirm(id);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded shadow-lg w-96"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-bold mb-2">Enter Your User ID</h2>
        <p className="text-sm text-gray-600 mb-4">You must enter a valid User ID (1–100) to participate.</p>
        <input
          type="number"
          className="border p-2 w-full rounded mb-2"
          placeholder="Enter your user ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Confirm
        </button>
      </motion.div>
    </motion.div>
  );
}
