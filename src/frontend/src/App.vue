<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useTemaStore } from './store/config/tema'

const tema = useTemaStore()
const route = useRoute()
const mostrarMenu = computed(
  () => route.name !== 'login' && route.name !== 'loading' && route.name !== '404',
)
const dataTema = computed(() =>
  mostrarMenu.value ? (tema.isDarkModePreferred ? 'dark' : 'light') : '',
)
</script>

<template>
  <div
    :data-theme="dataTema"
    class="size-full"
    :class="[mostrarMenu ? 'flex flex-row' : 'flex items-center justify-center']"
  >
    <div class="fixed top-0 bottom-0 left-0 z-5 h-full w-64 max-w-64 overflow-y-auto">
      <NavigationMenu v-if="mostrarMenu" />
    </div>
    <div :class="{ 'ps-64': mostrarMenu }" class="h-screen w-screen overflow-y-auto">
      <RouterView class="relative" />
    </div>
    <ToastContainer />
  </div>
</template>
