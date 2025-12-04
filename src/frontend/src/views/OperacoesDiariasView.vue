<template>
  <div class="min-h-screen w-full max-w-full">
    <div class="bg-base-200 mt-4 flex flex-col rounded-2xl p-4 md:m-9">
      <!--Compras, vendas e filtrar por data-->
      <div class="mb-6 flex flex-wrap items-start gap-6">
        <!-- Select de Motivo -->
        <div class="flex min-w-[200px] flex-1 flex-col">
          <label class="mb-2 text-sm font-medium">Tipo de Movimentação</label>
          <select
            class="select select-bordered focus:ring-primary w-full cursor-pointer rounded-lg bg-white font-medium text-black focus:ring-2 focus:outline-none"
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
        <div class="flex min-w-[200px] flex-1 flex-col">
          <label class="mb-3 text-sm font-medium">Filtrar por data</label>
          <div class="flex w-full items-center gap-4">
            <input
              type="checkbox"
              v-model="checkBoxFiltro"
              @change="resetarPagina"
              class="checkbox h-6 w-6 rounded-md border-2 transition-all duration-110 checked:border-green-400 checked:bg-green-500"
            />
            <input
              type="date"
              v-model="dataSelecionada"
              @change="carregarMovimentacoesDoDia"
              class="input input-bordered focus:ring-primary w-full rounded-lg px-3 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <!--div buscar produto, nova movimentação e histórico-->
      <div class="flex min-h-[60vh] flex-1 flex-col rounded-2xl p-4">
        <!-- Busca + Botão Nova Movimentação -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <!-- Campo de busca -->
          <div class="relative w-full md:w-80">
            <input
              type="text"
              v-model="produtoFiltro"
              @input="carregarMovimentacoesDoDia"
              placeholder="BUSCAR PRODUTO..."
              class="w-full rounded-3xl bg-white px-10 py-2 text-black focus:outline-none"
            />
            <MagnifyingGlassIcon class="absolute top-1/2 left-2 w-6 -translate-y-1/2 text-black" />
          </div>

          <!-- Botão Nova Movimentação -->
          <button
            class="flex w-full cursor-pointer justify-center rounded-xl bg-white px-4 py-2 font-semibold text-black transition-transform duration-100 hover:scale-[1.03] md:w-60"
            @click="novaMovimentacao = true"
          >
            <PlusIcon class="mr-2 w-5"></PlusIcon> NOVA MOVIMENTAÇÃO
          </button>
        </div>

        <!-- TABELA  -->
        <h3 class="mb-4 text-3xl font-semibold">Histórico</h3>
        <div class="w-full overflow-x-auto rounded-xl">
          <table class="min-w-full divide-y divide-white/20 text-left">
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
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-stone-300 text-black"
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
        <div class="join mt-4 flex items-center justify-center gap-2 lg:justify-end">
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

import NovaMoviment from '@/components/OpDiarias/NovaMoviment.vue'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, watch } from 'vue'
import type { GetConsultaMovimentacaoDto } from '../../../backend'
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
