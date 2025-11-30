<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useTemaStore } from './store/config/tema'

const tema = useTemaStore()
const route = useRoute()
const showMenu = computed(
  () => route.name !== 'login' && route.name !== 'loading' && route.name !== '404',
)
const dataTema = computed(() =>
  showMenu.value ? (tema.isDarkModePreferred ? 'dark' : 'light') : '',
)
</script>

<template>
  <div
    :data-theme="dataTema"
    class="size-full"
    :class="[showMenu ? 'flex flex-row' : 'flex justify-center items-center ']"
  >
    <NavigationMenu class="flex h-full" v-if="showMenu" />
    <RouterView class="relative" />
    <ToastContainer />
  </div>
</template>
