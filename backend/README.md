# TUF Tracker Backend

A Node.js backend service for the TUF Class Tracker application, designed for deployment on Render.com with full Puppeteer support.

## 🚀 Features

- **Student Management**: Add, update, delete, and track student progress
- **Real-time Scraping**: Puppeteer-based TUF profile scraping
- **Scheduled Jobs**: Automatic daily data updates
- **RESTful API**: Clean API endpoints for frontend integration
- **Analytics**: Class statistics and leaderboard generation
- **Export/Import**: JSON data export and import functionality
- **Health Monitoring**: Built-in health check endpoints

## 🏗️ Architecture

```
backend/
├── services/
│   ├── TUFScraper.js         # Puppeteer scraping service
│   ├── StudentManager.js     # Student data management
│   └── ScheduledScraper.js   # Cron job scheduling
├── server.js                 # Main Express server
├── package.json              # Dependencies
├── render.yaml              # Render deployment config
└── .env.example             # Environment variables template
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Student Management
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `DELETE /api/students/:id` - Delete student

### Scraping Operations
- `POST /api/scrape/test` - Test scrape a profile
- `POST /api/scrape/student/:id` - Scrape specific student
- `POST /api/scrape/bulk` - Bulk scrape all students

### Analytics
- `GET /api/analytics/class-stats` - Class statistics
- `GET /api/analytics/leaderboard` - Student leaderboard

### Data Export
- `GET /api/export/json` - Export all data as JSON

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## 🌍 Render Deployment

### Method 1: Connect GitHub Repository

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Starter or higher

### Method 2: Using render.yaml

1. Place `render.yaml` in your repository root
2. Connect repository to Render
3. Render will automatically use the configuration

### Environment Variables

Set these in your Render dashboard:

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔧 Configuration

### Puppeteer on Render

The service is pre-configured for Render's environment:

- Uses system Chromium installation
- Optimized launch arguments for containers
- Memory-efficient browser management
- Automatic cleanup and error handling

### Scheduled Scraping

- Runs daily at 6:00 AM UTC
- Automatically scrapes all student profiles
- Rate-limited to avoid overwhelming the target site
- Comprehensive error handling and logging

## 📊 Business Logic

### Student Management
- In-memory storage with Map-based operations
- Unique student validation by username
- Automatic profile URL generation
- Progress tracking with timestamps

### Data Scraping
- Multi-strategy HTML parsing
- Fallback to known authentic data
- Topic progress calculation
- Difficulty breakdown extraction

### Analytics
- Real-time class statistics
- Dynamic leaderboard generation
- Performance ranking by various metrics
- Export functionality for data backup

## 🔒 Security Features

- CORS configuration for frontend integration
- Input validation and sanitization
- Error handling without sensitive data exposure
- Rate limiting for scraping operations

## 📈 Monitoring

### Health Check Endpoint

```bash
curl https://your-app.onrender.com/health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-24T10:00:00.000Z",
  "environment": "production",
  "uptime": 3600.5
}
```

### Logs

Monitor application logs in the Render dashboard for:
- Scraping operations
- Student management activities
- Scheduled job execution
- Error tracking

## 🚨 Error Handling

- Comprehensive error logging
- Graceful degradation for failed scrapes
- Browser cleanup on shutdown
- Retry mechanisms for network failures

## 📞 API Usage Examples

### Add Student
```bash
curl -X POST https://your-app.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "username": "johndoe"}'
```

### Test Scraping
```bash
curl -X POST https://your-app.onrender.com/api/scrape/test \
  -H "Content-Type: application/json" \
  -d '{"username": "volcaryx"}'
```

### Get Class Statistics
```bash
curl https://your-app.onrender.com/api/analytics/class-stats
```

## 🎯 Production Ready

The backend is fully optimized for production deployment with:

- ✅ Container-ready Puppeteer configuration
- ✅ Environment-based configuration
- ✅ Comprehensive error handling
- ✅ Graceful shutdown procedures
- ✅ Health check endpoints
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Memory optimization

Deploy to Render with confidence!