<template>
  <div id="app" class="min-h-screen relative">
    <!-- Background Image with Overlay -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="
          background-image: url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2070&auto=format&fit=crop');
        "
      ></div>
      <!-- Gradient overlay for better readability -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/20"
      ></div>
    </div>

    <!-- Content -->
    <TopNavigation />
    <router-view />
  </div>
</template>

<script setup>
import TopNavigation from "./components/TopNavigation.vue";
</script>
