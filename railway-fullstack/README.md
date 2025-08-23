# Good Morning Generator - Railway Full-Stack Deployment

Complete React + Express + PostgreSQL application optimized for Railway deployment.

## 🚀 Deploy to Railway (Single Platform)

### Step 1: Upload to GitHub
1. Create new GitHub repository
2. Upload all these files
3. Push to GitHub

### Step 2: Deploy to Railway
1. Go to **railway.app**
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically:
   - Detect it's a Node.js app
   - Install dependencies
   - Build the React frontend
   - Start the Express server

### Step 3: Add Database
1. In Railway dashboard, click "Add Service"
2. Select "PostgreSQL"
3. Railway auto-connects it to your app

### Step 4: Set Environment Variables
1. Go to your app settings in Railway
2. Add environment variable:
   - `SESSION_SECRET`: Generate a random string

## ✅ What Railway Does Automatically:
- Runs `npm install`
- Builds React frontend with `npm run build:client`
- Starts Express server with `npm start`
- Provides DATABASE_URL
- Sets PORT automatically
- Gives you a URL like: `https://your-app.railway.app`

## 💡 Benefits of Railway Full-Stack:
- **Single deployment** - frontend and backend together
- **One URL** for your portfolio
- **Free database** included
- **Auto-scaling**
- **HTTPS** automatically
- **Custom domains** supported

## 🛠 Local Development:
```bash
npm install
npm run dev
```

## 📁 Project Structure:
- `client/` - React frontend
- `server/` - Express backend
- `shared/` - Shared TypeScript types
- Builds frontend into `dist/` and serves with Express

Perfect for showcasing full-stack React skills in your portfolio!