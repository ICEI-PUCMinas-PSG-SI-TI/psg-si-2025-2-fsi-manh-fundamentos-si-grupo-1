<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue'
</script>

<template>
  <div
    id="background"
    class="background </div> m-auto flex h-screen w-screen flex-col items-center justify-center bg-[repeating-linear-gradient(45deg,var(--color-slate-100),var(--color-slate-100)_10px,var(--color-white)_10px,var(--color-white)_20px)]"
  >
    <h1 class="m-8 text-9xl text-black">404</h1>
    <p class="mb-12 text-xl text-black">NÃO ENCONTRADO</p>
    <RouterLink to="/">
      <ButtonComponent>Página inicial</ButtonComponent>
    </RouterLink>
  </div>
</template>
