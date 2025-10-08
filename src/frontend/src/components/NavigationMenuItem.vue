<template>
  <li class="navigation-menu-item">
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
/** Controla o tamanho dos items do menu de navegação. */
/** Junção das classes .size-6. */
.navigation-menu-item svg {
  width: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
  height: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
}
</style>

<script setup lang="ts">
defineProps(['href', 'navigate', 'isActive'])
</script>
