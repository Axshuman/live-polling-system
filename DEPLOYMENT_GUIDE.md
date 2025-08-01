# Live Polling System - Setup & Deployment Guide

## 🚀 Local Development Setup

### Prerequisites
- Node.js 16+ installed on your machine
- npm or yarn package manager
- Git (for cloning and version control)

### Step 1: Project Setup

1. **Clone or download the project:**
   ```bash
   # If you have the project files, navigate to the project directory
   cd live-polling-system
   ```

2. **Install frontend dependencies:**
   ```bash
   # From the root directory
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   # Navigate to backend directory
   cd backend
   npm install
   cd ..
   ```

### Step 2: Environment Configuration

1. **Create frontend environment file:**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   ```env
   VITE_SERVER_URL=http://localhost:3001
   ```

3. **Create backend environment file:**
   ```bash
   # Navigate to backend and copy example
   cd backend
   cp .env.example .env
   ```

4. **Edit the `backend/.env` file:**
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

### Step 3: Running the Application

You need to run both frontend and backend servers simultaneously.

**Option A: Using two terminal windows (Recommended)**

1. **Terminal 1 - Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `Server running on port 3001`

2. **Terminal 2 - Frontend Server:**
   ```bash
   # From root directory
   npm run dev
   ```
   You should see: `Local: http://localhost:5173`

**Option B: Using a single terminal with background process**
```bash
# Start backend in background
cd backend && npm run dev &
cd .. && npm run dev
```

### Step 4: Testing the Application

1. **Open your browser** and go to `http://localhost:5173`
2. **Test Teacher Flow:**
   - Click "Start as Teacher"
   - Create a new session
   - Copy the session ID
   - Create a poll with question and options
3. **Test Student Flow:**
   - Open a new browser tab/window
   - Go to `http://localhost:5173`
   - Click "Join as Student"
   - Enter your name and the session ID from step 2
   - Answer the poll question

## 🌐 Production Deployment

### Backend Deployment (Render)

1. **Prepare your backend for deployment:**
   
   Create a `backend/package.json` start script (should already exist):
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Deploy to Render:**
   
   a. **Create a Render account** at https://render.com
   
   b. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name:** `live-polling-backend`
     - **Environment:** `Node`
     - **Region:** Choose closest to your users
     - **Branch:** `main` (or your default branch)
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
   
   c. **Set Environment Variables:**
   - Go to "Environment" tab
   - Add these variables:
     ```
     PORT=10000
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Note: Replace `your-frontend-url` with your actual Vercel URL (you'll get this in the next step)

3. **Deploy and get your backend URL:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://live-polling-backend.onrender.com`)

### Frontend Deployment (Vercel)

1. **Update your frontend environment:**
   
   Create a `.env.production` file:
   ```env
   VITE_SERVER_URL=https://your-backend-url.onrender.com
   ```
   Replace `your-backend-url` with your actual Render URL from the previous step.

2. **Deploy to Vercel:**
   
   a. **Install Vercel CLI (optional but recommended):**
   ```bash
   npm install -g vercel
   ```
   
   b. **Deploy using Vercel CLI:**
   ```bash
   # From your project root directory
   vercel
   ```
   
   Follow the prompts:
   - **Set up and deploy?** `Y`
   - **Which scope?** Select your account
   - **Link to existing project?** `N`
   - **Project name:** `live-polling-system`
   - **Directory:** `./` (current directory)
   - **Override settings?** `N`

   c. **Alternative: Deploy via Vercel Dashboard:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `./` (leave empty)
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Add Environment Variable:
     - Key: `VITE_SERVER_URL`
     - Value: `https://your-backend-url.onrender.com`

3. **Update backend CORS settings:**
   
   After getting your Vercel URL, update your backend environment on Render:
   - Go to your Render dashboard
   - Select your backend service
   - Go to "Environment" tab
   - Update `FRONTEND_URL` to your Vercel URL
   - Save changes (this will trigger a redeploy)

### Step-by-Step Deployment Summary

1. **Deploy Backend First:**
   - Push code to GitHub
   - Create Render Web Service
   - Set environment variables (use placeholder for FRONTEND_URL initially)
   - Get backend URL

2. **Deploy Frontend:**
   - Set VITE_SERVER_URL to your backend URL
   - Deploy to Vercel
   - Get frontend URL

3. **Update Backend CORS:**
   - Update FRONTEND_URL in Render environment
   - Backend will redeploy automatically

## 🔧 Troubleshooting

### Common Local Development Issues

1. **Port already in use:**
   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   # Or use different port in backend/.env
   PORT=3002
   ```

2. **CORS errors:**
   - Ensure backend/.env has correct FRONTEND_URL
   - Check that both servers are running

3. **Socket connection failed:**
   - Verify VITE_SERVER_URL in frontend .env
   - Check browser console for errors
   - Ensure backend server is running

### Common Deployment Issues

1. **Backend deployment fails:**
   - Check build logs in Render dashboard
   - Ensure package.json has correct start script
   - Verify Node.js version compatibility

2. **Frontend can't connect to backend:**
   - Verify VITE_SERVER_URL environment variable
   - Check CORS settings in backend
   - Ensure backend is deployed and running

3. **Socket.io connection issues:**
   - Check browser network tab for WebSocket connections
   - Verify backend URL is accessible
   - Check for HTTPS/HTTP mixed content issues

## 📱 Testing Your Deployed Application

1. **Open your Vercel URL** in a browser
2. **Test the complete flow:**
   - Create a teacher session
   - Join as a student from another device/browser
   - Create and answer polls
   - Verify real-time updates work

## 🔄 Making Updates

### Local Development Updates
```bash
# Make your changes, then restart servers
# Backend changes:
cd backend
npm run dev

# Frontend changes (usually auto-reloads):
npm run dev
```

### Production Updates
```bash
# Commit and push changes
git add .
git commit -m "Your update message"
git push origin main

# Vercel will auto-deploy from GitHub
# Render will auto-deploy from GitHub
```

## 📊 Monitoring

### Render (Backend)
- View logs in Render dashboard
- Monitor performance and uptime
- Check environment variables

### Vercel (Frontend)
- View deployment logs
- Monitor function invocations
- Check build status

## 🎯 Production Checklist

- [ ] Backend deployed to Render with correct environment variables
- [ ] Frontend deployed to Vercel with correct VITE_SERVER_URL
- [ ] CORS configured properly (FRONTEND_URL in backend)
- [ ] Both applications accessible via HTTPS
- [ ] Real-time polling functionality working
- [ ] Teacher and student flows tested
- [ ] Mobile responsiveness verified
- [ ] Error handling working properly

Your live polling system should now be fully functional in production! 🎉