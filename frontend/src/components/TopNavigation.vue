<template>
  <nav class="bg-white/70 backdrop-blur-sm shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Title -->
        <router-link 
          to="/south"
          class="flex-shrink-0 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <!-- Pineapple Icon -->
          <svg class="w-8 h-8" viewBox="0 0 64 64" fill="none">
            <!-- Crown/Leaves -->
            <path d="M32 4 L28 12 L32 10 L36 12 Z" fill="#22c55e" />
            <path d="M28 6 L24 14 L28 12 Z" fill="#16a34a" />
            <path d="M36 6 L40 14 L36 12 Z" fill="#16a34a" />
            <path d="M24 8 L20 16 L24 14 Z" fill="#15803d" />
            <path d="M40 8 L44 16 L40 14 Z" fill="#15803d" />

            <!-- Pineapple Body -->
            <ellipse cx="32" cy="38" rx="14" ry="20" fill="#fbbf24" />
            <ellipse cx="32" cy="38" rx="12" ry="18" fill="#f59e0b" />

            <!-- Diamond Pattern -->
            <path
              d="M26 24 L32 28 L38 24 L32 20 Z"
              fill="#d97706"
              opacity="0.3"
            />
            <path
              d="M26 32 L32 36 L38 32 L32 28 Z"
              fill="#d97706"
              opacity="0.3"
            />
            <path
              d="M26 40 L32 44 L38 40 L32 36 Z"
              fill="#d97706"
              opacity="0.3"
            />
            <path
              d="M26 48 L32 52 L38 48 L32 44 Z"
              fill="#d97706"
              opacity="0.3"
            />

            <path
              d="M20 28 L26 32 L32 28 L26 24 Z"
              fill="#d97706"
              opacity="0.3"
            />
            <path
              d="M32 28 L38 32 L44 28 L38 24 Z"
              fill="#d97706"
              opacity="0.3"
            />
            <path
              d="M20 36 L26 40 L32 36 L26 32 Z"
              fill="#d97706"
              opacity="0.3"
            />
            <path
              d="M32 36 L38 40 L44 36 L38 32 Z"
              fill="#d97706"
              opacity="0.3"
            />
          </svg>

          <h1 class="text-2xl font-bold text-gray-800">Kauai Travel Guide</h1>
        </router-link>

        <!-- Region Navigation -->
        <div class="hidden md:flex space-x-1">
          <router-link
            v-for="region in regions"
            :key="region.value"
            :to="`/${region.value.toLowerCase()}`"
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            :class="getRegionClasses(region.value)"
          >
            {{ region.label }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-white/70 backdrop-blur-sm border-t"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          v-for="region in regions"
          :key="region.value"
          :to="`/${region.value.toLowerCase()}`"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg font-medium transition-all duration-200"
          :class="getRegionClasses(region.value)"
        >
          {{ region.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileMenuOpen = ref(false);

const regions = [
  { label: "South Shore", value: "South", color: "region-south" },
  { label: "West Side", value: "West", color: "region-west" },
  { label: "East Side", value: "East", color: "region-east" },
  { label: "North Shore", value: "North", color: "region-north" },
];

const getRegionClasses = (regionValue) => {
  const currentRegion = route.params.region;
  const isActive =
    currentRegion && currentRegion.toLowerCase() === regionValue.toLowerCase();

  // Active state - blue for all regions
  if (isActive) {
    return "bg-blue-500 text-white hover:bg-blue-600";
  }

  // Hover state - blue for all regions
  return "text-gray-700 hover:bg-blue-50 hover:text-blue-700";
};
</script>
