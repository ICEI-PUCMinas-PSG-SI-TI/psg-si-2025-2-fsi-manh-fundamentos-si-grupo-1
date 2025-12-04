<template>
  <div class="w-full min-h-screen max-w-full">
    <div class="bg-base-200 md:m-9 mt-4 p-4 rounded-2xl flex flex-col">
      <!--Compras, vendas e filtrar por data-->
      <div class="flex flex-wrap gap-6 mb-6 items-start">
        <!-- Select de Motivo -->
        <div class="flex flex-col flex-1 min-w-[200px]">
          <label class="text-sm font-medium mb-2">Tipo de Movimentação</label>
          <select
            class="cursor-pointer select select-bordered w-full bg-white text-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary"
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
        <div class="flex flex-col flex-1 min-w-[200px]">
          <label class="text-sm font-medium mb-3">Filtrar por data</label>
          <div class="flex items-center gap-4 w-full">
            <input
              type="checkbox"
              v-model="checkBoxFiltro"
              @change="resetarPagina"
              class="checkbox h-6 w-6 rounded-md border-2 checked:bg-green-500 checked:border-green-400 transition-all duration-110"
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
          <div class="relative w-full md:w-80">
            <input
              type="text"
              v-model="produtoFiltro"
              @input="carregarMovimentacoesDoDia"
              placeholder="BUSCAR PRODUTO..."
              class="w-full px-10 py-2 rounded-3xl bg-white text-black focus:outline-none"
            />
            <MagnifyingGlassIcon class="w-6 text-black absolute left-2 top-1/2 -translate-y-1/2" />
          </div>

          <!-- Botão Nova Movimentação -->
          <button
            class="cursor-pointer bg-white w-full md:w-60 flex justify-center text-black font-semibold px-4 py-2 rounded-xl transition-transform duration-100 hover:scale-[1.03]"
            @click="novaMovimentacao = true"
          >
            <PlusIcon class="w-5 mr-2"></PlusIcon> NOVA MOVIMENTAÇÃO
          </button>
        </div>

        <!-- TABELA  -->
        <h3 class="text-3xl font-semibold mb-4">Histórico</h3>
        <div class="w-full overflow-x-auto rounded-xl">
          <table class="min-w-full text-left divide-y divide-white/20">
            <thead class=" ">
              <tr class="text-xl">
                <th class="p-3">Data/Hora</th>
                <th class="p-3">Motivo</th>
                <th class="p-3">Produto</th>
                <th class="p-3">Origem</th>
                <th class="p-3">Destino</th>
                <th class="p-3">Qtd</th>
                <th class="p-3">Usuário</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-white/10">
              <tr v-for="i in movimentacoes" :key="i.id" class="text-lg">
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

                <td class="p-3 font-bold">{{ i.motivo }}</td>

                <td class="p-3">
                  <span class="font-medium">{{ i._produto.nome }}</span>
                  <br />
                  <span class="badge badge-sm badge-primary mt-1">{{ i._produto.codigo }}</span>
                </td>

                <td class="p-3">
                  <span class="opacity-90">{{
                    i.motivo === MotivoTransacoes.Transferencia ? i.localOrigem : '-'
                  }}</span>
                </td>

                <td class="p-3">
                  <span class="opacity-90">{{
                    i.motivo === MotivoTransacoes.Transferencia ? i.localDestino : '-'
                  }}</span>
                </td>
                <td class="p-3 font-semibold">{{ i.quantidade }}</td>

                <td class="p-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-black"
                    >
                      {{ i._usuario.nome[0].toUpperCase() }}
                    </div>
                    {{ i._usuario.nome }}
                  </div>
                </td>
              </tr>
              <tr v-if="movimentacoes.length === 0">
                <td colspan="7" class="p-4 text-center opacity-60">
                  Nenhuma movimentação encontrada
                </td>
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
  <NovaMoviment
    v-if="novaMovimentacao"
    v-model="novaMovimentacao"
    @atualizar="carregarMovimentacoesDoDia"
  ></NovaMoviment>
</template>

<script setup lang="ts">
import { ApiMovimentacoes } from '@/api/movimentacoes'

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline'
import NovaMoviment from '@/components/OpDiarias/NovaMoviment.vue'
import type { GetConsultaMovimentacaoDto } from '../../../backend'
import { onMounted, ref, watch } from 'vue'
import { MotivoTransacoes, type ConsultaMovimentacoesParams } from '../../../backend'

const motivo = ref<MotivoTransacoes | null>(null)
const api = new ApiMovimentacoes()
const dataSelecionada = ref<string>(formatarDataLocalParaInput(new Date()))
const produtoFiltro = ref<string | null>('')
const novaMovimentacao = ref<boolean>(false)
const pagina = ref(1)
const paginaTamanho = ref(30)
const checkBoxFiltro = ref<boolean>(false)
const movimentacoes = ref<GetConsultaMovimentacaoDto[]>([])

let searchInterval: NodeJS.Timeout | null = null
watch(produtoFiltro, () => {
  if (searchInterval) clearTimeout(searchInterval)
  searchInterval = setTimeout(carregarMovimentacoesDoDia, 200)
})

async function carregarMovimentacoesDoDia() {
  const filtros = {
    pagina: pagina.value,
    paginaTamanho: paginaTamanho.value,
  } as ConsultaMovimentacoesParams

  if (checkBoxFiltro.value && dataSelecionada.value) {
    filtros.dataApos = inicioDoDiaUTCIso(dataSelecionada.value)
    filtros.dataAntes = fimDoDiaUTCIso(dataSelecionada.value)
  }

  if (motivo.value) {
    filtros.motivo = motivo.value
  }

  const res = await api.obterTodos(filtros)

  if (res.ok && res.responseBody) {
    let lista = res.responseBody

    if (produtoFiltro.value && produtoFiltro.value.trim() !== '') {
      const termo = produtoFiltro.value.trim().toLowerCase()
      lista = lista.filter((mov) => mov._produto.nome.toLowerCase().includes(termo))
    }
    movimentacoes.value = lista
  }
}

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
