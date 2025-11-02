<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
import { useTemaStore } from './store/config/tema'
import { computed } from 'vue'
import ToastContainer from './components/ToastContainer.vue'

const tema = useTemaStore()
const route = useRoute()
const isLogin = computed(() => route.path.startsWith('/login'))
const dataTema = computed(() => (isLogin.value ? '' : tema.isDarkModePreferred ? 'dark' : 'light'))
</script>

<template>
  <div
    :data-theme="dataTema"
    class="size-full"
    :class="[isLogin ? 'flex justify-center items-center ' : 'flex flex-row']"
  >
    <NavigationMenu class="flex h-full" v-if="!isLogin" />
    <RouterView />
    <ToastContainer />
  </div>
</template>
