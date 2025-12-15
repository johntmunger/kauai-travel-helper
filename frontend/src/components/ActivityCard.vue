<template>
  <router-link
    :to="{
      name: 'activity-detail',
      params: { id: activity.id, region: activity.region.toLowerCase() },
    }"
    class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
  >
    <div class="flex flex-col sm:flex-row h-full sm:h-56">
      <!-- Thumbnail -->
      <div class="sm:w-48 h-48 sm:h-56 flex-shrink-0 overflow-hidden">
        <img
          :src="
            activity.thumbnail_url ||
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'
          "
          :alt="activity.name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 p-5">
        <!-- Header with Category and Region -->
        <div class="flex items-start justify-between mb-2">
          <!-- Category Badges -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in activity.categories"
              :key="category"
              class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
              :class="getCategoryClasses(category)"
            >
              {{ category }}
            </span>
          </div>

          <!-- Region Badge -->
          <span
            class="px-3 py-1 rounded-full text-sm font-semibold text-white flex-shrink-0"
            style="background-color: rgb(153, 153, 153)"
          >
            {{ activity.region }}
          </span>
        </div>

        <!-- Name -->
        <h3
          class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
        >
          {{ activity.name }}
        </h3>

        <!-- Address -->
        <div class="flex items-start text-gray-600 text-sm mb-3">
          <svg
            class="w-4 h-4 mt-0.5 mr-1 flex-shrink-0"
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
        <p class="text-gray-700 text-sm line-clamp-3">
          {{ activity.short_description }}
        </p>

        <!-- View Details Link -->
        <div class="mt-4">
          <span
            class="text-blue-600 font-medium text-sm group-hover:text-blue-700 inline-flex items-center"
          >
            View Details
            <svg
              class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
});

const getCategoryClasses = (category) => {
  const categoryMap = {
    Restaurant: "bg-red-100 text-red-800",
    Outdoor: "bg-green-100 text-green-800",
    Nightlife: "bg-purple-100 text-purple-800",
    "Fish Market": "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  };
  return categoryMap[category] || categoryMap.default;
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
