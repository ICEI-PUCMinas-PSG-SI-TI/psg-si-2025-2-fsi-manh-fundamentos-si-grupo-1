<template>
  <div class="w-full min-h-screen max-w-full">
    <div class="bg-base-200 md:m-9 mt-4 p-4 rounded-2xl flex flex-col">
      <!-- Filtro -->
      <div class="shrink-0 p-2 mb-4">
        <h3 class="text-lg font-semibold mb-2">Filtrar por Data</h3>

        <div class="flex gap-2">
          <input
            type="date"
            v-model="dataInicio"
            @change="resetarPagina"
            class="input input-bordered"
          />
          <input
            type="date"
            v-model="dataFim"
            @change="resetarPagina"
            class="input input-bordered"
          />
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="flex card card-border bg-base-200 h-full w-full">
        <div class="card-body flex-col h-full gap-4">
          <h2 class="text-left font-bold text-lg">Histórico de Transações</h2>

          <div class="w-full overflow-x-auto rounded-xl">
            <table class="min-w-full text-left divide-y divide-white/20">
              <thead class=" ">
                <tr class="text-xl">
                  <th class="p-4">Data</th>
                  <th class="p-4">Usuário</th>
                  <th class="p-4">Motivo</th>
                  <th class="p-4">Produto</th>
                  <th class="p-4">Quant.</th>
                  <th class="p-4">Origem</th>
                  <th class="p-4">Destino</th>
                  <th class="p-4">Observação</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-white/10">
                <tr v-for="i in movimentacoes" :key="i.id" class="text-md">
                  <td class="py-2 px-2">
                    {{
                      new Date(i.horario).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })
                    }}
                    <br />
                    <span class="opacity-80">
                      {{
                        new Date(i.horario).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      }}
                    </span>
                  </td>
                  <td class="p-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <div
                        class=" w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-black"
                      >
                        {{ i._usuario.nome[0].toUpperCase() }}
                      </div>
                      <span class="font-bold">{{ i._usuario.nome }}</span>

                    </div>
                  </td>
                  <td class="p-4 font-semibold">{{ i.motivo }}</td>
                  <td class="p-4">
                    <span class="font-medium">{{ i._produto.nome }}</span>
                    <br />
                    <span class="badge badge-sm badge-primary mt-1">{{ i._produto.codigo }}</span>
                  </td>
                  <td class="p-4 font-semibold">{{ i.quantidade }}</td>
                  <td class="p-4">{{ i.localOrigem || 'N/A' }}</td>
                  <td class="p-4">{{ i.localDestino || 'N/A' }}</td>
                  <!-- Limit to 80 characters-->
                  <td class="p-4">{{ i.observacao }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginação -->
          <div class="flex justify-center mt-4 lg:justify-end items-center gap-2 join">
            <button
              class="join-item btn btn-neutral"
              :class="paginaAtual === 1 ? 'btn-disabled' : 'border-base-content'"
              @click="pagAnterior"
            >
              Anterior
            </button>
            <button class="join-item btn btn-neutral border-base-content">{{ paginaAtual }}</button>
            <button
              :class="movimentacoes.length < paginaTamanho ? 'btn-disabled' : 'border-base-content'"
              class="join-item btn btn-neutral"
              @click="proxPagina"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ApiMovimentacoes } from '@/api/movimentacoes'
import type { ConsultaMovimentacoesParams, GetConsultaMovimentacaoDto } from '../../../backend'

const paginaAtual = ref(1)
const paginaTamanho = ref(30)

const dataInicio = ref<string | null>(null)
const dataFim = ref<string | null>(null)

const movimentacoes = ref<GetConsultaMovimentacaoDto[]>([])
const api = new ApiMovimentacoes()

/* ============================
      CARREGAR DADOS
============================ */

async function carregarTudo() {
  const filtros: ConsultaMovimentacoesParams = {
    pagina: paginaAtual.value,
    paginaTamanho: paginaTamanho.value,
  }

  if (dataInicio.value) {
    filtros.dataApos = inicioDoDiaUTCIso(dataInicio.value)
  }

  if (dataFim.value) {
    filtros.dataAntes = fimDoDiaUTCIso(dataFim.value)
  }

  const res = await api.obterTodos(filtros)

  if (res.ok && res.responseBody) {
    movimentacoes.value = res.responseBody
  }
}

function proxPagina() {
  if (movimentacoes.value.length < paginaTamanho.value) return
  paginaAtual.value++
  carregarTudo()
}

function pagAnterior() {
  if (paginaAtual.value > 1) {
    paginaAtual.value--
    carregarTudo()
  }
}

function resetarPagina() {
  paginaAtual.value = 1
  carregarTudo()
}

onMounted(() => {
  carregarTudo()
})

function inicioDoDiaUTCIso(dateStr: string): string {
  const [ano, mes, dia] = dateStr.split('-').map(Number)
  const localStart = new Date(ano, mes - 1, dia, 0, 0, 0, 0)
  return localStart.toISOString()
}

function fimDoDiaUTCIso(dateStr: string): string {
  const [ano, mes, dia] = dateStr.split('-').map(Number)
  const localEnd = new Date(ano, mes - 1, dia, 23, 59, 59, 999)
  return localEnd.toISOString()
}
</script>
