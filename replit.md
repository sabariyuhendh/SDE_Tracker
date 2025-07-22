# TUF Class Tracker

## Overview
A full-stack web application for tracking student progress in coding problems, specifically designed for TUF (Take U Forward) courses. The app allows instructors to monitor student progress across different topics, generate class statistics, and maintain weekly reflections.

**Current State:** Application is running successfully on port 5000 with full Express.js backend and React frontend setup.

## Project Architecture

### Backend (Express.js)
- **Server**: Express.js with TypeScript
- **Storage**: In-memory storage (MemStorage) with PostgreSQL schema definitions
- **API Routes**: RESTful endpoints for students, class stats, and weekly reflections
- **Port**: 5000 (serves both API and frontend)

### Frontend (React + Vite)
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Database Schema
- **Students**: Username, name, avatar, progress tracking across topics and difficulties
- **Weekly Reflections**: Class statistics, topic breakdowns, highlights, and notes
- **Users**: Admin authentication (optional)

### Key Features
- Student management (create, read, update, delete)
- Progress tracking by topic and difficulty level
- Class statistics and leaderboard
- Weekly reflection system
- Real-time progress updates

## Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React, TypeScript, Vite
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS, shadcn/ui
- **Validation**: Zod schemas
- **Dev Tools**: tsx for TypeScript execution

## Project Structure
```
├── server/
│   ├── index.ts          # Main server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Storage interface and implementation
│   └── vite.ts           # Vite integration for development
├── client/
│   ├── src/
│   │   ├── main.tsx      # Frontend entry point
│   │   └── App.tsx       # Main app component
│   └── index.html        # HTML template
├── shared/
│   └── schema.ts         # Database schemas and types
└── package.json          # Dependencies and scripts
```

## Recent Changes
- **2024-07-22**: Fixed Hono to Express.js conversion in routes
  - Converted all Hono routes to Express Router format
  - Replaced zValidator with manual Zod validation
  - Fixed TypeScript compatibility issues
  - Application now starts successfully

## Development Guidelines
- Use Express.js for backend (not Hono)
- Implement proper error handling with HTTP status codes
- Use Zod schemas for request validation
- Maintain type safety between frontend and backend
- Keep storage interface abstract for future database integration

## Running the Application
```bash
npm run dev  # Starts both backend and frontend on port 5000
```

## User Preferences
*To be updated as user preferences are expressed*

## API Endpoints
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get specific student
- `PUT /api/students/:id/progress` - Update student progress
- `DELETE /api/students/:id` - Delete student
- `GET /api/class/stats` - Get class statistics
- `GET /api/class/leaderboard` - Get student leaderboard
- `GET /api/reflections` - Get all weekly reflections
- `POST /api/reflections` - Create weekly reflection
- `GET /api/reflections/:weekStart` - Get specific reflection
- `PUT /api/reflections/:weekStart` - Update weekly reflection