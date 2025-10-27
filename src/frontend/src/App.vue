<script setup lang="ts">
import { useRouter } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
import { useTemaStore } from './store/config/tema'

const tema = useTemaStore()
const route = useRouter()
</script>

<template>
  <div :data-theme="route.currentRoute.value.path === '/login' ? '' : (tema.isDarkModePreferred ? 'dark' : 'light')"
  :class="[
    'size-full',
    route.currentRoute.value.path === '/login'
      ? 'flex justify-center items-center '
      : 'flex flex-row'
  ]">
    <NavigationMenu class="flex h-full" v-if="route.currentRoute.value.path !=='/login'"/>
    <RouterView />

  </div>
</template>
