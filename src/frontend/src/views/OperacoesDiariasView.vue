<template>
  <div class="w-full min-h-screen max-w-full">
    <div class="bg-base-200 md:m-9 mt-4 p-4 rounded-2xl flex flex-col">
      <!--Compras, vendas e filtrar por data-->
      <div class="flex flex-wrap gap-6 mb-6 items-start">
        <!-- Select de Motivo -->
        <div class="flex flex-col flex-1 min-w-[200px]">
          <label class="text-sm font-medium mb-2">Tipo de Movimentação</label>
          <select
            class="cursor-pointer select select-bordered w-full rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            v-model="motivo"
            @change="resetarPagina()"
          >
            <option disabled selected>Selecione um tipo</option>
            <option :value="null" selected>Todos</option>
            <option :value="MotivoTransacoes.Compra">{{ MotivoTransacoes.Compra }}</option>
            <option :value="MotivoTransacoes.Venda">{{ MotivoTransacoes.Venda }}</option>
            <option :value="MotivoTransacoes.Devolucao">{{ MotivoTransacoes.Devolucao }}</option>
            <option :value="MotivoTransacoes.Perda">{{ MotivoTransacoes.Perda }}</option>
            <option :value="MotivoTransacoes.Transferencia">
              {{ MotivoTransacoes.Transferencia }}
            </option>
          </select>
        </div>

        <!-- Filtro de Data -->
        <div class="flex flex-col flex-1 min-w-[200px] p-4 rounded-xl">
          <label class="text-sm font-medium mb-3 text-center">Filtrar por data</label>
          <div class="flex items-center gap-4 w-full">
            <input
              type="checkbox"
              v-model="checkBoxFiltro"
              @change="resetarPagina"
              class="checkbox h-6 w-6 rounded-md border-2 border-white checked:bg-green-500 checked:border-green-400 transition-all duration-110"
            />
            <input
              type="date"
              v-model="dataSelecionada"
              @change="carregarMovimentacoesDoDia"
              class="input input-bordered w-full px-3 py-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      <!--div buscar produto, nova movimentação e histórico-->
      <div class="rounded-2xl p-4 flex flex-col flex-1 min-h-[60vh]">
        <!-- Busca + Botão Nova Movimentação -->
        <div class="flex flex-wrap gap-4 justify-between items-center mb-6">
          <!-- Campo de busca -->
          <div class="relative w-full md:w-80 text-white">
            <input
              type="text"
              v-model="produtoFiltro"
              @input="carregarMovimentacoesDoDia"
              placeholder="BUSCAR PRODUTO..."
              class="w-full px-10 py-2 rounded-3xl bg-neutral focus:outline-none"
            />
            <MagnifyingGlassIcon class="w-6 text-white absolute left-2 top-1/2 -translate-y-1/2" />
          </div>

          <!-- Botão Nova Movimentação -->
          <button
            class="cursor-pointer bg-neutral w-full md:w-60 flex justify-center text-white font-semibold px-4 py-2 rounded-xl transition-transform duration-100 hover:scale-[1.03]"
            @click="novaMovimentacao = true"
          >
            <PlusIcon class="w-5 mr-2"></PlusIcon> NOVA MOVIMENTAÇÃO
          </button>
        </div>

        <!-- TABELA  -->
        <h3 class="text-3xl font-semibold mb-4">Histórico</h3>
        <div class="overflow-x-auto overflow-y-hidden flex-1">
          <table class="min-w-full text-left border-t border-white">
            <thead class="sticky top-0 z-10">
              <tr class="text-xl">
                <th class="py-3 px-2">Data/Hora</th>
                <th class="py-3 px-2">Tipo</th>
                <th class="py-3 px-2">Produto</th>
                <th class="py-3 px-2">Qtd</th>
                <th class="py-3 px-2">Usuário</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="i in movimentacoes" :key="i.id" class="text-lg border-b border-stone-500">
                <td class="py-2 px-2">
                  {{
                    new Date(i.horario).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })
                  }}
                  <br />
                  {{
                    new Date(i.horario).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}
                </td>
                <td class="py-2 px-2">{{}}</td>
                <td class="py-2">
                  {{ i._produto.nome }} <br />
                  <span class="badge badge-sm badge-primary">{{ i._produto.codigo }}</span>
                </td>
                <td class="py-2">{{ i.quantidade }}</td>
                <td class="py-2">{{ i._usuario.nome }}</td>
              </tr>
              <tr v-if="movimentacoes.length === 0">
                <td colspan="5" class="py-4 text-center">Nenhuma movimentação encontrada</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-center mt-4 lg:justify-end items-center gap-2 join">
          <button
            class="join-item btn btn-neutral"
            :class="pagina === 1 ? 'btn-disabled' : 'border-base-content'"
            @click="pagAnterior"
          >
            Anterior
          </button>
          <button class="join-item btn btn-neutral border-base-content">{{ pagina }}</button>
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
  <NovaMoviment v-if="novaMovimentacao" v-model="novaMovimentacao"></NovaMoviment>
</template>

<script setup lang="ts">
import { ApiMovimentacoes } from '@/api/movimentacoes'

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline'
import NovaMoviment from '@/components/OpDiarias/NovaMoviment.vue'
import type { GetConsultaMovimentacaoDto } from '../../../backend'
import { onMounted, ref } from 'vue'
import { MotivoTransacoes, type ConsultaMovimentacoesParams } from '../../../backend'

const motivo = ref<MotivoTransacoes | null>(null)
const api = new ApiMovimentacoes()
const dataSelecionada = ref<string>(formatarDataLocalParaInput(new Date()))
const produtoFiltro = ref<string | null>('')
const novaMovimentacao = ref<boolean>(false)
const pagina = ref(1)
const paginaTamanho = ref(100)
const checkBoxFiltro = ref<boolean>(false)
const movimentacoes = ref<GetConsultaMovimentacaoDto[]>([])

async function carregarMovimentacoesDoDia() {
  const inicioDia = inicioDoDiaUTC(dataSelecionada.value)
  const fimDia = fimDoDiaUTC(dataSelecionada.value)
  const filtros = {
    motivo: motivo.value ?? undefined,
    dataApos: inicioDia.toISOString(),
    dataAntes: fimDia.toISOString(),
    pagina: pagina.value,
    paginaTamanho: paginaTamanho.value,
  } as ConsultaMovimentacoesParams

  if (checkBoxFiltro.value) {
    filtros.dataAntes = fimDia.toISOString()
    filtros.dataApos = inicioDia.toISOString()
  }

  const res = await api.obterTodos(filtros)

  if (res.ok && res.responseBody) {
    movimentacoes.value = res.responseBody
  }
}

function inicioDoDiaUTC(dateStr: string) {
  const d = new Date(dateStr)
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0))
}

function fimDoDiaUTC(dateStr: string) {
  const d = new Date(dateStr)
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999))
}

onMounted(async () => {
  await carregarMovimentacoesDoDia() // carrega as movimentações já filtrando pelo tipo e nome
})

function formatarDataLocalParaInput(date: Date) {
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function proxPagina() {
  if (movimentacoes.value.length < paginaTamanho.value) return
  pagina.value++
  carregarMovimentacoesDoDia()
}

function pagAnterior() {
  if (pagina.value > 1) {
    pagina.value--
    carregarMovimentacoesDoDia()
  }
}

function resetarPagina() {
  pagina.value = 1
  carregarMovimentacoesDoDia()
}
</script>
