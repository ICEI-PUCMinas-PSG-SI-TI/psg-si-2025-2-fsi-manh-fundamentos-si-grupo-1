<script setup lang="ts">
import NavigationMenu from './components/NavigationMenu.vue'
</script>

<template>
  <div class="flex flex-row h-full w-full">
    <div class="flex h-full">
      <NavigationMenu />
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
