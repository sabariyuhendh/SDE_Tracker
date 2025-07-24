# TUF Class Tracker - Repository Description

## Project Overview
A React-based student progress tracking application for competitive programming, specifically designed for tracking TUF (Take U Forward) problem-solving progress. The system displays leaderboards, provides admin functionality, and manages class performance with a hardcoded frontend-only approach for Vercel hosting.

## Recent Changes
- **[2025-01-24]** Added Weekend Review page with Personal and Class review tabs, including Calendar icon navigation
- **[2025-01-24]** Fixed bulk scraping and auto-scraping functionality to work with frontend-only architecture
- **[2025-01-24]** Implemented auto-scraping for newly added students with 2-second delay
- **[2025-01-24]** Updated scraper management to use hardcoded mock data generation instead of backend API calls
- **[2025-01-23]** Successfully converted application from database-dependent to frontend-only with hardcoded data
- **[2025-01-23]** Updated entire application with black gradient theme (removing purple gradients)
- **[2025-01-23]** Removed theme toggle functionality completely as requested
- **[2025-01-23]** Fixed routing conflicts by converting to single-page application with tab navigation
- **[2025-01-23]** Added delete student functionality to admin panel with proper hardcoded data management
- **[2025-01-23]** Eliminated duplicate admin panels and navigation issues for seamless user experience
- **[2025-01-23]** All components now work without routing dependencies for Vercel deployment

## Architecture
- **Frontend**: React with TypeScript, Vite dev server, Tailwind CSS with shadcn/ui components
- **Data Layer**: Hardcoded data in frontend using React hooks for state management
- **Routing**: Wouter for client-side routing
- **Styling**: Consistent black gradient theme (from-gray-900 via-gray-800 to-black)
- **Components**: Single-page application with AdminPanel, ClassDashboard, LeaderboardPage, ScraperManagement accessible via tabs

## Key Features
- Student management via Admin panel (add, view, reset, delete students)
- Class dashboard with statistics and progress overview
- Leaderboard with sorting by total problems or percentage
- Weekend Review page with Personal and Class review tabs
- Scraper management with working bulk and auto-scraping (frontend-only with mock data)
- Auto-scraping for newly added students
- Single-page application with tab navigation (no routing conflicts)

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
The application has been successfully converted to a frontend-only implementation:
- ✅ Hardcoded data layer with React state management
- ✅ All components updated with consistent styling
- ✅ Simple Vite dev server without database dependencies
- ✅ Navigation system working across all pages
- ✅ Admin panel for student management
- ✅ Leaderboard with sorting capabilities
- ✅ Demo scraper management interface

**Ready for Vercel deployment**: The application now works entirely with frontend hardcoded data and can be deployed to Vercel without any backend dependencies.