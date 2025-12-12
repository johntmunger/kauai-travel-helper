<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <TopNavigation />
    <router-view />
  </div>
</template>

<script setup>
import TopNavigation from './components/TopNavigation.vue';
</script>
