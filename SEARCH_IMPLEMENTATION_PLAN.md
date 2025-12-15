# v1.3.0 Search Implementation Plan

## Overview

Add client-side search functionality that searches across all 39 activities from all regions, filtering by name, description, categories, and address. Results display mixed regions with existing region badges for context.

## Implementation Steps

### 1. Update Backend API

Add new endpoint to fetch all activities (not region-specific):

- **Endpoint:** `GET /api/activities/all`
- **Returns:** All 39 activities with categories
- **File:** `backend/routes/activities.js`
- **Database function:** Add `getAllActivities()` in `backend/services/database.js`

### 2. Frontend Service Layer

Add search API call in `frontend/src/services/api.js`:

```javascript
export const getAllActivities = async () => {
  const response = await api.get("/activities/all");
  return response.data;
};
```

### 3. Search State Management

In `frontend/src/views/RegionView.vue`:

- Add `searchQuery` reactive ref (stores user input)
- Add `allActivities` ref (for cross-region search)
- Fetch all activities when search is active
- Modify `filteredActivities` computed to handle search + category filter

### 4. Search Logic

Implement filter function:

```javascript
const searchActivities = (activities, query) => {
  if (!query) return activities;

  const searchLower = query.toLowerCase();
  return activities.filter((activity) => {
    return (
      activity.name.toLowerCase().includes(searchLower) ||
      activity.short_description.toLowerCase().includes(searchLower) ||
      activity.categories.some((cat) =>
        cat.toLowerCase().includes(searchLower)
      ) ||
      activity.address.toLowerCase().includes(searchLower)
    );
  });
};
```

### 5. Enable Search Input

In `frontend/src/views/RegionView.vue`:

- Remove `disabled` attribute from input
- Add `v-model="searchQuery"`
- Add `@input` handler for real-time search
- Add clear button (X) to reset search

### 6. UI Updates

- Show "Searching all regions..." text when search is active
- Display count: "Found X activities" (or "Showing X activities in [Region]")
- Empty state: "No activities match your search"
- Region badges already implemented ✅

### 7. Search Behavior

**When user types:**

1. Fetch all activities (if not already loaded)
2. Filter by search query
3. Apply category filter (if any)
4. Display mixed regional results
5. Region badges show context

**When search is cleared:**

- Return to current region view
- Show regional activities only

## Key Features

✅ Searches across all 39 activities  
✅ Mixed regional results  
✅ Region badges show context  
✅ Works with category filters (combined)  
✅ Real-time filtering  
✅ Mobile responsive  
✅ No highlighting (clean results)

## Search Fields

**Primary matches:**

- `activity.name` - "Beach House Restaurant"
- `activity.categories[]` - ["Restaurant", "Fish Market"]

**Secondary matches:**

- `activity.short_description` - "oceanfront dining", "snorkeling"
- `activity.address` - "Poipu", "Koloa", "Hanalei"

## Example Searches

**Search: "beach"**

- Returns: Beach House Restaurant, Lawai Beach, Poipu Beach, etc.
- Mixed regions: South, North, East, West
- Each with region badge

**Search: "fish"**

- Returns: All Fish Markets
- Koloa Fish Market, The Fish Express, etc.
- Region badges show location

**Search: "hanalei"**

- Returns: All activities in Hanalei area
- Bar Acuda, Tahiti Nui, Hanalei Bay, etc.
- All marked with "North" badge

## Technical Implementation

### Backend Changes

**File:** `backend/services/database.js`

```javascript
// Add new function
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
```

**File:** `backend/routes/activities.js`

```javascript
// Add new route
router.get("/all", async (req, res) => {
  try {
    const activities = await getAllActivities();
    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching all activities:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch activities",
    });
  }
});
```

### Frontend Changes

**File:** `frontend/src/views/RegionView.vue`

**Add reactive state:**

```javascript
const searchQuery = ref("");
const allActivities = ref([]);
const isSearching = computed(() => searchQuery.value.length > 0);
```

**Update filteredActivities:**

```javascript
const filteredActivities = computed(() => {
  // Use all activities if searching, otherwise current region
  const source = isSearching.value ? allActivities.value : activities.value;

  // Apply search filter
  let results = source;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (activity) =>
        activity.name.toLowerCase().includes(query) ||
        activity.short_description.toLowerCase().includes(query) ||
        activity.categories.some((cat) => cat.toLowerCase().includes(query)) ||
        activity.address.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    results = results.filter(
      (activity) =>
        activity.categories &&
        activity.categories.includes(selectedCategory.value)
    );
  }

  return results;
});
```

**Fetch all activities when searching:**

```javascript
watch(searchQuery, async (newQuery) => {
  if (newQuery && allActivities.value.length === 0) {
    // Fetch all activities first time user searches
    const response = await getAllActivities();
    if (response.success) {
      allActivities.value = response.data;
    }
  }
});
```

## UI Enhancements

**Show context when searching:**

```vue
<div
  v-if="isSearching && filteredActivities.length > 0"
  class="mb-4 text-gray-600"
>
  Found {{ filteredActivities.length }} activities across all regions
</div>

<div
  v-if="isSearching && filteredActivities.length === 0"
  class="text-center py-20"
>
  <p class="text-gray-600 text-lg">No activities match "{{ searchQuery }}"</p>
</div>
```

**Clear search button:**

```vue
<!-- Add X button in search input -->
<button
  v-if="searchQuery"
  @click="searchQuery = ''"
  class="absolute inset-y-0 right-0 pr-3 flex items-center"
>
  <svg class="w-4 h-4 text-gray-400 hover:text-gray-600">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
```

## Performance Considerations

**Data Loading:**

- Regional view: Loads 6-12 activities (current behavior)
- Search activated: Loads all 39 activities once
- Cached in memory for session
- Total payload: ~50KB (minimal)

**Search Performance:**

- Client-side JavaScript filter
- Instant results (no network delay)
- Handles 39 activities effortlessly
- Could scale to 100+ activities easily

## Testing Checklist

- [ ] Search finds activities by name
- [ ] Search finds activities by description keywords
- [ ] Search finds activities by category
- [ ] Search finds activities by address/location
- [ ] Combined search + category filter works
- [ ] Empty search shows all results
- [ ] Clear button works
- [ ] Region badges display correctly
- [ ] Mobile responsive
- [ ] No console errors

## Future Enhancements (v1.4.0+)

- Fuzzy matching (typo tolerance)
- Search suggestions/autocomplete
- Recent searches
- Popular searches
- Filter by multiple regions
- Sort results by relevance

## Version Strategy

**v1.2.0** (Current) - Search placeholder  
**v1.3.0** (This plan) - Functional search  
**v1.4.0** (Future) - Enhanced search features

---

**Estimated Implementation Time:** 30-45 minutes  
**Complexity:** Low (straightforward client-side filtering)  
**Risk:** Low (no breaking changes, additive feature)
