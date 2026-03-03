# Alpha Market - Full-Stack eCommerce Platform

A premium, production-ready eCommerce platform built with **Next.js 15**, **Express.js**, and **Prisma**.

## 🚀 Features

- **Actors**: Admin and Customer roles.
- **Authentication**: JWT-based secure auth with role-based access.
- **Admin Dashboard**: Real-time stats, sales charts (Recharts), and low-stock alerts.
- **Management**: Full Product CRUD and Order Fulfillment system.
- **Shopping**: Product search, category filters, animated cart store, and secure checkout.
- **Design**: World-class UI with Tailwind CSS, Framer Motion, and Glassmorphism.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand.
- **Backend**: Node.js, Express.js, Prisma ORM, JWT, Bcrypt, Multer.
- **Database**: PostgreSQL.

## ⚙️ Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running on your machine.
Create a database named `alphamarket`.

Update `server/.env` with your DB credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/alphamarket?schema=public"
```

### 2. Backend Installation
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### 3. Frontend Installation
```bash
cd client
npm install
npm run dev
```

## 👤 Pre-seeded Accounts

### Admin
- **Email**: `yilkalbewketu8@gmail.com`
- **Password**: `password123`

### Customer
- **Email**: `yilkalbewuketu@gmail.com`
- **Password**: `password123`

---
Built with ❤️ by Alpha Market Team.
