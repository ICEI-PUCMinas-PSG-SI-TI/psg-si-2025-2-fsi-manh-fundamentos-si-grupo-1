<script setup lang="ts">
import { useTemaStore } from '@/store/config/tema'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

const tema = useTemaStore()
</script>

<template>
  <label class="flex cursor-pointer gap-2">
    <SunIcon class="size-6" />
    <input
      type="checkbox"
      class="toggle"
      :checked="tema.isDarkModePreferred"
      @input="(event) => tema.setUserDarkMode(event.target.checked)"
    />
    <MoonIcon class="size-6" />
  </label>
</template>
