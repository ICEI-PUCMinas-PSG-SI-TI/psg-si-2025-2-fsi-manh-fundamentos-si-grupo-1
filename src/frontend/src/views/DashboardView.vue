<template>
  <div class="min-h-screen w-screen bg-white p-8">
    <!-- Título -->
    <h1 class="text-3xl font-bold mb-8">DASHBOARD</h1>

    <!-- Cards de resumo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="border-2 border-green-400 rounded-lg p-6 text-center shadow-sm">
        <p class="text-4xl font-bold text-gray-900">320</p>
        <p class="text-sm text-gray-500">PRODUTOS CADASTRADOS</p>
      </div>

      <div class="border-2 border-green-400 rounded-lg p-6 text-center shadow-sm">
        <p class="text-4xl font-bold text-gray-900">45</p>
        <p class="text-sm text-gray-500">ENTRADAS DO MÊS</p>
      </div>

      <div class="border-2 border-green-400 rounded-lg p-6 text-center shadow-sm">
        <p class="text-4xl font-bold text-gray-900">32</p>
        <p class="text-sm text-gray-500">SAÍDAS DO MÊS</p>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="bg-gray-50 border rounded-lg p-6 mb-10">
      <h2 class="text-lg font-semibold mb-4">Movimentações recentes</h2>
      <canvas id="graficoMovimentacoes" class="w-full h-48"></canvas>
    </div>

    <!-- Tabela -->
    <div class="bg-gray-50 border rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Últimas movimentações</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b text-left">
            <th class="p-2">Produto</th>
            <th class="p-2">Tipo</th>
            <th class="p-2">Data</th>
            <th class="p-2">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in refMov" :key="mov.id" class="border-b hover:bg-gray-100">
            <td class="p-2">{{ mov.produtoId }}</td>
            <td class="p-2" :class="mov.motivo === 'Entrada' ? 'text-green-700' : 'text-red-700'">
              {{ mov.motivo }}
            </td>
            <td class="p-2">{{ new Date(mov.horario).toLocaleDateString() }}</td>
            <td class="p-2">{{ mov.quantidade }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import Chart from 'chart.js/auto'
import { ApiMovimentacoes } from '@/api/movimentacoes'

//

const apiMovimentacoes = new ApiMovimentacoes()
const refMov: Ref<
  {
    id: string
    produtoId: string
    usuarioId: string
    loteId: string
    motivo: string
    quantidade: number
    horario: string
    localOrigem: string
    localDestino: string
    observacao: string
  }[]
> = ref([])

async function obterMovimentacoes() {
  const res = await apiMovimentacoes.obterTodos()
  if (res.ok && res.responseBody) {
    refMov.value = res.responseBody as []
  }
}

obterMovimentacoes()

//

onMounted(() => {
  const graf = document.getElementById('graficoMovimentacoes')! as HTMLCanvasElement
  const ctx = graf.getContext('2d')
  new Chart(ctx!, {
    type: 'line',
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Movimentações',
          data: [5, 8, 6, 9, 7, 4, 9],
          borderColor: 'rgba(16, 185, 129, 1)', // verde
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2,
          },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  })
})
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
