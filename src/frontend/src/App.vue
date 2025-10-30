<script setup lang="ts">
import NavigationMenu from './components/NavigationMenu.vue'
import { useTemaStore } from './store/config/tema'

const tema = useTemaStore()
</script>

<template>
  <div :data-theme="tema.isDarkModePreferred ? 'dark' : 'light'" class="flex flex-row size-full">
    <NavigationMenu />
    <RouterView />
  </div>
</template>
