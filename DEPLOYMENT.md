# Deployment Guide - MVP Release

Quick guide for deploying the Kauai Travel Helper MVP to production.

## 🚀 Deployment Options

### ⭐ Recommended: Render.com (Easiest!)

**See [DEPLOY_TO_RENDER.md](DEPLOY_TO_RENDER.md) for complete step-by-step guide!**

Best for: Quick deployment, free tier, automatic HTTPS, SQLite support

**Why Render.com:**
- Free tier perfect for MVP
- Supports SQLite with persistent disks
- Auto-deploy on git push
- Both frontend and backend on one platform
- Takes ~10 minutes to deploy

**Quick Summary:**
1. Deploy backend as Web Service (with persistent disk)
2. Deploy frontend as Static Site
3. Connect them with environment variables
4. Done! 🎉

---

### Option 2: Personal Server / VPS

Best for: Personal use, full control, low cost

**Requirements:**
- VPS with Node.js installed (DigitalOcean, Linode, AWS EC2)
- Nginx for serving frontend
- PM2 for backend process management

**Steps:**

```bash
# 1. Upload code to server
scp -r "Kauai Trip 2025" user@your-server:/var/www/

# 2. SSH into server
ssh user@your-server

# 3. Install dependencies
cd /var/www/Kauai\ Trip\ 2025/backend
npm install

cd /var/www/Kauai\ Trip\ 2025/frontend
npm install

# 4. Build frontend
cd /var/www/Kauai\ Trip\ 2025/frontend
npm run build
# Creates frontend/dist/ folder

# 5. Configure environment
cd /var/www/Kauai\ Trip\ 2025/backend
nano .env
# Add your API keys

# 6. Start backend with PM2
pm2 start server.js --name kauai-backend
pm2 save
pm2 startup

# 7. Configure Nginx to serve frontend and proxy API
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve frontend static files
    location / {
        root /var/www/Kauai\ Trip\ 2025/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Option 3: Vercel (Frontend) + Railway (Backend)

Best for: Easy deployment, automatic HTTPS, free tier available

#### **Deploy Frontend to Vercel:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel

# Follow prompts:
# - Link to Vercel account
# - Set build command: npm run build
# - Set output directory: dist
```

**Environment Variables in Vercel:**
```
VITE_API_URL=https://your-backend.railway.app/api
```

#### **Deploy Backend to Railway:**

1. Go to [Railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory: `backend`
5. Add environment variables:
   - `GOOGLE_PLACES_API_KEY`
   - `YELP_API_KEY`
   - `PORT=3000`
6. Deploy!

---

### Option 4: Netlify (Frontend) Only

Similar to Vercel setup.

#### **Deploy Frontend to Netlify:**

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build and deploy
cd frontend
npm run build
netlify deploy --prod

# Specify: dist folder
```

---

### Option 5: Local Network Deployment

Best for: Home network access only, zero cost

**Make accessible on local network:**

```bash
# 1. Find your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# 2. Update frontend API URL
# Edit frontend/.env
VITE_API_URL=http://192.168.x.x:3000/api

# 3. Start both servers
npm run dev

# 4. Access from any device on network
http://192.168.x.x:5173
```

---

## 📦 Pre-Deployment Checklist

### Code Preparation
- [x] All dependencies installed
- [x] Environment variables documented
- [x] Database schema and seed ready
- [x] Frontend builds without errors
- [x] Backend starts without errors
- [x] Version updated to 1.0.0-mvp

### Frontend
```bash
cd frontend
npm run build
# Verify: dist/ folder created
# Check: No console errors
```

### Backend
```bash
cd backend
node server.js
# Verify: "Database initialized" message
# Verify: Server running on port 3000
# Check: API endpoints responding
```

### Environment Variables
```bash
# backend/.env should have:
GOOGLE_PLACES_API_KEY=your_key_or_leave_empty
YELP_API_KEY=your_key_or_leave_empty
PORT=3000
```

### Git
```bash
git add .
git commit -m "chore: Prepare v1.0.0-mvp release"
git tag v1.0.0-mvp
git push origin main
git push origin v1.0.0-mvp
```

---

## 🔧 Production Configuration

### Frontend `.env.production`

Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend Production Settings

Update `backend/server.js` (already production-ready):
- ✅ CORS configured
- ✅ Error handling
- ✅ Request logging
- ✅ Environment variables

---

## 🎯 MVP Deployment Strategy

### Phase 1: Local Testing ✅ COMPLETE
- [x] Both servers run locally
- [x] All features working
- [x] Database seeded
- [x] UI/UX polished

### Phase 2: Deploy Backend (Do First)
1. Choose backend host (Railway/Render/VPS)
2. Deploy backend
3. Verify API endpoints work
4. Note backend URL

### Phase 3: Deploy Frontend (Do Second)
1. Update `VITE_API_URL` with backend URL
2. Build frontend (`npm run build`)
3. Deploy to Vercel/Netlify
4. Test in production

### Phase 4: Post-Deployment
1. Test all regions
2. Test activity details
3. Verify images load
4. Test on mobile device
5. Add API keys if needed

---

## 🌐 Recommended MVP Deployment

For this MVP release, I recommend:

### ⭐ Option 1: Render.com (BEST for this app!)

**Both Frontend + Backend on Render:**
- ✅ Free tier for both services
- ✅ Excellent SQLite support with persistent disks
- ✅ Everything in one dashboard
- ✅ Auto-deploy on git push
- ✅ Automatic HTTPS
- ✅ Simple configuration

**See:** [DEPLOY_TO_RENDER.md](DEPLOY_TO_RENDER.md) for complete guide

**Total Cost:** $0 for MVP (free tier)
**Deploy Time:** ~10 minutes

### Option 2: Vercel + Railway

**Frontend:** Vercel (Free)
- Automatic HTTPS
- CDN included
- Fast global deployment

**Backend:** Railway (Free tier)
- Easy SQLite support
- Environment variables
- Automatic deployments

**Total Cost:** $0 for MVP (free tiers)
**Deploy Time:** ~15 minutes

---

## 📊 MVP Success Metrics

After deployment, verify:
- [ ] Frontend loads in < 3 seconds
- [ ] All 20 activities display correctly
- [ ] Region navigation works
- [ ] Activity detail pages load
- [ ] Images display properly
- [ ] Mobile responsive
- [ ] API endpoints respond (even without keys)

---

## 🔄 Quick Deploy Commands

```bash
# Update version and deploy
cd "/Users/m1promachine2022/code/AIDD/Kauai Trip 2025"

# Commit MVP changes
git add .
git commit -m "chore: Release v1.0.0-mvp

- Complete MVP with all core features
- 20 curated activities across 4 regions
- Random rotating beach backgrounds
- Transparent navigation UI
- Smart API caching system
- Single command deployment ready"

# Tag the release
git tag -a v1.0.0-mvp -m "MVP Release v1.0.0-mvp"

# Push to GitHub
git push origin main
git push origin v1.0.0-mvp
```

---

## 🚨 Important Notes for MVP

**What's Included:**
- ✅ All core features working
- ✅ 20 pre-seeded activities
- ✅ Beautiful UI with beach backgrounds
- ✅ Mobile responsive
- ✅ API integration ready (optional)

**What's NOT Included (Future Enhancements):**
- ⏳ User authentication
- ⏳ Favorites system
- ⏳ Interactive maps
- ⏳ Weather integration
- ⏳ User reviews
- ⏳ Activity booking

**This MVP is perfect for:**
- Personal use during Kauai trip
- Sharing with friends/family
- Testing with real users
- Gathering feedback
- Iterating based on usage

---

## 📝 Post-Deployment Checklist

After deploying:
- [ ] Create GitHub release (v1.0.0-mvp)
- [ ] Share URL with test users
- [ ] Monitor for errors
- [ ] Collect feedback
- [ ] Plan v1.1.0 features
- [ ] Document lessons learned

---

**Status: Ready for MVP Deployment! 🎉**

The app is stable, tested, and ready for real-world use. Deploy with confidence! 🌺

