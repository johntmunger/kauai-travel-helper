# Quick Start Guide

Get the Kauai Travel Helper app running in 3 simple steps!

## 🚀 Quick Method: Start Both Servers at Once

From the project root, run:

```bash
npm run dev
```

This will start both the backend and frontend servers simultaneously with colored output!

## Alternative: Start Servers Separately

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
npm start
```

You should see:
```
✓ Database initialized
✓ Server running on http://localhost:3000
✓ API available at http://localhost:3000/api
```

Leave this terminal running.

### Step 2: Start the Frontend

Open a **NEW** terminal and run:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 3: Open the App

Open your browser and go to: **http://localhost:5173**

You should see the Kauai Travel Helper app with a navigation bar showing:
- North Shore
- East Side
- South Shore (default view)
- West Side

## What You Can Do

### Browse Activities
- Click on any region in the top navigation
- See a list of restaurants, outdoor activities, and nightlife
- Filter by category (Restaurant, Outdoor, Nightlife)

### View Activity Details
- Click on any activity card
- See full description, address, and category
- Click "Refresh Live Data" to fetch:
  - Current open/closed status
  - Hours of operation
  - Ratings and reviews
  - Nearby activities

## Optional: Add API Keys

For live data features, add API keys to `backend/.env`:

```env
GOOGLE_PLACES_API_KEY=your_key_here
YELP_API_KEY=your_key_here
PORT=3000
```

See README.md for detailed API setup instructions.

## Troubleshooting

**Backend won't start?**
- Make sure you're in the `backend` folder
- Check that port 3000 is not in use

**Frontend won't start?**
- Make sure you're in the `frontend` folder
- Check that port 5173 is not in use

**Can't see activities?**
- Make sure the backend is running first
- Check the browser console for errors

## Pre-loaded Activities

The app comes with 20 curated activities:

- **South**: Beach House Restaurant, Lawai Beach, Poipu Beach Park, Keoki's Paradise, Spouting Horn
- **North**: Hanalei Bay, Hideaways Beach, Bar Acuda, Na Pali Coast Tour, Tahiti Nui
- **East**: Wailua Falls, Opaekaa Falls, Sleeping Giant Trail, Hukilau Lanai, Lydgate Beach
- **West**: Waimea Canyon, Polihale Beach, Salt Pond Beach, Waimea Brewing, Hanapepe Art Walk

Enjoy exploring Kauai! 🌺

