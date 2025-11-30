<template>
  <div class="flex flex-col h-screen w-screen p-4 overflow-y-auto">
    <div class="shrink-0 p-2 mb-4">
      <h3 class="text-lg font-semibold mb-2">Filtrar por Data</h3>
      <div class="flex gap-2">
        <input type="date" v-model="dataInicio" class="input input-bordered" />
        <input type="date" v-model="dataFim" class="input input-bordered" />
      </div>
    </div>

    <div class="flex card card-border bg-base-200 h-full w-full">
      <div class="card-body flex-col h-full gap-4">
        <h2 class="text-left text-4xl font-bold">Histórico de Transações</h2>
        <MovTable :movimentacoes="transacoesPaginadas" class="flex-1 overflow-y-auto" />
        <div class="flex justify-end items-center gap-2 join">
          <button
            class="join-item btn btn-neutral"
            :class="paginaAtual === 1 ? 'btn-disabled' : 'border-base-content'"
            @click="paginaAtual--"
          >
            Anterior
          </button>
          <button class="join-item btn btn-neutral border-base-content">{{ paginaAtual }}</button>
          <button
            :class="paginaAtual >= totalPaginas ? 'btn-disabled' : 'border-base-content'"
            class="join-item btn btn-neutral"
            @click="paginaAtual++"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MovTable from '@/components/HistoricoMov/Table/MovTable.vue'
import { ref, computed } from 'vue'
import type { GetConsultaMovimentacaoDto } from '../../../backend'
// import { onMounted } from 'vue'

/* === Formatações === */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const transacoes = ref<GetConsultaMovimentacaoDto[]>([])
/*
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5173/api/v1/transacoes')
    if (!res.ok) throw new Error('Erro ao buscar transações')
    transacoes.value = await res.json()
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
  }
})
    console.error(error)
  }
})
*/

const paginaAtual = ref(1)
const itensPorPagina = 8

const dataInicio = ref<string | null>(null)
const dataFim = ref<string | null>(null)

const transacoesFiltradas = computed(() => {
  return transacoes.value.filter((t) => {
    const dataTransacao = new Date(t.horario)
    const inicio = dataInicio.value ? new Date(dataInicio.value) : null
    const fim = dataFim.value ? new Date(dataFim.value) : null

    if (inicio && dataTransacao < inicio) return false
    if (fim && dataTransacao > fim) return false
    return true
  })
})

const transacoesPaginadas = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return transacoesFiltradas.value.slice(inicio, inicio + itensPorPagina)
})

const totalPaginas = computed(() => Math.ceil(transacoesFiltradas.value.length / itensPorPagina))
</script>
