# TUF Class Tracker - Repository Description

## Project Overview
A React-based student progress tracking application for competitive programming, specifically designed for tracking TUF (Take U Forward) problem-solving progress. The system displays leaderboards, provides admin functionality, and manages class performance with a hardcoded frontend-only approach for Vercel hosting.

## Recent Changes
- **[2025-07-24]** COMPLETE ARCHITECTURAL PIVOT: Removed all hardcoded user data from backend
- **[2025-07-24]** Implemented frontend-only solution with serverless Puppeteer API (/api/scrape.js)
- **[2025-07-24]** Added @sparticuz/chromium + puppeteer-core for Vercel deployment compatibility
- **[2025-07-24]** Created frontend-only data management system (client/src/data/hardcodedData.ts)
- **[2025-07-24]** Updated hooks to work without backend database dependencies
- **[2025-07-24]** Added vercel.json configuration for serverless function deployment
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
- **Frontend**: React with TypeScript, Vite dev server, Tailwind CSS with shadcn/ui components
- **Serverless API**: Single /api/scrape.js endpoint using @sparticuz/chromium for Vercel compatibility
- **Data Management**: Frontend-only with in-memory storage (no database dependencies)
- **Data Scraping**: Real-time TUF profile scraping via serverless Puppeteer API
- **Routing**: Wouter for client-side routing
- **Styling**: Consistent black gradient theme (from-gray-900 via-gray-800 to-black)
- **Deployment**: Vercel-ready with serverless functions and static frontend

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