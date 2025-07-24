# TUF Class Tracker - Repository Description

## Project Overview
A React-based student progress tracking application for competitive programming, specifically designed for tracking TUF (Take U Forward) problem-solving progress. The system displays leaderboards, provides admin functionality, and manages class performance with a hardcoded frontend-only approach for Vercel hosting.

## Recent Changes
- **[2025-07-24]** COMPLETE BACKEND ARCHITECTURE: Created comprehensive Node.js backend for Render deployment
- **[2025-07-24]** Built complete business logic layer with Express server (backend/server.js)
- **[2025-07-24]** Implemented full Puppeteer scraping service optimized for Render hosting
- **[2025-07-24]** Added StudentManager service for in-memory data management
- **[2025-07-24]** Created ScheduledScraper with cron jobs for daily automated scraping
- **[2025-07-24]** Added comprehensive API endpoints for all operations
- **[2025-07-24]** Frontend configured to connect to backend API with environment variables
- **[2025-01-24]** Implemented real web scraping from TUF website using Puppeteer for A2Z Sheet data
- **[2025-01-24]** Added TUF profile links - student names are now clickable links to their TUF profiles
- **[2025-01-24]** Updated all scraping functions to use real TUF API endpoints instead of mock data
- **[2025-01-24]** Added test scraping endpoint for real data validation from TUF profiles
- **[2025-01-24]** Fixed auto-scraping to work with real backend API calls for newly added students
- **[2025-01-23]** Successfully converted application from database-dependent to frontend-only with hardcoded data
- **[2025-01-23]** Updated entire application with black gradient theme (removing purple gradients)
- **[2025-01-23]** Removed theme toggle functionality completely as requested
- **[2025-01-23]** Fixed routing conflicts by converting to single-page application with tab navigation
- **[2025-01-23]** Added delete student functionality to admin panel with proper hardcoded data management
- **[2025-01-23]** Eliminated duplicate admin panels and navigation issues for seamless user experience
- **[2025-01-23]** All components now work without routing dependencies for Vercel deployment

## Architecture
- **Frontend**: React with TypeScript, Vite dev server, Tailwind CSS with shadcn/ui components (Vercel)
- **Backend**: Node.js Express server with comprehensive business logic (Render)
- **Data Management**: In-memory student management with StudentManager service
- **Data Scraping**: Full Puppeteer integration with TUFScraper service
- **Scheduled Jobs**: Automated daily scraping with ScheduledScraper and cron
- **API Layer**: RESTful endpoints for all CRUD operations and analytics
- **Deployment**: Separated frontend (Vercel) + backend (Render) architecture

## Key Features
- Student management via Admin panel (add, view, reset, delete students)
- Class dashboard with statistics and progress overview
- Leaderboard with sorting by total problems or percentage
- Weekend Review page with Personal and Class review tabs
- Real TUF web scraping from A2Z Sheet profiles using Puppeteer
- Clickable student names linking to TUF profiles
- Bulk and individual scraping with real data from TUF website
- Auto-scraping for newly added students (real API calls)
- Test scraping functionality for validating TUF usernames

## File Structure
```
client/src/
├── components/
│   ├── AdminPanel.tsx          # Student management interface
│   ├── ClassDashboard.tsx      # Main dashboard with stats
│   ├── LeaderboardPage.tsx     # Student rankings
│   ├── SimpleNavigation.tsx    # Navigation component
│   └── ui/                     # Shadcn UI components
├── data/
│   └── hardcodedData.ts        # Mock data and API functions
├── hooks/
│   └── useHardcodedData.ts     # Data management hooks
├── pages/
│   ├── Index.tsx               # Main page with tab navigation
│   ├── ScraperManagement.tsx   # Scraper management interface
│   └── WeekendReviewPage.tsx   # Weekend review with Personal/Class tabs
└── App.tsx                     # Router setup

server/
└── index.ts                    # Simple Vite dev server
```

## User Preferences
- Frontend-only application suitable for Vercel hosting
- Hardcoded data instead of database connectivity
- Black gradient styling (no theme toggle)
- Simple, clean interface with good user experience
- Single-page application design (no separate routes)
- Delete student functionality in admin panel

## Current Status
The application has been successfully converted to use real web scraping:
- ✅ Real TUF web scraping using Puppeteer from A2Z Sheet data
- ✅ Clickable student names that link to TUF profiles
- ✅ Backend API endpoints for test, individual, and bulk scraping
- ✅ Auto-scraping functionality with real API calls
- ✅ Complete scraper management interface with real data
- ✅ Admin panel for student management
- ✅ Leaderboard with real progress data

**Real Data Scraping Active**: The application now fetches authentic data from TUF website A2Z Sheet section only, ignoring SDE Sheet, Blind 75, and other sections as requested.