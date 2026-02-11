# Deployment Guide - Phase 22

This guide walks through deploying the Rent vs. Buy Car Calculator to production.

## Prerequisites

- Git repository pushed to GitHub
- Accounts: [Railway](https://railway.app) or [Render](https://render.com), [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Phase 21 tests passing: `cd backend && npm test`

## Step 1: Deploy Backend

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `Arko-teste-pratico` repository
4. In service settings, set **Root Directory** to `backend`
5. Environment variables (Settings → Variables):
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-frontend-url.vercel.app` (update after frontend deploy)
6. Deploy and copy the generated URL (e.g., `https://arko-calculator-production.up.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New** → **Web Service**
3. Connect the repository
4. Use `render.yaml` at repo root, or configure manually:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables (same as Railway)
6. Deploy and note the URL

### Option C: Heroku

```bash
cd backend
heroku create arko-calculator-backend
heroku config:set NODE_ENV=production FRONTEND_URL=https://your-frontend.vercel.app
git push heroku main
```

## Step 2: Deploy Frontend

### Option A: Vercel (Recommended)

1. Install CLI: `npm install -g vercel`
2. Deploy:
   ```bash
   cd frontend
   vercel
   ```
3. Follow prompts (accept defaults for root dir, build command)
4. In Vercel dashboard → Settings → Environment Variables:
   - `VITE_API_URL` = `https://your-backend-railway-url.com` (no trailing slash)
5. Redeploy: `vercel --prod`
6. Copy production URL

### Option B: Netlify (Git-based)

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Select repository
3. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variable: `VITE_API_URL` = backend URL
5. Deploy

## Step 3: Update CORS

After frontend is deployed, update backend `FRONTEND_URL` to your actual frontend URL:

- Railway/Render: Settings → Variables → set `FRONTEND_URL`
- Redeploy backend if needed

## Step 4: Verify

```bash
# Health check
curl https://YOUR_BACKEND_URL/api/health

# Test calculation
curl -X POST https://YOUR_BACKEND_URL/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"carValue":50000,"monthlyRent":2200,"interestRateMonth":0.015,"financingTermMonths":48,"analysisPeriodMonths":48}'
```

Then visit the frontend URL and submit a calculation.

## Environment Variables Summary

| Service | Variable | Value |
|---------|----------|-------|
| Backend | `NODE_ENV` | `production` |
| Backend | `FRONTEND_URL` | `https://your-frontend.vercel.app` |
| Frontend | `VITE_API_URL` | `https://your-backend.railway.app` |
