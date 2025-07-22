# TUF Class Tracker

## Overview
A full-stack web application for tracking student progress in coding problems, specifically designed for TUF (Take U Forward) courses. The app allows instructors to monitor student progress across different topics, generate class statistics, and maintain weekly reflections.

**Current State:** Application is running successfully on port 5000 with full Express.js backend and React frontend setup.

## Project Architecture

### Backend (Express.js)
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with direct SQL queries (no ORM per user request)
- **Storage**: DatabaseStorage class implementing full CRUD operations
- **API Routes**: RESTful endpoints + admin routes for bulk operations
- **Port**: 5000 (serves both API and frontend)
- **Admin Features**: Bulk student creation, manual problem marking, progress reset

### Frontend (React + Vite)
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Database Schema
- **Students**: Username, name, avatar, total_solved, topic_progress (JSONB), difficulty_stats (JSONB), weekly_progress (JSONB), reflection, timestamps
- **Weekly Reflections**: week_start, class_stats (JSONB), topic_breakdown (JSONB), highlights (JSONB), notes, timestamps
- **Admin Users**: Username, password, timestamps for admin authentication

### Key Features
- **Student Management**: Create, view, update, delete students with avatar support
- **Individual Student Reports**: Detailed pages showing topic progress, completion percentages, weekly activity
- **Leaderboard System**: Sortable rankings by total problems, completion %, and weekly improvement
- **Admin Panel**: Bulk CSV/JSON upload, manual problem marking, progress reset capabilities
- **Progress Tracking**: Topic-wise and difficulty-level progress with visual indicators
- **Custom Styling**: #516395 background with #F4F4F4 text for better contrast and elegance
- **Interactive UI**: Smooth hover animations, clickable student cards, navigation to detail views

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
- **2025-01-22**: Complete TUF Class Tracker Implementation
  - ✓ Replaced in-memory storage with PostgreSQL database
  - ✓ Implemented individual student detail pages with topic progress and star badges
  - ✓ Created comprehensive leaderboard system with multiple sorting options
  - ✓ Built admin panel with bulk upload, manual problem marking, and progress reset
  - ✓ Applied custom styling (#516395 background, #F4F4F4 text) throughout the app
  - ✓ Added smooth hover animations and card-hover effects
  - ✓ Connected all API endpoints for students, leaderboard, and admin functions
  - ✓ Added navigation to all new pages (student details, leaderboard)
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
### Student Management
- `GET /api/students` - Get all students with progress data
- `POST /api/students` - Create new student with initial topic setup
- `GET /api/students/:id` - Get specific student details
- `PUT /api/students/:id/progress` - Update student progress
- `DELETE /api/students/:id` - Delete student

### Class Analytics  
- `GET /api/class/stats` - Get class statistics and analytics
- `GET /api/class/leaderboard` - Get student leaderboard with rankings

### Weekly Reflections
- `GET /api/reflections` - Get all weekly reflections
- `POST /api/reflections` - Create weekly reflection
- `GET /api/reflections/:weekStart` - Get specific reflection
- `PUT /api/reflections/:weekStart` - Update weekly reflection

### Admin Operations
- `POST /api/admin/students/bulk` - Bulk create students from CSV/JSON
- `POST /api/admin/students/:id/mark-solved` - Mark problems as solved for student
- `POST /api/admin/students/:id/reset` - Reset student progress

## Frontend Routes
- `/` - Main dashboard with tabs (Dashboard, Students, Review, Admin)
- `/student/:id` - Individual student detail page
- `/leaderboard` - Full leaderboard with sorting options