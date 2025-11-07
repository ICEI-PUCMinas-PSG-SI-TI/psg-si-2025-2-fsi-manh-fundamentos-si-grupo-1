<script setup lang="ts">
import { useTemaStore } from '@/store/config/tema'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'

const tema = useTemaStore()
const isChecked = ref(tema.isDarkModePreferred)
watch(isChecked, (novoValor) => tema.setUserDarkMode(novoValor))
</script>

<template>
  <label class="flex cursor-pointer gap-2">
    <SunIcon class="size-6" />
    <input type="checkbox" class="toggle" :checked="tema.isDarkModePreferred" v-model="isChecked" />
    <MoonIcon class="size-6" />
  </label>
</template>
