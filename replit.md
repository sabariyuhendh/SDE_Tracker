# TUF Class Tracker - Repository Description

## Project Overview
A React-based student progress tracking application for competitive programming, specifically designed for tracking TUF (Take U Forward) problem-solving progress. The system displays leaderboards, provides admin functionality, and manages class performance with a hardcoded frontend-only approach for Vercel hosting.

## Recent Changes
- **[2025-01-23]** Successfully converted application from database-dependent to frontend-only with hardcoded data
- **[2025-01-23]** Updated all components (AdminPanel, ScraperManagement, LeaderboardPage, ClassDashboard) with consistent purple gradient styling
- **[2025-01-23]** Fixed server configuration to work without database dependencies using simple Vite dev server
- **[2025-01-23]** Implemented global state management with useHardcodedData hook for seamless data flow
- **[2025-01-23]** Removed "Mark Problems as Solved" feature from AdminPanel as requested by user
- **[2025-01-23]** Created consistent navigation between all pages with SimpleNavigation component

## Architecture
- **Frontend**: React with TypeScript, Vite dev server, Tailwind CSS with shadcn/ui components
- **Data Layer**: Hardcoded data in frontend using React hooks for state management
- **Routing**: Wouter for client-side routing
- **Styling**: Consistent purple gradient theme (from-[#2E4057] via-[#516395] to-[#7209B7])
- **Components**: AdminPanel, ClassDashboard, LeaderboardPage, ScraperManagement with unified styling

## Key Features
- Student management via Admin panel (add, view, reset progress)
- Class dashboard with statistics and progress overview
- Leaderboard with sorting by total problems or percentage
- Scraper management (demo mode with simulated functionality)
- Consistent navigation across all pages

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
│   └── ScraperManagement.tsx   # Scraper demo interface
└── App.tsx                     # Router setup

server/
└── index.ts                    # Simple Vite dev server
```

## User Preferences
- Frontend-only application suitable for Vercel hosting
- Hardcoded data instead of database connectivity
- Consistent purple gradient styling across all components
- Simple, clean interface with good user experience
- Removed database dependencies and API complexities

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