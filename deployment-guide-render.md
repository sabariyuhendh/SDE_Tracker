# Complete Deployment Guide - TUF Tracker

## 🏗️ Architecture Overview

Your TUF Class Tracker now has a complete **frontend + backend separation**:

```
Frontend (Vercel)          Backend (Render)
├── React App              ├── Express Server
├── Static Assets          ├── Puppeteer Scraper
├── UI Components          ├── Student Management
└── API Calls              └── Business Logic
```

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend Repository

Upload the `backend/` folder to a separate GitHub repository or use the same repo with proper configuration.

### Step 2: Deploy to Render

1. **Create New Web Service** on [Render.com](https://render.com)
2. **Connect Repository** containing the backend code
3. **Configure Build Settings**:
   - **Root Directory**: `backend` (if in same repo)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Step 3: Set Environment Variables

In Render dashboard, add these variables:

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Step 4: Verify Deployment

Test your backend API:

```bash
# Health check
curl https://your-backend.onrender.com/health

# Test scraping
curl -X POST https://your-backend.onrender.com/api/scrape/test \
  -H "Content-Type: application/json" \
  -d '{"username": "Volcaryx"}'
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

Create `client/.env.production`:

```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### Step 2: Deploy to Vercel

```bash
cd client
npx vercel deploy --prod
```

Or connect your GitHub repository to Vercel dashboard.

## 🔗 Complete API Endpoints

Your backend provides these endpoints:

### Core Operations
- `GET /health` - Health check
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `DELETE /api/students/:id` - Delete student

### Scraping Operations
- `POST /api/scrape/test` - Test profile scraping
- `POST /api/scrape/student/:id` - Scrape specific student
- `POST /api/scrape/bulk` - Bulk scrape all students

### Analytics
- `GET /api/analytics/class-stats` - Class statistics
- `GET /api/analytics/leaderboard` - Student rankings

### Data Management
- `GET /api/export/json` - Export all data

## 🧪 Testing Complete System

### Test Backend Locally

```bash
cd backend
npm install
npm start

# Test in another terminal
curl http://localhost:3001/health
```

### Test Frontend Locally

```bash
cd client
echo "VITE_BACKEND_URL=http://localhost:3001" > .env.local
npm run dev
```

### Test Production Integration

```bash
# Test backend on Render
curl https://your-backend.onrender.com/api/students

# Test frontend on Vercel
curl https://your-frontend.vercel.app
```

## 📊 Business Logic Features

### Student Management
- ✅ Add/delete students with validation
- ✅ Username uniqueness checking
- ✅ Automatic profile URL generation
- ✅ Progress tracking with timestamps

### TUF Data Scraping
- ✅ Real Puppeteer scraping (works on Render)
- ✅ Multi-strategy HTML parsing
- ✅ Authentic data extraction
- ✅ Fallback to known valid data
- ✅ Rate limiting and error handling

### Analytics & Reporting
- ✅ Class performance statistics
- ✅ Dynamic leaderboard generation
- ✅ Topic-wise progress tracking
- ✅ JSON export functionality

### Scheduled Operations
- ✅ Daily automatic scraping (6 AM UTC)
- ✅ Background bulk processing
- ✅ Comprehensive logging

## 🔒 Production Features

### Security
- CORS configuration for frontend
- Input validation and sanitization
- Error handling without data exposure
- Environment-based configuration

### Performance
- In-memory data management
- Browser resource optimization
- Rate limiting for scraping
- Graceful shutdown procedures

### Monitoring
- Health check endpoints
- Comprehensive error logging
- Performance metrics
- Uptime monitoring

## 🚨 Troubleshooting

### Backend Issues

**Puppeteer not working:**
```bash
# Check if Chromium is available
curl https://your-backend.onrender.com/health
```

**CORS errors:**
- Verify `FRONTEND_URL` environment variable
- Check allowed origins in server configuration

### Frontend Issues

**API calls failing:**
- Verify `VITE_BACKEND_URL` in production
- Check network tab for CORS issues
- Ensure backend is responding

### Common Solutions

1. **Render Cold Start**: First request may be slow
2. **Environment Variables**: Double-check spelling and values
3. **Build Logs**: Check Render deployment logs for errors
4. **CORS**: Ensure frontend URL is whitelisted in backend

## ✅ Deployment Checklist

### Backend (Render)
- [ ] Repository connected to Render
- [ ] Environment variables configured
- [ ] Build and start commands set
- [ ] Health endpoint responding
- [ ] Puppeteer test successful

### Frontend (Vercel)
- [ ] Backend URL configured in environment
- [ ] Build successful
- [ ] API calls working
- [ ] Student management functional
- [ ] Scraping operations working

### Integration
- [ ] CORS properly configured
- [ ] All API endpoints accessible
- [ ] Data flow working end-to-end
- [ ] Error handling functional
- [ ] Performance acceptable

## 🎯 Success Indicators

After successful deployment:

1. **Backend Health**: `https://your-backend.onrender.com/health` returns 200
2. **Frontend Load**: `https://your-frontend.vercel.app` loads correctly
3. **Add Student**: Can add new students via frontend
4. **Scraping Works**: Test scraping returns valid TUF data
5. **Data Persistence**: Student data maintained across sessions

## 📈 Scaling Considerations

### Backend Scaling
- Render auto-scales based on traffic
- Consider upgrading to paid plan for better performance
- Monitor memory usage for Puppeteer operations

### Frontend Scaling
- Vercel provides CDN and edge optimization
- Static assets cached globally
- API calls handled efficiently

Your TUF Class Tracker is now enterprise-ready with:
- ✅ Separated concerns (frontend/backend)
- ✅ Production deployment on Render + Vercel
- ✅ Real Puppeteer scraping capability
- ✅ Comprehensive business logic
- ✅ Scalable architecture