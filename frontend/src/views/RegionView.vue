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
      <div v-else-if="!activities.length" class="text-center py-20">
        <p class="text-gray-600 text-lg">
          No activities found for this region.
        </p>
      </div>

      <!-- Activities Grid -->
      <div v-else>
        <!-- Category Filter -->
        <div class="mb-6 flex flex-wrap gap-2">
          <button
            @click="selectedCategory = null"
            class="px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            :class="
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            "
          >
            All ({{ activities.length }})
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            class="px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            :class="
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            "
          >
            {{ category }} ({{ getCountByCategory(category) }})
          </button>
        </div>

        <!-- Activity Cards -->
        <div class="space-y-6">
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
import { getActivitiesByRegion } from "../services/api";

const route = useRoute();
const activities = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCategory = ref(null);

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
  const uniqueCategories = [
    ...new Set(activities.value.map((a) => a.category)),
  ];
  return uniqueCategories.sort();
});

const filteredActivities = computed(() => {
  if (!selectedCategory.value) return activities.value;
  return activities.value.filter((a) => a.category === selectedCategory.value);
});

const getCountByCategory = (category) => {
  return activities.value.filter((a) => a.category === category).length;
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

// Watch for route changes
watch(
  () => route.params.region,
  () => {
    if (route.params.region) {
      selectedCategory.value = null;
      fetchActivities();
    }
  }
);

onMounted(() => {
  fetchActivities();
});
</script>
