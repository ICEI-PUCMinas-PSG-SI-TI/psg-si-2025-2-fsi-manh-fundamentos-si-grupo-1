<template>
  <div class="min-h-full w-full max-w-full">
    <div class="bg-base-200 mt-4 flex flex-col rounded-2xl p-4 md:m-9">
      <!-- Filtro -->
      <div class="mb-4 shrink-0 p-2">
        <h3 class="mb-2 text-lg font-semibold">Filtrar por Data</h3>
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
      <div class="card card-border bg-base-200 flex h-full w-full">
        <div class="card-body h-full flex-col gap-4">
          <h2 class="text-left text-4xl font-bold">Histórico de Transações</h2>

          <div class="w-full overflow-x-auto rounded-xl">
            <table class="min-w-full divide-y divide-white/20 text-left">
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
                  <td class="px-2 py-2">
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
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-black"
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
                  <td class="p-4">
                    {{ i.motivo === MotivoTransacoes.Transferencia ? i.localOrigem : '-' }}
                  </td>
                  <td class="p-4">
                    {{ i.motivo === MotivoTransacoes.Transferencia ? i.localDestino : '-' }}
                  </td>
                  <!-- Limit to 80 characters-->
                  <td class="p-4">{{ i.observacao }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginação -->
          <div class="join mt-4 flex items-center justify-center gap-2 lg:justify-end">
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
import { ApiMovimentacoes } from '@/api/movimentacoes'
import { onMounted, ref } from 'vue'
import {
  MotivoTransacoes,
  type ConsultaMovimentacoesParams,
  type GetConsultaMovimentacaoDto,
} from '../../../backend'

const paginaAtual = ref(1)
const paginaTamanho = ref(30)

const dataInicio = ref<string | null>(null)
const dataFim = ref<string | null>(null)

const transacoes = ref<GetConsultaMovimentacaoDto[]>([])
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
