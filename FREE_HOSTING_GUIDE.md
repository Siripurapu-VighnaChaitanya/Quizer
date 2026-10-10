# 🚀 Free Hosting Guide — ExamPrep Hub

ExamPrep Hub is built with a **100% Zero-Database, Zero-Cost Architecture** (JSON question bank + in-memory caching). You can host both the frontend and backend permanently for **$0/month** without entering a credit card.

---

## 📋 Overview of Options

| Method | Frontend Host | Backend Host | Pros | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Method 1 (Recommended)** | **Vercel** (Free) | **Render** (Free) | Lightning fast UI, CDN edge caching, 0 cold starts for frontend | Best user experience |
| **Method 2 (All-in-One)** | **Render** (Free) | **Render** (Free) | 1 single URL, zero CORS setup, uses `SERVE_FRONTEND=true` | Simplest setup |
| **Method 3 (Docker)** | **Koyeb** / **Hugging Face** | Same (Docker) | Runs the included multi-stage `Dockerfile` | Container lovers |

---

## 🥇 Method 1: Vercel (Frontend) + Render (Backend) — *Recommended*

This is the standard production setup. Vercel serves the React UI instantly from 100+ global edge locations, and Render hosts the FastAPI backend.

### Step 1: Push Code to GitHub
1. Create a new GitHub repository (e.g., `examprep-hub`).
2. Push your project code:
   ```bash
   git init
   git add .
   git commit -m "Initial ExamPrep Hub release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/examprep-hub.git
   git push -u origin main
   ```

---

### Step 2: Deploy Backend to Render (Free Web Service)
1. Sign up for free at [render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`examprep-hub`).
4. Configure the service settings:
   - **Name**: `examprep-hub-api`
   - **Region**: Oregon (US West) or Frankfurt (EU)
   - **Branch**: `main`
   - **Root Directory**: leave blank (or `.`)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
5. Click **Create Web Service**.
6. Wait 2 minutes for the deployment to finish. Once live, copy your backend URL:
   `https://examprep-hub-api.onrender.com`
7. Verify it in your browser: `https://examprep-hub-api.onrender.com/api/health` (should return `"status": "ok"`).

---

### Step 3: Deploy Frontend to Vercel (Free Static Edge)
1. Sign up for free at [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (`examprep-hub`).
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://examprep-hub-api.onrender.com/api` *(use your Render URL from Step 2 with `/api`)*
6. Click **Deploy**.
7. In ~30 seconds, your site is live at: `https://examprep-hub.vercel.app`! 🎉

---

## 🥈 Method 2: Render All-in-One (Single Web Service)

If you prefer having **one single URL** without managing two separate hosting dashboards:

1. Push your repository to GitHub.
2. In Render, click **New +** → **Blueprint** and select your repository. Render will automatically read `render.yaml` and configure everything!
   
*Or configure manually:*
1. Click **New +** → **Web Service**.
2. **Environment**: `Docker` (Render will use the included multi-stage `Dockerfile`).
3. Click **Create Web Service**.
   - The `Dockerfile` compiles the Vite frontend, places the static bundle in the backend image, and runs FastAPI serving both the UI and `/api` on port `8000`!

---

## 🥉 Method 3: Netlify (Frontend) + Render (Backend)

1. Sign up at [netlify.com](https://netlify.com).
2. Click **Add new site** → **Import an existing project** from GitHub.
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. In **Site configuration** → **Environment variables**:
   - Add `VITE_API_BASE_URL` = `https://<your-render-backend>.onrender.com/api`
5. The included `frontend/public/_redirects` file automatically handles single-page app routing on Netlify without 404 errors on refresh!

---

## 💡 Pro-Tip: Preventing Free Render Cold Starts

Render's free tier spins down the backend after 15 minutes of inactivity. When a user visits after a quiet period, the first API call can take 30–50 seconds to warm up.

**How to keep it 100% warm for free:**
1. Go to [uptimerobot.com](https://uptimerobot.com) (100% free account).
2. Click **Add New Monitor**.
3. Monitor Type: **HTTP(s)**.
4. Friendly Name: `ExamPrep Hub Keepalive`.
5. URL: `https://examprep-hub-api.onrender.com/api/health`.
6. Monitoring Interval: **Every 10 minutes**.
7. This automatically pings your health check endpoint, keeping your free backend awake 24/7 with zero cold starts!
