<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-20">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800">{{ error }}</p>
        <button
          @click="$router.back()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>

    <!-- Activity Details -->
    <div
      v-else-if="activity"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          class="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              :src="
                activity.thumbnail_url ||
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
              "
              :alt="activity.name"
              class="w-full h-96 object-cover"
            />
          </div>

          <!-- Basic Info -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2"
                  :class="getCategoryClasses(activity.category)"
                >
                  {{ activity.category }}
                </span>
                <h1 class="text-3xl font-bold text-gray-900">
                  {{ activity.name }}
                </h1>
              </div>

              <!-- Region Badge -->
              <span
                class="px-3 py-1 rounded-full text-sm font-semibold text-white"
                :class="getRegionBadgeClass(activity.region)"
              >
                {{ activity.region }}
              </span>
            </div>

            <!-- Address -->
            <div class="flex items-start text-gray-700 mb-4">
              <svg
                class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{{ activity.address }}</span>
            </div>

            <!-- Description -->
            <p class="text-gray-700 leading-relaxed">
              {{ activity.short_description }}
            </p>
          </div>

          <!-- Live Details Section -->
          <div v-if="details" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Additional Information
            </h2>

            <!-- Rating -->
            <div v-if="details.rating" class="mb-4">
              <div class="flex items-center">
                <div class="flex text-yellow-400">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-5 h-5"
                    :class="
                      i <= Math.round(details.rating)
                        ? 'fill-current'
                        : 'fill-gray-300'
                    "
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                    />
                  </svg>
                </div>
                <span class="ml-2 text-gray-700 font-semibold">
                  {{ details.rating }} ({{ details.review_count }} reviews)
                </span>
              </div>
            </div>

            <!-- Hours -->
            <div
              v-if="details.hours && Array.isArray(details.hours)"
              class="mb-4"
            >
              <h3 class="font-semibold text-gray-900 mb-2">
                Hours of Operation
              </h3>
              <ul class="space-y-1 text-gray-700 text-sm">
                <li v-for="(day, index) in details.hours" :key="index">
                  {{ day }}
                </li>
              </ul>
            </div>

            <!-- Reviews -->
            <div v-if="details.reviews && details.reviews.length" class="mt-6">
              <h3 class="font-semibold text-gray-900 mb-3">Recent Reviews</h3>
              <div class="space-y-3">
                <div
                  v-for="(review, index) in details.reviews.slice(0, 3)"
                  :key="index"
                  class="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div class="flex items-center mb-1">
                    <span class="font-medium text-gray-900">{{
                      review.author_name || "Anonymous"
                    }}</span>
                    <span v-if="review.rating" class="ml-2 text-yellow-500"
                      >★ {{ review.rating }}</span
                    >
                  </div>
                  <p class="text-gray-600 text-sm">{{ review.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Status Card -->
          <div v-if="details && details.is_open !== null" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Current Status</h3>

            <div class="flex items-center justify-center py-3">
              <span
                class="w-4 h-4 rounded-full mr-3"
                :class="details.is_open ? 'bg-green-500' : 'bg-red-500'"
              ></span>
              <span
                class="text-lg font-semibold"
                :class="details.is_open ? 'text-green-700' : 'text-red-700'"
              >
                {{ details.is_open ? "Open Now" : "Closed" }}
              </span>
            </div>
          </div>

          <!-- Nearby Activities -->
          <div
            v-if="nearbyActivities && nearbyActivities.length"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h3 class="font-semibold text-gray-900 mb-4">Nearby Places</h3>
            <ul class="space-y-3">
              <li
                v-for="(place, index) in nearbyActivities"
                :key="index"
                class="pb-3 border-b border-gray-200 last:border-0"
              >
                <div class="font-medium text-gray-900">{{ place.name }}</div>
                <div class="text-sm text-gray-600">{{ place.address }}</div>
                <div v-if="place.rating" class="text-sm text-yellow-600 mt-1">
                  ★ {{ place.rating }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getActivityById } from "../services/api";

const route = useRoute();
const activity = ref(null);
const details = ref(null);
const nearbyActivities = ref([]);
const loading = ref(true);
const error = ref(null);

const getCategoryClasses = (category) => {
  const categoryMap = {
    Restaurant: "bg-red-100 text-red-800",
    Outdoor: "bg-green-100 text-green-800",
    Nightlife: "bg-purple-100 text-purple-800",
    default: "bg-gray-100 text-gray-800",
  };
  return categoryMap[category] || categoryMap.default;
};

const getRegionBadgeClass = (region) => {
  const regionMap = {
    North: "bg-blue-500",
    East: "bg-green-500",
    South: "bg-orange-500",
    West: "bg-amber-500",
  };
  return regionMap[region] || "bg-gray-500";
};

const fetchActivity = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getActivityById(route.params.id);

    if (response.success) {
      activity.value = response.data;
      if (response.data.details) {
        details.value = response.data.details;
        nearbyActivities.value = response.data.details.nearby_activities || [];
      }
    } else {
      error.value = "Activity not found";
    }
  } catch (err) {
    console.error("Error fetching activity:", err);
    error.value = "Unable to load activity details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchActivity();
});
</script>
