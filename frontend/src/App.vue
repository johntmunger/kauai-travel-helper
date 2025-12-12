<template>
  <div id="app" class="min-h-screen relative">
    <!-- Background Image with Overlay -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        :style="{
          backgroundImage: `url('${currentBackground}')`,
        }"
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
import { ref, onMounted } from "vue";
import TopNavigation from "./components/TopNavigation.vue";

// Collection of beautiful Kauai beach and water images
const backgroundImages = [
  // Poipu Beach - bright blue water and golden sand
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2070&auto=format&fit=crop",

  // Tropical beach with palm trees
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",

  // Crystal clear water - aerial view
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070&auto=format&fit=crop",

  // Hanalei Bay - sandy beach with turquoise water
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop",

  // Sunset beach scene
  "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=2070&auto=format&fit=crop",
];

const currentBackground = ref("");

// Select a random background on mount
onMounted(() => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  currentBackground.value = backgroundImages[randomIndex];
});
</script>
