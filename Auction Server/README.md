# Real-Time Auction Backend (NestJS + MySQL + WebSockets)

This is the backend for a real-time bidding system using NestJS, MySQL, and WebSockets. It simulates a live auction where users bid on items. The highest bid is broadcast in real-time to all connected clients.

---

## 🚀 Features

- Add auction items with duration
- Place bids on active auctions
- Reject bids below current or after expiration
- Real-time updates via WebSockets
- 100 hardcoded users seeded
- REST + WebSocket hybrid architecture
- Full bid history per item and user

---

## 📦 Tech Stack

- **Backend**: NestJS
- **ORM**: TypeORM
- **Database**: MySQL
- **Real-time**: Socket.IO via `@nestjs/websockets`

---

## 🧑‍💻 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start MySQL

Create a database called `auction` and ensure MySQL is running locally on port 3306 with user `root` and password `password`.


### 3. Seed Users

```bash
npm run seed
```

### 4. Start Backend

```bash
npm run start:dev
```

---

## 📡 WebSocket Events

Clients should listen to:

```
bid-update-<itemId>
```

Each new bid emits the updated auction item (including all bids and users).

---

## 🔥 API Endpoints

| Method | Endpoint           | Description                 |
|--------|--------------------|-----------------------------|
| POST   | `/auction`         | Create auction item         |
| GET    | `/auction`         | List all items              |
| GET    | `/auction/:id`     | Get item details            |
| POST   | `/auction/:id/bid` | Place bid (`userId`, `amount`) |

---

## ⚙️ Key Design Decisions

- Used `startTime + duration` to check auction expiration without relying on background jobs
- Real-time updates use room-style broadcast via Socket.IO
- Each bid is verified before being saved: ensures race condition prevention
- Current highest bid is determined via sorted query
- Clean separation of concerns: `gateway`, `service`, `controller`

---

## 👥 Seeding Users

Run `npm run seed` to insert 100 users (`User1` to `User100`) into the DB. Use their IDs (1-100) to bid.

---

## 📂 Folder Structure

```
src/
├── auction/
│   ├── auction.controller.ts
│   ├── auction.entity.ts
│   ├── auction.service.ts
│   ├── bid.entity.ts
├── users/
│   └── user.entity.ts
├── gateway/
│   └── auction.gateway.ts
├── database/
│   └── seed.ts
├── app.module.ts
├── main.ts
```