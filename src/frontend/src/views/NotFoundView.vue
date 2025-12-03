<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue'
</script>

<template>
  <div
    id="background"
    class="background h-full w-full m-auto flex flex-col justify-center items-center bg-[repeating-linear-gradient(45deg,var(--color-slate-100),var(--color-slate-100)_10px,var(--color-white)_10px,var(--color-white)_20px)] </div>"
  >
    <h1 class="text-9xl m-8 text-black">404</h1>
    <p class="text-xl mb-12 text-black">NÃO ENCONTRADO</p>
    <RouterLink to="/">
      <ButtonComponent>Página inicial</ButtonComponent>
    </RouterLink>
  </div>
</template>
