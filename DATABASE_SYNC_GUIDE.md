# Database Sync Guide

**Quick reference for syncing your local database with live production**

## 🚀 Quick Start

### Sync Your Local Database with Production

```bash
cd backend
npm run sync:live
```

That's it! Your local database will now match production.

---

## 📚 What You Need to Know

### The Problem This Solves

Sometimes your local development database gets out of sync with production:
- ❌ Local has old/test data
- ❌ Production has new activities you don't have locally
- ❌ Local database gets corrupted
- ❌ You want to test with real production data

### The Solution

The `sync:live` command:
1. ✅ Backs up your current local database
2. ✅ Fetches all activities from production
3. ✅ Rebuilds your local database with production data

---

## 🎯 Common Use Cases

### Case 1: "My local data is messed up"

```bash
cd backend
npm run sync:live
```

### Case 2: "I want to test with production data"

```bash
cd backend
npm run sync:live
cd ..
npm run dev
```

### Case 3: "Production has new activities"

```bash
cd backend
npm run sync:live
```

### Case 4: "I need to rollback my database"

```bash
cd backend
npm run db:list-backups  # See available backups
npm run db:restore kauai-backup-XXXXX.db
```

---

## 🔧 Available Commands

### From Backend Directory

| Command | What It Does |
|---------|--------------|
| `npm run sync:live` | Sync from production (with backup) |
| `npm run sync:live:no-backup` | Sync from production (no backup) |
| `npm run db:list-backups` | List all available backups |
| `npm run db:restore [file]` | Restore from a specific backup |

### From Project Root

```bash
cd backend && npm run sync:live
```

---

## 📋 Step-by-Step: Your First Sync

### Step 1: Stop Your Dev Server

If `npm run dev` is running, press `Ctrl+C` to stop it.

### Step 2: Navigate to Backend

```bash
cd backend
```

### Step 3: Run the Sync

```bash
npm run sync:live
```

You'll see output like:

```
╔══════════════════════════════════════════════════════╗
║  Sync Local Database from Live Production           ║
╚══════════════════════════════════════════════════════╝

[1] Backing up current database
✓ Database backed up to: ../database/backups/kauai-backup-1703359800000.db

[2] Fetching data from live API
API URL: https://kauai-backend.onrender.com/api
  → Fetching all activities...
✓ Fetched 42 activities from live API
  → Fetching regions...
✓ Fetched 4 regions from live API

[3] Reseeding local database
  → Clearing existing data...
✓ Cleared existing data
  → Inserting 4 categories...
✓ Inserted 4 categories
  → Inserting 42 activities...
✓ Inserted 42 activities successfully

╔══════════════════════════════════════════════════════╗
║  ✓ Database sync completed successfully!            ║
╚══════════════════════════════════════════════════════╝

Your local database now matches the live production version.

Backup saved at: ../database/backups/kauai-backup-1703359800000.db
```

### Step 4: Restart Dev Server

```bash
cd ..
npm run dev
```

### Step 5: Test

Open http://localhost:5173 and verify the data looks correct!

---

## 🛡️ Safety Features

### Automatic Backups

Every sync creates a backup automatically. You can restore it anytime.

### Backup Storage

Backups are stored in: `backend/database/backups/`

### Restore Safety

When restoring a backup, the script creates a "pre-restore" backup first.

---

## ⚠️ Important Notes

### Production API

The sync fetches from: `https://kauai-backend.onrender.com/api`

### First Request May Be Slow

Render.com free tier "sleeps" after inactivity. The first API request may take 30-60 seconds to wake up the server. Be patient!

### Internet Required

You need an active internet connection to sync from production.

### After Syncing

Always restart your dev server after syncing:

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🐛 Troubleshooting

### "Failed to fetch from live API"

**Check:**
1. Is your internet working?
2. Is production up? Check: https://kauai-backend.onrender.com/api/regions
3. Wait 30-60 seconds for cold start

### "No backups found"

This is normal on first use. The backups directory was just created. Run a sync to create your first backup.

### "Port 3000 already in use" (after sync)

You need to stop your existing dev server first:

```bash
# Press Ctrl+C in the terminal running npm run dev
# Then restart it
npm run dev
```

### Script hangs

Production API might be slow (cold start). Wait up to 60 seconds.

---

## 📁 File Structure

```
backend/
├── database/
│   ├── kauai.db              # Your local database
│   ├── schema.sql            # Database structure
│   ├── seed.sql              # Initial seed data
│   └── backups/              # Backup files
│       ├── .gitkeep
│       └── kauai-backup-*.db # Timestamped backups
├── scripts/
│   ├── sync-from-live.js     # Sync script
│   ├── restore-backup.js     # Restore script
│   └── README.md             # Detailed docs
└── package.json              # Contains npm scripts
```

---

## 🎓 Advanced Usage

### Sync from Custom API

```bash
node scripts/sync-from-live.js --api-url https://staging.example.com/api
```

### Sync Without Backup

```bash
npm run sync:live:no-backup
```

**⚠️ Warning:** Only use this if you're sure you don't need a backup!

### Manual Backup

```bash
cp database/kauai.db database/backups/manual-backup-$(date +%s)000.db
```

### Verify Database After Sync

```bash
sqlite3 database/kauai.db "SELECT COUNT(*) FROM activities;"
sqlite3 database/kauai.db "SELECT COUNT(*) FROM activity_categories;"
```

Expected output:
- Activities: 42 (or current production count)
- Activity categories: 49+ (depends on data)

---

## 📖 Additional Resources

- **Detailed Script Documentation:** `backend/scripts/README.md`
- **Main Project README:** `README.md`
- **Deployment Guide:** `DEPLOY_TO_RENDER.md`
- **Database Schema:** `backend/database/schema.sql`

---

## 💡 Pro Tips

1. **Before Major Changes:** Always run `npm run sync:live` to start with fresh production data

2. **Keep Recent Backups:** Don't delete your most recent 2-3 backups

3. **After Production Updates:** Sync locally to test changes in development

4. **Regular Syncs:** Sync weekly to keep local and production in harmony

5. **Document Changes:** If you make manual database changes, document them!

---

## 🎉 Summary

### The Magic Command

```bash
cd backend && npm run sync:live
```

This one command:
- ✅ Backs up your database
- ✅ Syncs from production
- ✅ Updates all activities
- ✅ Preserves your safety net

### When in Doubt

1. Backup (automatic with sync)
2. Sync from production
3. Test locally
4. Restore if needed (rare)

---

*Happy syncing! 🌺*

---

**Version:** 1.3.1  
**Last Updated:** Dec 23, 2025  
**Production API:** https://kauai-backend.onrender.com/api

