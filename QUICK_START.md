# 🚀 Quick Start Guide

## Local Development (5 minutes)

### 1. Install Dependencies
```bash
npm run setup
```

### 2. Setup Environment Files
```bash
# Frontend environment
cp .env.example .env

# Backend environment  
cp backend/.env.example backend/.env
```

### 3. Start Both Servers
```bash
npm run dev:all
```

### 4. Test the Application
- Open http://localhost:5173
- Click "Start as Teacher" → Create session
- Open new tab → "Join as Student" → Use session ID
- Create and answer polls!

## Production Deployment

### Backend (Render)
1. Push to GitHub
2. Create Render Web Service
3. Set Root Directory: `backend`
4. Environment Variables:
   - `PORT=10000`
   - `FRONTEND_URL=https://your-vercel-url.vercel.app`

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set Environment Variable:
   - `VITE_SERVER_URL=https://your-render-url.onrender.com`
3. Deploy!

### Update CORS
After both are deployed, update `FRONTEND_URL` in Render with your actual Vercel URL.

## Troubleshooting

**Can't connect to backend?**
- Check if backend server is running on port 3001
- Verify VITE_SERVER_URL in .env file

**CORS errors?**
- Ensure FRONTEND_URL matches your frontend URL exactly
- Check both servers are running

**Socket connection failed?**
- Verify backend URL is accessible
- Check browser console for errors

Need help? Check the full DEPLOYMENT_GUIDE.md for detailed instructions!