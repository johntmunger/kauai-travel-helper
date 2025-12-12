-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    region TEXT NOT NULL CHECK(region IN ('North', 'East', 'South', 'West')),
    category TEXT NOT NULL,
    short_description TEXT,
    thumbnail_url TEXT,
    latitude REAL,
    longitude REAL,
    google_place_id TEXT,
    yelp_business_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity details cache table
CREATE TABLE IF NOT EXISTS activity_details_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER NOT NULL,
    hours_json TEXT,
    rating REAL,
    review_count INTEGER,
    is_open INTEGER,
    nearby_activities_json TEXT,
    last_fetched DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_activities_region ON activities(region);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activity_details_cache_activity_id ON activity_details_cache(activity_id);

