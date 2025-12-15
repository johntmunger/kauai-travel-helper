import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "../database/kauai.db");
const db = new sqlite3.Database(dbPath);

// Initialize database with schema and seed data
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const schemaPath = join(__dirname, "../database/schema.sql");
    const seedPath = join(__dirname, "../database/seed.sql");

    const schema = readFileSync(schemaPath, "utf8");

    db.serialize(() => {
      // Create tables
      db.exec(schema, (err) => {
        if (err) {
          console.error("Error creating schema:", err);
          reject(err);
          return;
        }

        // Check if database is already seeded
        db.get("SELECT COUNT(*) as count FROM activities", (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          // Only seed if database is empty
          if (row.count === 0) {
            const seed = readFileSync(seedPath, "utf8");
            db.exec(seed, (err) => {
              if (err) {
                console.error("Error seeding database:", err);
                reject(err);
                return;
              }
              console.log("Database initialized and seeded successfully");
              resolve();
            });
          } else {
            // Check if categories are linked
            db.get(
              "SELECT COUNT(*) as count FROM activity_categories",
              (err, linkRow) => {
                if (err) {
                  reject(err);
                  return;
                }

                // If activities exist but no category links, reseed
                if (linkRow.count === 0) {
                  const seed = readFileSync(seedPath, "utf8");
                  db.exec(seed, (err) => {
                    if (err) {
                      console.error("Error re-seeding categories:", err);
                      reject(err);
                      return;
                    }
                    console.log("Database categories re-linked successfully");
                    resolve();
                  });
                } else {
                  console.log("Database already seeded");
                  resolve();
                }
              }
            );
          }
        });
      });
    });
  });
}

// Get all regions
export function getAllRegions() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT DISTINCT region FROM activities ORDER BY region",
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// Get all activities (for search)
export function getAllActivities() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT a.*, GROUP_CONCAT(c.name) as categories
       FROM activities a
       LEFT JOIN activity_categories ac ON a.id = ac.activity_id
       LEFT JOIN categories c ON ac.category_id = c.id
       GROUP BY a.id
       ORDER BY a.name`,
      (err, rows) => {
        if (err) reject(err);
        else {
          const activities = rows.map((row) => ({
            ...row,
            categories: row.categories ? row.categories.split(",") : [],
          }));
          resolve(activities);
        }
      }
    );
  });
}

// Get activities by region with their categories
export function getActivitiesByRegion(region) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT a.*, GROUP_CONCAT(c.name) as categories
       FROM activities a
       LEFT JOIN activity_categories ac ON a.id = ac.activity_id
       LEFT JOIN categories c ON ac.category_id = c.id
       WHERE a.region = ?
       GROUP BY a.id
       ORDER BY a.name`,
      [region],
      (err, rows) => {
        if (err) reject(err);
        else {
          // Convert comma-separated categories to array
          const activities = rows.map((row) => ({
            ...row,
            categories: row.categories ? row.categories.split(",") : [],
          }));
          resolve(activities);
        }
      }
    );
  });
}

// Get activity by ID with categories
export function getActivityById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT a.*, GROUP_CONCAT(c.name) as categories
       FROM activities a
       LEFT JOIN activity_categories ac ON a.id = ac.activity_id
       LEFT JOIN categories c ON ac.category_id = c.id
       WHERE a.id = ?
       GROUP BY a.id`,
      [id],
      (err, row) => {
        if (err) reject(err);
        else {
          if (row) {
            row.categories = row.categories ? row.categories.split(",") : [];
          }
          resolve(row);
        }
      }
    );
  });
}

// Get cached activity details
export function getCachedActivityDetails(activityId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM activity_details_cache WHERE activity_id = ?",
      [activityId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

// Cache activity details
export function cacheActivityDetails(activityId, details) {
  return new Promise((resolve, reject) => {
    const {
      hours_json,
      rating,
      review_count,
      is_open,
      nearby_activities_json,
    } = details;

    db.run(
      `INSERT OR REPLACE INTO activity_details_cache 
       (activity_id, hours_json, rating, review_count, is_open, nearby_activities_json, last_fetched)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        activityId,
        hours_json,
        rating,
        review_count,
        is_open,
        nearby_activities_json,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Check if cached data is stale (older than 24 hours)
export function isCacheStale(lastFetched) {
  if (!lastFetched) return true;
  const cacheDate = new Date(lastFetched);
  const now = new Date();
  const hoursDiff = (now - cacheDate) / (1000 * 60 * 60);
  return hoursDiff > 24;
}

export default db;
