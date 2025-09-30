<template>
  <li class="menu-item">
    <a
      class="px-3 py-2 rounded-xl mb-2"
      :class="{ 'menu-active': isActive }"
      :href="href"
      @click="navigate"
    >
      <slot />
    </a>
  </li>
</template>

<style lang="css">
/** Controla o tamanho e cor do ícone dos items do menu de navegação. */
/** Junção das classes .size-6 e .text-white. */
.menu-item svg {
  width: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
  height: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
}
.menu-item a,
.menu-item p,
.menu-item svg {
  color: var(--color-red-white) /* #fff = #ffffff */;
}

.menu-item a {
  --menu-active-bg: oklch(0.31 0.1 146);
  --menu-active-fg: white;
}
</style>

<script setup lang="ts">
defineProps(['href', 'navigate', 'isActive'])
</script>
