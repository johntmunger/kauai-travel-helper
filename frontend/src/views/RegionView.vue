<template>
  <div class="min-h-screen">
    <!-- Activities List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      >
        <p class="text-red-800">{{ error }}</p>
        <button
          @click="fetchActivities"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!activities.length && !isSearching"
        class="text-center py-20"
      >
        <p class="text-gray-600 text-lg">
          No activities found for this region.
        </p>
      </div>

      <!-- Activities Grid -->
      <div v-else>
        <!-- Filter and Search Bar -->
        <div class="mb-6 flex items-center justify-between gap-2">
          <!-- Category Filter or Search Results Count -->
          <div class="flex flex-wrap gap-2 flex-shrink-0">
            <!-- Show "Found X" button when searching -->
            <div
              v-if="isSearching && filteredActivities.length > 0"
              class="px-3 py-1.5 bg-white/70 border border-gray-200 rounded-md text-gray-600 text-sm"
            >
              Found {{ filteredActivities.length }}
            </div>

            <!-- Show filter buttons when NOT searching -->
            <template v-else>
              <button
                @click="selectedCategory = null"
                class="px-4 py-2 text-sm rounded-lg font-medium transition-colors shadow-sm sm:shadow-sm bg-white/70 sm:bg-blue-600 text-gray-700 sm:text-white border border-gray-200 sm:border-0"
              >
                All ({{ activities.length }})
              </button>
              <!-- Hide category buttons on portrait mobile, show on landscape and larger -->
              <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                class="hidden sm:inline-flex px-4 py-2 text-sm rounded-lg font-medium transition-colors shadow-sm"
                :class="
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                "
              >
                {{ category }} ({{ getCountByCategory(category) }})
              </button>
            </template>
          </div>

          <!-- Search Bar -->
          <div class="relative flex-1 min-w-0 max-w-xs ml-auto">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="searchPlaceholder"
              class="w-full pl-9 pr-3 py-2 text-sm bg-white shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Activity Cards or Empty Search State -->
        <div
          v-if="isSearching && filteredActivities.length === 0"
          class="flex justify-center py-20"
        >
          <div
            class="bg-white rounded-lg shadow-md p-8 text-center max-w-md"
            style="opacity: 0.9"
          >
            <p class="text-gray-600 text-lg mb-4">
              No activities match "{{ searchQuery }}"
            </p>
            <button
              @click="searchQuery = ''"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-6">
          <ActivityCard
            v-for="activity in filteredActivities"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ActivityCard from "../components/ActivityCard.vue";
import { getActivitiesByRegion, getAllActivities } from "../services/api";

const route = useRoute();
const activities = ref([]);
const allActivities = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCategory = ref(null);
const searchQuery = ref("");
const windowWidth = ref(window.innerWidth);

// Update window width on resize
const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};
// Responsive placeholder
const searchPlaceholder = computed(() => {
  return windowWidth.value >= 640
    ? "Try 'beach', 'restaurant', or 'Hanalei'..."
    : "Search...";
});

const regionTitle = computed(() => {
  const region = route.params.region;
  const titleMap = {
    north: "North Shore",
    east: "East Side",
    south: "South Shore",
    west: "West Side",
  };
  return titleMap[region?.toLowerCase()] || "Kauai";
});

const categories = computed(() => {
  // Flatten all categories from all activities
  const allCategories = activities.value.flatMap((a) => a.categories || []);
  const uniqueCategories = [...new Set(allCategories)];
  return uniqueCategories.sort();
});

const isSearching = computed(() => searchQuery.value.length > 0);

// Helper function to handle plural search terms
const normalizeForSearch = (text) => {
  return text
    .toLowerCase()
    .replace(/ies$/i, "y") // beaches -> beach
    .replace(/es$/i, "") // beaches -> beach
    .replace(/s$/i, ""); // restaurants -> restaurant
};

const filteredActivities = computed(() => {
  // Use all activities if searching, otherwise current region
  const source = isSearching.value ? allActivities.value : activities.value;

  // Apply search filter
  let results = source;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    const normalizedQuery = normalizeForSearch(query);

    results = results.filter((activity) => {
      const searchableText = [
        activity.name,
        activity.short_description,
        ...(activity.categories || []),
        activity.address,
        activity.region, // Include region for searches like "East", "North", "South", "West"
      ]
        .join(" ")
        .toLowerCase();

      // Check both original and normalized query
      return (
        searchableText.includes(query) ||
        searchableText.includes(normalizedQuery) ||
        normalizeForSearch(searchableText).includes(normalizedQuery)
      );
    });
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

const getCountByCategory = (category) => {
  return activities.value.filter(
    (a) => a.categories && a.categories.includes(category)
  ).length;
};

const fetchActivities = async () => {
  loading.value = true;
  error.value = null;

  try {
    const region = route.params.region;
    // Capitalize first letter for API
    const regionCapitalized = region.charAt(0).toUpperCase() + region.slice(1);
    const response = await getActivitiesByRegion(regionCapitalized);

    if (response.success) {
      activities.value = response.data;
    } else {
      error.value = "Failed to load activities";
    }
  } catch (err) {
    console.error("Error fetching activities:", err);
    error.value = "Unable to load activities. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Watch for search query changes
watch(searchQuery, async (newQuery) => {
  if (newQuery && allActivities.value.length === 0) {
    // Fetch all activities first time user searches
    try {
      const response = await getAllActivities();
      if (response.success) {
        allActivities.value = response.data;
      }
    } catch (err) {
      console.error("Error fetching all activities for search:", err);
    }
  }

  // Clear search when empty
  if (!newQuery) {
    selectedCategory.value = null;
  }
});

// Watch for route changes
watch(
  () => route.params.region,
  () => {
    if (route.params.region) {
      selectedCategory.value = null;
      searchQuery.value = ""; // Clear search on region change
      fetchActivities();
    }
  }
);

onMounted(() => {
  window.addEventListener("resize", updateWidth);
  fetchActivities();
});
</script>
