import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:4000';
export const socket = io(API_BASE);

export const getAuctions = () => axios.get(`${API_BASE}/auction`);
export const getAuctionById = (id: number) => axios.get(`${API_BASE}/auction/${id}`);
export const createAuction = (data: any) => axios.post(`${API_BASE}/auction`, data);
export const placeBid = (auctionId: number, payload: { userId: number; amount: number }) =>
  axios.post(`${API_BASE}/auction/${auctionId}/bid`, payload);

export const subscribeToBidUpdates = (auctionId: number, callback: (data: any) => void) => {
  socket.on(`bid-update-${auctionId}`, callback);
};

export const unsubscribeFromBidUpdates = (auctionId: number) => {
  socket.off(`bid-update-${auctionId}`);
};