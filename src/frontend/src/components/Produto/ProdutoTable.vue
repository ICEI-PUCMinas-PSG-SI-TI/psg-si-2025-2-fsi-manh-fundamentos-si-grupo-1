<template>
  <div class="card bg-base-200 shadow-md rounded-2xl p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Produtos</h3>
      <span class="text-sm opacity-70">Total: {{ produtos?.length || 0 }}</span>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-compact w-full">
        <thead>
          <tr>
            <th>Nome</th>
            <th>SKU</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th class="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in produtos" :key="p.id">
            <td>{{ p.nome }}</td>
            <td>{{ p.sku }}</td>
            <td>{{ p.quantidade_estoque ?? '-' }}</td>
            <td>R$ {{ formatNumber(p.preco_venda) }}</td>
            <td class="text-center">
              <button class="btn btn-ghost btn-sm" @click="$emit('editar', p)">Editar</button>
            </td>
          </tr>
          <tr v-if="!produtos || produtos.length === 0">
            <td colspan="5" class="text-center opacity-60">Nenhum produto cadastrado</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toDisplayString } from 'vue'

const props = defineProps<{
  produtos: any[]
}>()

function formatNumber(v: any) {
  if (v === undefined || v === null) return '-'
  return Number(v).toFixed(2)
}
</script>
