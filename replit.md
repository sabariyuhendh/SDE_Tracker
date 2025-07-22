# TUF Class Tracker with PostgreSQL and TUF Data Scraper

## Project Overview
A comprehensive full-stack web application for tracking student progress on TUF (TakeUForward) platform. Built with React frontend, Express backend, PostgreSQL database, and automated TUF profile scraping using Puppeteer.

## Key Features
✓ **Student Management** - Add, track, and manage student profiles
✓ **TUF Profile Scraping** - Automated data extraction from TUF profiles using Puppeteer
✓ **PostgreSQL Database** - Persistent data storage with proper schema management
✓ **Progress Tracking** - Topic-wise progress, difficulty statistics, and weekly improvements
✓ **Class Analytics** - Dashboard with comprehensive class statistics
✓ **Weekly Reviews** - Class reflections and progress summaries
✓ **Admin Panel** - Bulk operations and student management
✓ **Automated Scheduling** - Daily scraping at 2 AM UTC using cron jobs

## Architecture

### Database (PostgreSQL)
- **students** - Student profiles with TUF usernames, progress data, topic breakdown
- **weekly_reflections** - Class summaries and weekly review data  
- **admin_users** - Authentication and admin access
- Uses Drizzle ORM for schema management and migrations

### Backend (Express + Node.js)
- **API Routes** - RESTful endpoints for student management and scraping
- **TUF Scraper** - Puppeteer-based web scraping system
- **Storage Layer** - DatabaseStorage implementation with proper interfaces
- **Scheduled Tasks** - Auto-scraping with node-cron

### Frontend (React + TypeScript)
- **Dashboard** - Class overview with charts and statistics
- **Student Manager** - Add/edit students with TUF username integration  
- **Scraper Management** - Control panel for TUF data scraping
- **Leaderboard** - Student rankings and progress visualization
- **Weekly Review** - Class reflection and notes system

## TUF Scraper System

### Core Functionality
- **Profile Scraping** - Extracts total problems solved, difficulty breakdown, topic progress
- **Individual Updates** - Scrape specific students on-demand
- **Bulk Operations** - Update all students in background
- **Test Interface** - Test scraping with any TUF username
- **Auto-scheduling** - Daily updates at 2 AM UTC
- **Error Handling** - Robust error handling with retry logic

### API Endpoints
- `POST /api/students/:id/scrape` - Scrape individual student
- `POST /api/scrape/all` - Bulk scrape all students  
- `POST /api/scrape/test` - Test scraping with username
- `POST /api/scrape/start-auto` - Enable daily auto-scraping
- `POST /api/scrape/stop-auto` - Disable auto-scraping

### Technical Implementation
- **Puppeteer Configuration** - Headless browser with proper options for server deployment
- **Data Extraction** - DOM parsing for TUF profile elements
- **Background Processing** - Non-blocking bulk operations
- **Progress Tracking** - Real-time scraping status and results
- **Database Integration** - Direct updates to student records

## Recent Changes (Latest)
✓ **PostgreSQL Migration** - Converted from in-memory to persistent database storage
✓ **TUF Scraper System** - Complete implementation with Puppeteer for profile data extraction
✓ **Database Schema** - Proper PostgreSQL schema with Drizzle ORM
✓ **Scraper Management UI** - Frontend interface for scraper control and testing  
✓ **Auto-scheduling** - Daily cron job for automatic student data updates
✓ **API Routes** - Complete scraper endpoints with error handling
✓ **Server Integration** - Auto-start scraping on server initialization

## File Structure
```
server/
├── scraper.ts          # TUF scraping system with Puppeteer
├── db.ts              # PostgreSQL connection and schema
├── storage.ts         # Database storage implementation
├── routes.ts          # API endpoints including scraper routes
└── index.ts           # Server startup with scraper initialization

client/src/
├── pages/
│   └── ScraperManagement.tsx  # Scraper control interface
├── components/          # Dashboard, student management, etc.
└── App.tsx             # Routes including /scraper

shared/
└── schema.ts           # Drizzle schema definitions
```

## Database Schema
- **students**: id, username (TUF), name, avatar, total_solved, topic_progress, difficulty_stats, weekly_progress, reflection, timestamps
- **weekly_reflections**: id, week_start, class_stats, topic_breakdown, highlights, notes, created_at  
- **admin_users**: id, username, password (for future authentication)

## User Preferences
- **Database**: PostgreSQL with Drizzle ORM (migrated from in-memory storage)
- **Scraping**: Server-side Puppeteer implementation for TUF profile data
- **Automation**: Daily scheduled scraping at 2 AM UTC
- **UI**: Clean interface with scraper management and testing capabilities
- **Architecture**: Full-stack with proper separation of concerns

## Current Status
The application is fully functional with:
- ✅ PostgreSQL database connected and initialized
- ✅ TUF scraper system operational with Puppeteer
- ✅ Frontend scraper management interface complete
- ✅ Auto-scheduling enabled (daily at 2 AM UTC)
- ✅ API endpoints for all scraper operations
- ✅ Error handling and background processing
- ✅ Test interface for scraper validation

**Next Steps**: Test scraper with real TUF usernames and monitor daily auto-updates.