<template>
  <div class="bg-base-200 border-base-300 rounded-xl border p-4">
    <p>
      <strong>Lote: {{ codigo }}</strong>
    </p>
    <p>Quantidade: {{ quantidade }} unidades</p>
    <p>
      Validade:
      {{
        validade
          ? new Date(validade).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })
          : 'N/A'
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  produtoId: string
  codigo: string
  quantidade: number
  validade?: string | null
}>()
</script>
