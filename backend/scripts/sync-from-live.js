#!/usr/bin/env node

/**
 * Sync Local Database from Live Production
 * 
 * This script:
 * 1. Backs up your current local database
 * 2. Fetches all activities from the live production API
 * 3. Reseeds your local database with the live data
 * 
 * Usage:
 *   node scripts/sync-from-live.js
 *   
 * Options:
 *   --no-backup    Skip creating a backup
 *   --api-url      Custom API URL (default: https://kauai-backend.onrender.com/api)
 */

import axios from 'axios';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const LIVE_API_URL = process.argv.includes('--api-url') 
  ? process.argv[process.argv.indexOf('--api-url') + 1]
  : 'https://kauai-backend.onrender.com/api';
const CREATE_BACKUP = !process.argv.includes('--no-backup');
const DB_PATH = join(__dirname, '../database/kauai.db');
const BACKUP_PATH = join(__dirname, `../database/backups/kauai-backup-${Date.now()}.db`);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[${step}] ${message}`, 'bright');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

// Backup current database
async function backupDatabase() {
  if (!CREATE_BACKUP) {
    logWarning('Skipping backup (--no-backup flag set)');
    return;
  }

  logStep(1, 'Backing up current database');
  
  try {
    // Create backups directory if it doesn't exist
    const backupsDir = join(__dirname, '../database/backups');
    if (!existsSync(backupsDir)) {
      const { mkdirSync } = await import('fs');
      mkdirSync(backupsDir, { recursive: true });
    }

    if (existsSync(DB_PATH)) {
      copyFileSync(DB_PATH, BACKUP_PATH);
      logSuccess(`Database backed up to: ${BACKUP_PATH}`);
    } else {
      logWarning('No existing database found to backup');
    }
  } catch (error) {
    logError(`Backup failed: ${error.message}`);
    throw error;
  }
}

// Fetch data from live API
async function fetchLiveData() {
  logStep(2, 'Fetching data from live API');
  log(`API URL: ${LIVE_API_URL}`, 'blue');

  try {
    // Fetch all activities
    log('  → Fetching all activities...');
    const activitiesResponse = await axios.get(`${LIVE_API_URL}/activities/all`, {
      timeout: 30000,
    });

    if (!activitiesResponse.data.success) {
      throw new Error('Failed to fetch activities from live API');
    }

    const activities = activitiesResponse.data.data;
    logSuccess(`Fetched ${activities.length} activities from live API`);

    // Fetch regions (optional, for validation)
    log('  → Fetching regions...');
    const regionsResponse = await axios.get(`${LIVE_API_URL}/regions`, {
      timeout: 10000,
    });

    if (!regionsResponse.data.success) {
      throw new Error('Failed to fetch regions from live API');
    }

    const regions = regionsResponse.data.data;
    logSuccess(`Fetched ${regions.length} regions from live API`);

    return { activities, regions };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      logError('Request timed out. The live API might be slow or unavailable.');
    } else if (error.response) {
      logError(`API returned error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      logError('No response from live API. Check your internet connection.');
    } else {
      logError(`Error: ${error.message}`);
    }
    throw error;
  }
}

// Clear and reseed local database
async function reseedDatabase(activities) {
  logStep(3, 'Reseeding local database');

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);

    db.serialize(() => {
      log('  → Clearing existing data...');
      
      // Clear existing data
      db.run('DELETE FROM activity_categories', (err) => {
        if (err) {
          logError(`Failed to clear activity_categories: ${err.message}`);
          reject(err);
          return;
        }
      });

      db.run('DELETE FROM activities', (err) => {
        if (err) {
          logError(`Failed to clear activities: ${err.message}`);
          reject(err);
          return;
        }
      });

      db.run('DELETE FROM activity_details_cache', (err) => {
        if (err) {
          logError(`Failed to clear cache: ${err.message}`);
          reject(err);
          return;
        }
      });

      logSuccess('Cleared existing data');

      // Extract unique categories from activities
      const categoriesSet = new Set();
      activities.forEach(activity => {
        if (activity.categories && Array.isArray(activity.categories)) {
          activity.categories.forEach(cat => categoriesSet.add(cat));
        }
      });
      const categories = Array.from(categoriesSet);

      log(`  → Inserting ${categories.length} categories...`);

      // Insert categories
      const categoryIds = {};
      let categoryCount = 0;

      categories.forEach(categoryName => {
        db.run(
          'INSERT OR IGNORE INTO categories (name, display_order) VALUES (?, ?)',
          [categoryName, 0],
          function(err) {
            if (err) {
              logError(`Failed to insert category ${categoryName}: ${err.message}`);
              return;
            }
            
            // Get the category ID
            db.get(
              'SELECT id FROM categories WHERE name = ?',
              [categoryName],
              (err, row) => {
                if (row) {
                  categoryIds[categoryName] = row.id;
                }
                
                categoryCount++;
                if (categoryCount === categories.length) {
                  logSuccess(`Inserted ${categories.length} categories`);
                  insertActivities();
                }
              }
            );
          }
        );
      });

      // Insert activities
      function insertActivities() {
        log(`  → Inserting ${activities.length} activities...`);
        
        let insertedCount = 0;
        let errorCount = 0;

        activities.forEach(activity => {
          db.run(
            `INSERT INTO activities 
             (name, address, region, short_description, thumbnail_url, latitude, longitude, google_place_id, yelp_business_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              activity.name,
              activity.address,
              activity.region,
              activity.short_description || '',
              activity.thumbnail_url || '',
              activity.latitude || null,
              activity.longitude || null,
              activity.google_place_id || null,
              activity.yelp_business_id || null,
            ],
            function(err) {
              if (err) {
                logError(`Failed to insert activity ${activity.name}: ${err.message}`);
                errorCount++;
              } else {
                const activityId = this.lastID;

                // Insert category links
                if (activity.categories && Array.isArray(activity.categories)) {
                  activity.categories.forEach(categoryName => {
                    const categoryId = categoryIds[categoryName];
                    if (categoryId) {
                      db.run(
                        'INSERT INTO activity_categories (activity_id, category_id) VALUES (?, ?)',
                        [activityId, categoryId],
                        (err) => {
                          if (err) {
                            logError(`Failed to link category ${categoryName} to ${activity.name}`);
                          }
                        }
                      );
                    }
                  });
                }

                insertedCount++;
              }

              // Check if all activities processed
              if (insertedCount + errorCount === activities.length) {
                db.close((err) => {
                  if (err) {
                    logError(`Error closing database: ${err.message}`);
                    reject(err);
                  } else {
                    logSuccess(`Inserted ${insertedCount} activities successfully`);
                    if (errorCount > 0) {
                      logWarning(`${errorCount} activities failed to insert`);
                    }
                    resolve();
                  }
                });
              }
            }
          );
        });
      }
    });
  });
}

// Main execution
async function main() {
  log('\n╔══════════════════════════════════════════════════════╗', 'bright');
  log('║  Sync Local Database from Live Production           ║', 'bright');
  log('╚══════════════════════════════════════════════════════╝', 'bright');

  try {
    // Step 1: Backup
    await backupDatabase();

    // Step 2: Fetch live data
    const { activities, regions } = await fetchLiveData();

    // Step 3: Reseed database
    await reseedDatabase(activities);

    // Success!
    log('\n╔══════════════════════════════════════════════════════╗', 'green');
    log('║  ✓ Database sync completed successfully!            ║', 'green');
    log('╚══════════════════════════════════════════════════════╝', 'green');
    log('\nYour local database now matches the live production version.', 'green');
    
    if (CREATE_BACKUP) {
      log(`\nBackup saved at: ${BACKUP_PATH}`, 'blue');
    }

    log('\nNext steps:', 'bright');
    log('  1. Stop your dev server (Ctrl+C)');
    log('  2. Run: npm run dev');
    log('  3. Test the app at http://localhost:5173\n');

    process.exit(0);
  } catch (error) {
    log('\n╔══════════════════════════════════════════════════════╗', 'red');
    log('║  ✗ Database sync failed                              ║', 'red');
    log('╚══════════════════════════════════════════════════════╝', 'red');
    
    if (CREATE_BACKUP && existsSync(BACKUP_PATH)) {
      log(`\nYour backup is safe at: ${BACKUP_PATH}`, 'yellow');
      log('You can restore it if needed by copying it back to kauai.db', 'yellow');
    }

    log(`\nError: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
main();

