# Project Management Tool

A modern full-stack project management application.

## Tech Stack

- **Frontend**: Angular 21+, Tailwind CSS, Lucide Icons, Chart.js
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL

## Features

- Role-based Access (Super Admin, Manager, Team Member)
- Dashboard with summary stats and activity logs
- Project CRUD and detailed views
- Team member assignment to projects
- Kanban-style Task Board with drag-and-drop
- Visual Reports using Chart.js

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pm_db?schema=public"
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database:
   ```bash
   npm run prisma:seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Angular application:
   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:4200`

### Default Login

- **Manager**: `manager@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`
- **Developer**: `dev@example.com` / `password123`
