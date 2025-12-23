# Database Management Scripts

This directory contains utility scripts for managing your local database and syncing with the live production environment.

## 📋 Available Scripts

### 1. Sync from Live (`sync-from-live.js`)

Syncs your local database with the live production environment by fetching all activities via the production API.

**What it does:**
1. Creates a backup of your current local database
2. Fetches all activities from the live API (`https://kauai-backend.onrender.com/api`)
3. Clears your local database
4. Re-seeds it with the live data

**Usage:**

```bash
# From backend directory
npm run sync:live

# Or with options
node scripts/sync-from-live.js [options]
```

**Options:**
- `--no-backup` - Skip creating a backup before syncing
- `--api-url <url>` - Use a custom API URL instead of the default

**Examples:**

```bash
# Standard sync with backup
npm run sync:live

# Sync without creating a backup
npm run sync:live:no-backup

# Sync from a custom API
node scripts/sync-from-live.js --api-url https://staging-api.example.com/api
```

**When to use:**
- Your local database is out of sync with production
- You want to test with production data locally
- Production has been updated and you need the latest activities
- You're experiencing issues with local data

---

### 2. Restore Backup (`restore-backup.js`)

Restores your local database from a previous backup.

**What it does:**
1. Shows available backups or restores a specific backup
2. Creates a safety backup before restoring
3. Replaces your current database with the backup

**Usage:**

```bash
# List all available backups
npm run db:list-backups

# Restore a specific backup
npm run db:restore backups/kauai-backup-1703359800000.db

# Or use the full path
node scripts/restore-backup.js /full/path/to/backup.db
```

**Examples:**

```bash
# List backups
npm run db:list-backups
# Output:
# Available backups:
# ─────────────────────────────────────────────
# 1. kauai-backup-1703359800000.db
#    Created: Dec 23, 2025, 2:30 PM
#    Size: 245.50 KB

# Restore the most recent backup
npm run db:restore kauai-backup-1703359800000.db
```

**When to use:**
- You want to rollback to a previous database state
- Testing caused issues and you need to restore
- You accidentally synced with wrong data

---

## 🗂️ Backup Management

### Backup Location

All backups are stored in:
```
backend/database/backups/
```

### Backup Naming

Backups are named with timestamps for easy identification:
```
kauai-backup-[timestamp].db
```

Where `[timestamp]` is the Unix timestamp in milliseconds.

### Automatic Backups

Backups are automatically created:
- ✅ Before syncing from live (unless `--no-backup` is used)
- ✅ Before restoring a backup (safety backup named `pre-restore-[timestamp].db`)

### Manual Backups

To manually create a backup:

```bash
# From project root
cp backend/database/kauai.db backend/database/backups/kauai-backup-$(date +%s)000.db

# Or from backend directory
cp database/kauai.db database/backups/kauai-backup-$(date +%s)000.db
```

---

## 🔧 Common Workflows

### Problem: Local database is corrupted or has issues

```bash
cd backend
npm run sync:live
```

This will:
1. Backup your current database (just in case)
2. Fetch fresh data from production
3. Rebuild your local database

---

### Problem: Testing broke the database

```bash
cd backend

# List available backups
npm run db:list-backups

# Restore from most recent backup
npm run db:restore kauai-backup-XXXXX.db
```

---

### Problem: Want to test with production data

```bash
cd backend

# Sync from live
npm run sync:live

# Start dev server
npm start
```

---

### Problem: Production and local are out of sync

```bash
cd backend

# First, verify what's in production
curl https://kauai-backend.onrender.com/api/activities/all

# Then sync
npm run sync:live
```

---

## 🎯 Best Practices

1. **Always create backups before major changes**
   ```bash
   npm run sync:live  # Includes automatic backup
   ```

2. **Keep your backups organized**
   - Old backups can be safely deleted to save space
   - Keep at least one recent backup before syncing

3. **Test after syncing**
   ```bash
   npm run sync:live
   npm start
   # Test at http://localhost:3000/api/activities/all
   ```

4. **Document custom syncs**
   - If using custom API URLs, document why
   - Keep track of what data source was used

5. **Verify data after restore**
   ```bash
   sqlite3 backend/database/kauai.db "SELECT COUNT(*) FROM activities;"
   sqlite3 backend/database/kauai.db "SELECT COUNT(*) FROM activity_categories;"
   ```

---

## 🐛 Troubleshooting

### Issue: "No backups found"

**Solution:** The backups directory doesn't exist yet. Create your first backup:
```bash
mkdir -p backend/database/backups
npm run sync:live
```

### Issue: "Failed to fetch from live API"

**Possible causes:**
1. No internet connection
2. Production API is down
3. API URL is incorrect

**Solution:**
```bash
# Check if production is accessible
curl https://kauai-backend.onrender.com/api/regions

# If it's slow, increase timeout in sync-from-live.js (line 99)
```

### Issue: "Database sync completed but app still shows old data"

**Solution:** Restart your dev server:
```bash
# Stop the server (Ctrl+C)
npm start
```

### Issue: Script hangs or is very slow

**Cause:** Production API on Render.com free tier may be slow on first request (cold start).

**Solution:** Wait 30-60 seconds for the API to wake up, or run the script again.

---

## 📚 Additional Resources

- **Database Schema:** See `backend/database/schema.sql`
- **Seed Data:** See `backend/database/seed.sql`
- **Main README:** See project root `README.md`
- **Deployment Guide:** See `DEPLOY_TO_RENDER.md`

---

## 🤝 Contributing

When adding new database management scripts:

1. Follow the existing script structure
2. Include helpful terminal output with colors
3. Add safety confirmations for destructive operations
4. Create automatic backups before modifications
5. Update this README with usage instructions

---

## 📞 Support

If you encounter issues with these scripts:

1. Check the terminal output for specific error messages
2. Verify your database file exists: `backend/database/kauai.db`
3. Check production API: https://kauai-backend.onrender.com/api
4. Review this documentation for troubleshooting tips

---

*Last updated: v1.3.1*

