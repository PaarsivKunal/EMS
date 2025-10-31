# Quick Fix for Login Error

## The Problem
Error: `ERR_CONNECTION_REFUSED` to `localhost:5000`

This means your backend server is not running.

## Solution 1: Start Backend Server (For Development)

**Step 1:** Open a terminal and start the backend:
```powershell
cd server
npm run dev
```

Wait until you see: `Server is running on http://localhost:5000`

**Step 2:** In a different terminal, start the frontend:
```powershell
cd vite_client
npm run dev
```

**Step 3:** Open browser to `http://localhost:5173` (not the built files)

## Solution 2: Use Production Backend (Quick Fix)

If you want to test with the production backend without running local server:

**Create file:** `vite_client/.env.local`
```bash
VITE_API_URL=https://ems-v6j5.onrender.com/api
VITE_API_BASE_URL=https://ems-v6j5.onrender.com/api/v1
```

**Restart vite dev server** and it will use production backend.

## Solution 3: Check What's Happening

Open browser console (F12) and look for:
- `🔧 API Base URL:` - Should show `/api` in dev or production URL in prod
- Check if requests are going to the right place

## Most Likely Issue

You're probably:
1. ✅ Running frontend (vite dev server)
2. ❌ NOT running backend server

**Fix:** Run `npm run dev` in the `server` folder!

