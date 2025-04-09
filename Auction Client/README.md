# 🏷️ Live Auction System – Frontend (ReactJS)

This is the **frontend application** for a real-time auction system built with **ReactJS**, **Tailwind CSS**, **Framer Motion**, **Socket.IO**, and **canvas-confetti**. It allows users to participate in live auctions, place bids, and see real-time updates — with a beautiful UI experience.

## 📦 Tech Stack

- **ReactJS** (Vite)
- **Tailwind CSS** for styling
- **Framer Motion** for UI animations
- **Socket.IO** for real-time bid updates
- **Axios** for API integration
- **canvas-confetti** for fireworks 🎆
- TypeScript

## 🚀 Features

### ✅ Core Features

- 📋 **Auction Listing**
  - Displays all active auctions
  - Real-time updates when auction is created or ends
  - Sorted: Most recently created at the top
  - Shows "Auction Ended" or "Auction Live" status

- 🛠️ **Create Auction**
  - Form to add a new auction with name, description, starting price, and duration

- 📄 **Auction Detail View**
  - Live countdown to auction end (HH:MM:SS)
  - Shows:
    - Name, description
    - Starting Price
    - Current Price (real-time with animation)
    - Bid history
  - Place bid (disabled when auction ends)
  - Winner modal with confetti fireworks on auction end 🎉
  - Friendly no-winner message if no bids were placed

- 👤 **User Identity Prompt**
  - On first visit, prompts user to enter a user ID (1–100)
  - Validates and stores user ID in local storage
  - Required before interacting with app

## 🧪 How to Run the Project Locally

###  Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

> App runs at [http://localhost:5173](http://localhost:5173)

> Ensure backend server is running at `http://localhost:4000`

## 🔗 Project Structure

```
src/
├── components/
│   └── UserIdModal.tsx     # User ID entry popup
├── pages/
│   ├── HomePage.tsx        # Dashboard view
│   └── AuctionDetailPage.tsx # Individual auction
├── services/
│   └── AuctionService.ts   # Axios + socket handlers
├── App.tsx                 # Routes + layout
└── main.tsx                # App entry
```

## 🧠 Documentation of Our Approach

### 🧩 Key Design Decisions

- 💬 **Socket.IO** used to push bid + auction updates to all connected clients
- 🎯 **Framer Motion** for intuitive and elegant transitions (bid price updates, modals)
- 🧠 **Single Source of Truth** via backend; UI revalidates data on every change
- 📶 **User ID management** via localStorage for quick auth simulation

### 🧱 Robustness & Scalability

- ⏱️ Live countdown timer updates per second via `setInterval`
- ⚡ Confetti bursts handled with capped intervals (won’t overload UI)
- 💡 Winner modal only shows once per session to prevent confusion
- 🔄 Auction list updates automatically in real-time

### ⚔️ Race Condition Protection

- Bids validated in backend (cannot bid if:
  - Auction ended
  - Amount is not higher than current)
- Socket updates handled optimistically in frontend but still validate from server
- Winner calculation shown only **after** the backend has ended the auction

## 🎉 End Result

This frontend UI creates a real-time, highly interactive auction environment with live updates, smooth animations, and user-friendly controls.
