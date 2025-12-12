# Deploy to Render.com - Step by Step Guide

Complete guide for deploying the Kauai Travel Helper to Render.com.

## Why Render.com?

- ✅ **Free tier available** for both frontend and backend
- ✅ **Automatic HTTPS** included
- ✅ **Git-based deployment** - auto-deploys on push
- ✅ **SQLite support** - persistent disk storage
- ✅ **Environment variables** - easy to configure
- ✅ **Zero downtime deploys**
- ✅ **Excellent for full-stack apps**

## 🚀 Deployment Steps

### Part 1: Deploy Backend (Do This First)

#### Step 1: Push Your Code to GitHub

```bash
cd "/Users/m1promachine2022/code/AIDD/Kauai Trip 2025"

git add .
git commit -m "chore: Release v1.0.0-mvp for Render deployment"
git push origin main
```

#### Step 2: Create Backend Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com/)
2. Click "**New +**" → "**Web Service**"
3. Connect your GitHub repository
4. Select `aidd-vuejs-sql-db` repository

#### Step 3: Configure Backend Service

**Basic Settings:**
- **Name:** `kauai-backend` (or any name you prefer)
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** `Kauai Trip 2025/backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

**Instance Type:**
- Select **Free** tier (perfect for MVP)

**Environment Variables:**
Click "**Add Environment Variable**" for each:

```
GOOGLE_PLACES_API_KEY=      (leave empty or add your key)
YELP_API_KEY=               (leave empty or add your key)
PORT=10000                  (Render uses port 10000 by default)
```

**Advanced Settings:**
- **Auto-Deploy:** Yes (deploys automatically on git push)
- **Health Check Path:** `/api` (optional but recommended)

#### Step 4: Add Persistent Disk for SQLite

This is IMPORTANT for SQLite to persist!

1. Scroll to "**Disks**" section
2. Click "**Add Disk**"
3. Configure:
   - **Name:** `kauai-database`
   - **Mount Path:** `/opt/render/project/src/database`
   - **Size:** 1 GB (plenty for MVP)
4. Click "Create"

#### Step 5: Update Database Path (IMPORTANT!)

Since Render uses a persistent disk, update your database service:

**Option A: Environment Variable (Recommended)**

Add to Render environment variables:
```
DB_PATH=/opt/render/project/src/database/kauai.db
```

Then update `backend/services/database.js`:
```javascript
const dbPath = process.env.DB_PATH || join(__dirname, '../database/kauai.db');
```

**Option B: Use Render's disk mount**
- Mount disk to: `/opt/render/project/src/backend/database`
- No code changes needed!

#### Step 6: Deploy!

Click "**Create Web Service**"

Render will:
- Clone your repository
- Run `npm install`
- Start your server
- Give you a URL like: `https://kauai-backend.onrender.com`

**Wait for:** "Deploy succeeded" message (2-3 minutes)

#### Step 7: Test Backend

Visit: `https://your-backend-name.onrender.com/api`

You should see:
```json
{
  "success": true,
  "message": "Kauai Travel Helper API",
  "version": "1.0.0-mvp"
}
```

---

### Part 2: Deploy Frontend (Do This Second)

#### Step 1: Update Frontend API URL

Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

Replace `your-backend-name` with your actual Render backend URL.

#### Step 2: Commit Frontend Changes

```bash
git add frontend/.env.production
git commit -m "feat: Add production API URL for Render"
git push origin main
```

#### Step 3: Create Static Site on Render

1. Go to [dashboard.render.com](https://dashboard.render.com/)
2. Click "**New +**" → "**Static Site**"
3. Select your repository

#### Step 4: Configure Frontend Service

**Basic Settings:**
- **Name:** `kauai-frontend` (or any name)
- **Branch:** `main`
- **Root Directory:** `Kauai Trip 2025/frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

**Advanced:**
- **Auto-Deploy:** Yes
- **Pull Request Previews:** Yes (optional, useful for testing)

#### Step 5: Deploy Frontend

Click "**Create Static Site**"

Render will:
- Install dependencies
- Build your Vue app
- Deploy to CDN
- Give you a URL like: `https://kauai-frontend.onrender.com`

**Wait for:** "Deploy succeeded" (2-3 minutes)

#### Step 6: Test Your Live App! 🎉

Visit: `https://your-frontend-name.onrender.com`

You should see your beautiful Kauai Travel Helper with a random beach background!

---

## 🔧 Post-Deployment Configuration

### Enable CORS (If Needed)

Your backend already has CORS enabled, but verify in `backend/server.js`:

```javascript
app.use(cors()); // Already there!
```

### Add Custom Domain (Optional)

**For Backend:**
1. Go to backend service → Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed

**For Frontend:**
1. Go to static site → Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## 💡 Render.com Tips

### Free Tier Limitations

**Backend (Free Web Service):**
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ Cold start takes ~30 seconds
- ✅ Automatic SSL
- ✅ 512 MB RAM

**Frontend (Free Static Site):**
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Automatic SSL
- ✅ Always on (no spin down)

### Avoid Cold Starts (Optional)

**Option 1: Upgrade to Paid Tier**
- $7/month keeps service always on
- No cold starts
- More resources

**Option 2: Use a Ping Service (Free)**
- [UptimeRobot](https://uptimerobot.com/) - free
- Ping your backend every 10 minutes
- Keeps it awake during day

**Option 3: Accept Cold Starts**
- First load takes 30 seconds
- Subsequent loads are instant
- Totally fine for personal MVP!

---

## 📊 Monitoring Your App

### Render Dashboard

Monitor in Render dashboard:
- **Logs** - Real-time server logs
- **Metrics** - CPU, memory, bandwidth
- **Deploy history** - All deployments
- **Health checks** - Uptime monitoring

### Check Backend Health

```bash
curl https://your-backend.onrender.com/api
```

### Check Frontend

```bash
curl https://your-frontend.onrender.com
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Build failed"**
- Check build logs in Render dashboard
- Verify `package.json` has all dependencies
- Ensure `node server.js` works locally

**"Database not persisting"**
- Verify persistent disk is mounted
- Check disk path matches your code
- Restart service after adding disk

**"API calls failing"**
- Check environment variables are set
- Verify CORS is enabled
- Check Render logs for errors

### Frontend Issues

**"Build failed"**
- Verify `npm run build` works locally
- Check all imports are correct
- Review build logs in Render

**"Can't connect to backend"**
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and running
- Test backend URL directly in browser

**"Random beach backgrounds not showing"**
- Images load from Unsplash CDN (should work)
- Check browser console for errors
- Verify internet connection

---

## 🔄 Updating Your App

### Automatic Deployments

Since auto-deploy is enabled:

```bash
# Make changes locally
git add .
git commit -m "feat: Add new activity"
git push origin main

# Render automatically:
# 1. Detects the push
# 2. Rebuilds affected services
# 3. Deploys new version
# 4. Zero downtime!
```

### Manual Deploy

In Render dashboard:
1. Go to your service
2. Click "**Manual Deploy**"
3. Select branch
4. Click "**Deploy**"

---

## 🎯 Production Checklist

Before sharing your deployed app:

- [ ] Backend URL is accessible
- [ ] Frontend loads without errors
- [ ] All 20 activities display
- [ ] Region navigation works
- [ ] Activity details load
- [ ] Images display properly
- [ ] Mobile responsive verified
- [ ] Test on different devices
- [ ] Share URL with test users!

---

## 💰 Cost Estimation

### Free Tier (MVP - Recommended)
- **Backend:** Free (with cold starts)
- **Frontend:** Free (always on)
- **Total:** $0/month

### Paid Tier (Production)
- **Backend:** $7/month (no cold starts)
- **Frontend:** Free (always on)
- **Total:** $7/month

### With Database Backup (Optional)
- Add PostgreSQL: $7/month
- (SQLite on disk is fine for MVP)

---

## 📝 Render.com Specific Files

### render.yaml (Optional - Infrastructure as Code)

Create `render.yaml` at project root for automatic setup:

```yaml
services:
  # Backend API
  - type: web
    name: kauai-backend
    runtime: node
    rootDir: backend
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: PORT
        value: 10000
      - key: GOOGLE_PLACES_API_KEY
        sync: false
      - key: YELP_API_KEY
        sync: false
    disk:
      name: database
      mountPath: /opt/render/project/src/database
      sizeGB: 1

  # Frontend Static Site
  - type: web
    name: kauai-frontend
    runtime: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_API_URL
        value: https://kauai-backend.onrender.com/api
```

With this file, you can deploy everything with one click using Render's "Blueprint" feature!

---

## 🎊 You're Ready!

Your app is:
- ✅ **Tested** locally
- ✅ **Documented** completely
- ✅ **Configured** for Render
- ✅ **Ready** to deploy

**Deploy Time: ~5-10 minutes total**

After deployment, you'll have a live URL to share with friends and family for your Kauai trip! 🌺🏝️

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com/
- **GitHub Issues:** Open an issue in your repo

**Mahalo and happy deploying! 🌺**

