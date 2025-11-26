# Deployment Guide

## Quick Deployment Options

### 1. Docker Deployment (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access: http://localhost
```

### 2. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### 3. Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 4. Render Deployment
1. Connect GitHub repo to Render
2. Create Web Service for backend
3. Create Static Site for frontend
4. Add environment variables

## Environment Variables (Production)
```
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=library
PORT=3001
NODE_ENV=production
```

## Database Setup (Production)
1. Create MySQL database on cloud provider
2. Run database initialization scripts
3. Update connection credentials

## Frontend Build
```bash
cd frontend
npm run build
# Serve build folder with nginx/apache
```

## Backend Production
```bash
cd backend
npm install --production
node server.js
```