# Kauai Travel Helper

**v1.2.0** 🌺

A modern single-page application built with Vue 3 and Node.js/Express to help you discover amazing activities across the four regions of Kauai, Hawaii.

> **Stable Release:** Production-ready with 37 curated activities, multi-category support, and automatic data caching.

## 🌐 Live Demo

**Frontend:** [Online browsewr demo!](https://kauai-travel-helper-frontend.onrender.com/)  
**API:** [https://kauai-backend.onrender.com/api](https://kauai-backend.onrender.com/api)

> **Note:** Replace with your actual Render.com URLs after deployment

## Features

- 🏝️ **Region-based Navigation**: Explore North Shore, East Side, South Shore, and West Side
- 🎨 **Modern UI**: Built with Vue 3 and Tailwind CSS for a responsive, mobile-first experience
- 📍 **Activity Discovery**: Browse restaurants, outdoor activities, and nightlife options
- ⭐ **Live Data**: Real-time hours, ratings, and reviews from Google Places and Yelp APIs
- 💾 **Smart Caching**: Fast loading with SQLite database and intelligent API caching
- 🔍 **Detailed Views**: See hours of operation, reviews, ratings, and nearby activities

## Tech Stack

### Frontend

- **Vue 3** with Composition API
- **Vue Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Vite** for fast development

### Backend

- **Node.js** with Express
- **SQLite** for data persistence
- **Google Places API** for live activity data
- **Yelp Fusion API** for reviews and ratings

## Project Structure

```
kauai-trip-2025/
├── frontend/                 # Vue 3 frontend application
│   ├── src/
│   │   ├── components/      # Reusable Vue components
│   │   │   ├── TopNavigation.vue
│   │   │   └── ActivityCard.vue
│   │   ├── views/           # Page-level components
│   │   │   ├── RegionView.vue
│   │   │   └── ActivityDetailView.vue
│   │   ├── router/          # Vue Router configuration
│   │   ├── services/        # API service layer
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── backend/                 # Express backend API
│   ├── routes/             # API route handlers
│   │   ├── regions.js
│   │   └── activities.js
│   ├── services/           # Business logic
│   │   ├── database.js
│   │   ├── googlePlaces.js
│   │   └── yelpFusion.js
│   ├── database/           # SQLite database
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── kauai.db
│   ├── server.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### 1. Clone or Navigate to Project

```bash
cd "Kauai Trip 2025"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## API Configuration

The application integrates with Google Places API and Yelp Fusion API for live activity data. These are optional but recommended for the best experience.

### Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API** and **Places API (New)**
4. Go to **Credentials** and create an API key
5. (Optional) Restrict the API key to Places API only for security

**Free Tier**: Google provides $200/month free credit (~28,500 Place Details requests)

### Yelp Fusion API Setup

1. Go to [Yelp Fusion](https://fusion.yelp.com/)
2. Create an app to get your API key
3. Copy the API Key

**Free Tier**: 500 API calls per day

### Configure API Keys

Create a `.env` file in the `backend` folder:

```bash
cd backend
cat > .env << EOF
GOOGLE_PLACES_API_KEY=your_google_api_key_here
YELP_API_KEY=your_yelp_api_key_here
PORT=3000
EOF
```

Or manually create `backend/.env` with:

```env
GOOGLE_PLACES_API_KEY=your_google_api_key_here
YELP_API_KEY=your_yelp_api_key_here
PORT=3000
```

**Note**: The app will work without API keys, but live data features (hours, ratings, reviews) won't be available.

## Running the Application

### 🚀 Quick Start: Run Both Servers

From the project root directory:

```bash
npm run dev
```

This will start both the backend and frontend servers simultaneously with colored output!

### Alternative: Start Servers Separately

**Start Backend Server:**

```bash
cd backend
npm start
```

The backend will start on `http://localhost:3000`

For development with auto-reload:

```bash
npm run dev
```

**Start Frontend Development Server:**

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

## API Endpoints

### Backend API

- `GET /api` - API information
- `GET /api/regions` - List all regions
- `GET /api/regions/:region/activities` - Get activities for a region (North, East, South, West)
- `GET /api/activities/:id` - Get activity details (cached)
- `GET /api/activities/:id/live-status` - Refresh live data from APIs

## Pre-seeded Activities

The app comes with 20 curated activities across all four regions:

### South Shore

- Beach House Restaurant
- Lawai Beach
- Poipu Beach Park
- Keoki's Paradise
- Spouting Horn

### North Shore

- Hanalei Bay
- Hideaways Beach
- Bar Acuda
- Na Pali Coast Boat Tour
- Tahiti Nui

### East Side

- Wailua Falls
- Opaekaa Falls
- Sleeping Giant Trail
- Hukilau Lanai
- Lydgate Beach Park

### West Side

- Waimea Canyon
- Polihale Beach
- Salt Pond Beach Park
- Waimea Brewing Company
- Hanapepe Town Friday Night Art Walk

## Development

### Frontend Development

```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend Development

```bash
cd backend
npm start          # Start server
npm run dev        # Start with auto-reload (Node v18.11+)
```

## Caching Strategy

The app uses a hybrid data approach:

1. **Fast Initial Load**: Activities load instantly from SQLite database
2. **Live Data on Demand**: Click "Refresh Live Data" on activity details to fetch:
   - Current open/closed status
   - Hours of operation
   - Latest ratings and reviews
   - Nearby activities
3. **Smart Caching**: Live data is cached for 24 hours to minimize API calls

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Deployment

**Recommended:** Deploy to Render.com (easiest for this app!)  
See **[DEPLOY_TO_RENDER.md](DEPLOY_TO_RENDER.md)** for step-by-step Render.com guide.

**All Options:**
See **[DEPLOYMENT.md](DEPLOYMENT.md)** for comprehensive deployment guide.

**Quick Deployment Options:**

1. ⭐ **Render.com** - Both frontend + backend (recommended, free tier, ~10 min)
2. **Vercel + Railway** - Split deployment (free tier, ~15 min)
3. **VPS with Nginx** - Full control (requires server management)

**MVP Deployment Status:** Ready for production! All core features tested and stable.

## Troubleshooting

### Backend won't start

- Check if port 3000 is already in use
- Verify all dependencies are installed: `npm install`
- Check the SQLite database was created in `backend/database/kauai.db`

### Frontend API calls fail

- Ensure backend is running on `http://localhost:3000`
- Check browser console for CORS errors
- Verify the API URL in `frontend/src/services/api.js`

### API features not working

- Verify API keys are set in `backend/.env`
- Check API key permissions in Google Cloud Console
- Verify you haven't exceeded API rate limits

### Database issues

- Delete `backend/database/kauai.db` and restart backend to recreate
- Check file permissions on the database folder

## License

MIT

## Support

For issues or questions, please check the troubleshooting section above or review the code comments for guidance.

---

**Enjoy exploring Kauai! 🌺**
