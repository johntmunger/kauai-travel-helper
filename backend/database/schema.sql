-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    region TEXT NOT NULL CHECK(region IN ('North', 'East', 'South', 'West')),
    short_description TEXT,
    thumbnail_url TEXT,
    latitude REAL,
    longitude REAL,
    google_place_id TEXT,
    yelp_business_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0
);

-- Activity Categories junction table (many-to-many)
CREATE TABLE IF NOT EXISTS activity_categories (
    activity_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (activity_id, category_id),
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT OR IGNORE INTO categories (name, display_order) VALUES
('Restaurant', 1),
('Outdoor', 2),
('Nightlife', 3),
('Fish Market', 4);

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
CREATE INDEX IF NOT EXISTS idx_activity_categories_activity_id ON activity_categories(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_categories_category_id ON activity_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_activity_details_cache_activity_id ON activity_details_cache(activity_id);

