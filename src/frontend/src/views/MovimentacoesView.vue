<template>
  <div class="w-full h-screen flex flex-col">
    <MovHeader />
    <div class="flex-1 overflow-x-auto overflow-y-auto p-6">
      <MovTabela />
    </div>
  </div>
</template>

<script setup lang="ts">
import MovHeader from '@/components/HistoricoMov/MovHeader.vue';
import MovTabela from '@/components/HistoricoMov/MovTabela.vue';
</script>
