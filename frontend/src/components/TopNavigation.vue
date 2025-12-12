<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Title -->
        <div class="flex-shrink-0">
          <h1 class="text-2xl font-bold text-gray-800">Kauai Guide</h1>
        </div>
        
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
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const mobileMenuOpen = ref(false);

const regions = [
  { label: 'North Shore', value: 'North', color: 'region-north' },
  { label: 'East Side', value: 'East', color: 'region-east' },
  { label: 'South Shore', value: 'South', color: 'region-south' },
  { label: 'West Side', value: 'West', color: 'region-west' },
];

const getRegionClasses = (regionValue) => {
  const currentRegion = route.params.region;
  const isActive = currentRegion && currentRegion.toLowerCase() === regionValue.toLowerCase();
  
  const colorMap = {
    North: 'hover:bg-blue-50 hover:text-blue-700',
    East: 'hover:bg-green-50 hover:text-green-700',
    South: 'hover:bg-orange-50 hover:text-orange-700',
    West: 'hover:bg-amber-50 hover:text-amber-700',
  };

  const activeColorMap = {
    North: 'bg-blue-500 text-white hover:bg-blue-600',
    East: 'bg-green-500 text-white hover:bg-green-600',
    South: 'bg-orange-500 text-white hover:bg-orange-600',
    West: 'bg-amber-500 text-white hover:bg-amber-600',
  };

  if (isActive) {
    return activeColorMap[regionValue];
  }
  
  return `text-gray-700 ${colorMap[regionValue]}`;
};
</script>

