<template>
  <div class="mx-auto flex max-w-4xl flex-col justify-center p-4">
    <!-- Perfil do usuário -->
    <ConfigUsuario />
    <!-- Configurações do sistema -->
    <ConfigSistema />
    <!-- Categorias -->
    <ConfigCategoria />
    <!-- Unidades de medida -->
    <ConfigUnidade />
  </div>
</template>

<script setup lang="ts">
import ConfigCategoria from '@/components/ConfigView/ConfigCategoria.vue'
import ConfigSistema from '@/components/ConfigView/ConfigSistema.vue'
import ConfigUnidade from '@/components/ConfigView/ConfigUnidade.vue'
import ConfigUsuario from '@/components/ConfigView/ConfigUsuario.vue'
</script>
