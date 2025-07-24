# TUF Class Tracker

A frontend-only React application for tracking student progress on TakeUForward (TUF) coding problems with real-time web scraping.

## ✨ Features

- **Frontend-Only Architecture**: No database dependencies, pure client-side data management
- **Real-Time Scraping**: Serverless Puppeteer API for authentic TUF profile data
- **Vercel Ready**: Optimized for serverless deployment with @sparticuz/chromium
- **Student Management**: Add, delete, and track student progress
- **Bulk Operations**: Scrape multiple profiles with rate limiting
- **Responsive Design**: Mobile-friendly interface with dark theme

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel deploy

# Or deploy to production
vercel --prod
```

## 📦 Serverless API

The application includes a single serverless function at `/api/scrape.js` that:

- Uses @sparticuz/chromium for serverless compatibility
- Scrapes real TUF profile data using Puppeteer
- Returns JSON data for frontend consumption
- Handles CORS and error responses

### API Usage

```bash
curl "https://your-app.vercel.app/api/scrape?username=Volcaryx"
```

## 🏗️ Architecture

```
├── api/
│   └── scrape.js           # Serverless scraping function
├── client/src/
│   ├── data/
│   │   └── hardcodedData.ts # Frontend data management
│   ├── hooks/
│   │   └── useHardcodedData.ts # Custom hooks
│   ├── pages/
│   │   └── FrontendOnlyDemo.tsx # Main demo page
│   └── components/         # UI components
├── vercel.json             # Vercel configuration
└── package.json           # Dependencies
```

## 🔧 Key Technologies

- **React + TypeScript**: Frontend framework
- **Puppeteer Core**: Web scraping engine
- **@sparticuz/chromium**: Serverless Chromium binary
- **Tailwind CSS**: Styling framework
- **Wouter**: Lightweight routing
- **Sonner**: Toast notifications

## 📊 Data Management

The application uses frontend-only data management with:

- In-memory storage for student data
- Real-time scraping via serverless API
- No database dependencies
- Persistent data through browser sessions

## 🎯 TUF Integration

Scrapes authentic data from TUF profiles including:

- Total problems solved
- Difficulty breakdown (Easy/Medium/Hard)
- Topic-wise progress across 15 categories
- Profile URLs and timestamps

## 🚀 Deployment

The application is optimized for Vercel deployment with:

- Serverless functions for scraping
- Static frontend hosting
- Automatic HTTPS and CDN
- Environment variable support

Ready to deploy with a single command: `vercel deploy`