# Vercel Deployment Steps

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/library-management-system.git
git push -u origin main
```

## Step 2: Deploy Backend
1. Go to vercel.com dashboard
2. Click "New Project"
3. Import your GitHub repo
4. Set Root Directory to `backend`
5. Deploy

## Step 3: Deploy Frontend
1. Create another project in Vercel
2. Import same GitHub repo
3. Set Root Directory to `frontend`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.vercel.app`
5. Deploy

## Step 4: Database Setup
Use PlanetScale (free MySQL):
1. Sign up at planetscale.com
2. Create database
3. Get connection string
4. Add to backend environment variables in Vercel

## Environment Variables (Backend)
```
DB_HOST=your-planetscale-host
DB_USER=your-planetscale-user  
DB_PASSWORD=your-planetscale-password
DB_NAME=library
```

## Quick Alternative: Railway
1. Go to railway.app
2. Connect GitHub
3. Deploy backend + MySQL
4. Deploy frontend separately
```