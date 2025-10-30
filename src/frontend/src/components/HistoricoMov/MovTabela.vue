<template>
  <div class="mb-10 ml-10">
  <!-- Título centralizado -->
  <h3 class="text-lg font-semibold  mb-2 ">Filtrar por Data</h3>

  <!-- Inputs alinhados à esquerda -->
  <div class="flex gap-2">
    <input type="date" v-model="dataInicio" class="input input-bordered" />
    <input type="date" v-model="dataFim" class="input input-bordered" />
  </div>
</div>





  <div class="flex flex-col h-full gap-4 bg-base-200 rounded-2xl p-6 shadow-md m-8 mb-3">
    <h2 class="text-left text-4xl font-bold mb-4">Tabela de Histórico</h2>
    <div class="flex-1 overflow-x-auto overflow-y-auto max-h-screen">
      <table class="table w-full">
        <thead class="sticky top-0 z-10 bg-base-200 border-b-2 border-base-500">
          <tr class="text-base-content text-xl">
            <th>Data</th>
            <th>Tipo</th>
            <th>Produto ID</th>
            <th>Quantidade</th>
            <th>Usuário ID</th>
            <th>Origem</th>
            <th>Destino</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="t in transacoesPaginas"
            :key="t.id"
            class="text-lg hover:bg-base-100 transition-colors duration-200"
          >
            <td>{{ formatarData(t.data_hora) }}</td>
            <td>{{ t.tipo }}</td>
            <td>{{ t.produto_id }}</td>
            <td>{{ t.quantidade }}</td>
            <td>{{ t.usuario_id }}</td>
            <td>{{ t.local_origem_id }}</td>
            <td>{{ t.local_destino_id }}</td>
            <td>{{ t.observacao }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-end items-center gap-2 p-2">
      <button
        class="btn btn-outline"
        :disabled="paginaAtual === 1"
        @click="paginaAtual--"
        :style="{
          backgroundColor: 'oklch(39% 0.095 152.535)',
          color: paginaAtual === 1 ? 'gray' : 'white',
        }"
      >
        Anterior
      </button>

      <span
        class="btn btn-outline px-2 rounded-lg"
        :style="{ backgroundColor: 'oklch(39% 0.095 152.535)', color: 'white' }"
        >{{ paginaAtual }}</span
      >

      <button
        class="btn btn-outline"
        :disabled="paginaAtual >= totalPaginas"
        @click="paginaAtual++"
        :style="{
          backgroundColor: 'oklch(39% 0.095 152.535)',
          color: paginaAtual >= totalPaginas ? 'gray' : 'white',
        }"
      >
        Próximo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Transacao {
  id: string
  produto_id: string
  usuario_id: string
  lote_id: string
  tipo: number
  quantidade: number
  data_hora: string
  local_origem_id: string
  local_destino_id: string
  observacao: string
}

/* === Formatações === */
function formatarData(dataISO: string): string {
  const data = new Date(dataISO)
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const transacoes = ref<Transacao[]>([])
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/transacoes')
    if (!response.ok) throw new Error('Erro ao carregar informações')
    transacoes.value = await response.json()
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
  }
})

const paginaAtual = ref(1)
const itensPorPagina = 5

const dataInicio = ref<string | null>(null)
const dataFim = ref<string | null>(null)

const transacoesFiltradas = computed(() => {
  return transacoes.value.filter((t) => {
    const dataTransacao = new Date(t.data_hora)
    const inicio = dataInicio.value ? new Date(dataInicio.value) : null
    const fim = dataFim.value ? new Date(dataFim.value) : null

    if (inicio && dataTransacao < inicio) return false
    if (fim && dataTransacao > fim) return false
    return true
  })
})

const transacoesPaginas = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return transacoesFiltradas.value.slice(inicio, inicio + itensPorPagina)
})

const totalPaginas = computed(() => {
  return Math.ceil(transacoesFiltradas.value.length / itensPorPagina)
})
</script>
