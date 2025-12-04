<template>
  <div class="min-h-full w-full">
    <h1 class="m-15 mt-7 text-6xl font-bold">Operações Diárias</h1>
    <div class="bg-base-200 m-12 flex h-[83vh] flex-col overflow-auto rounded-2xl pt-2 pb-1">
      <!--Compras, vendas e filtrar por data-->
      <div class="m-6 flex flex-row gap-8">
        <button
          @click="ativarCompra"
          class="flex transform cursor-pointer items-center rounded-lg bg-stone-700 p-4 transition-transform duration-200 hover:scale-105 hover:bg-stone-700"
          :class="botaoAtivoC === true ? 'scale-104' : ''"
        >
          <ShoppingCartIcon
            class="w-15"
            :class="botaoAtivoC === true ? 'text-green-500' : 'text-white'"
          />
          <span class="ml-6" :class="botaoAtivoC === true ? 'text-green-500' : 'text-white'">
            Compras
          </span>
        </button>
        <button
          @click="ativarVenda"
          class="flex transform cursor-pointer items-center rounded-lg bg-stone-700 p-4 transition-transform duration-200 hover:scale-105 hover:bg-stone-700"
          :class="botaoAtivoV === true ? 'scale-104' : ''"
        >
          <ShoppingBagIcon
            class="w-15"
            :class="botaoAtivoV === true ? 'text-green-500' : 'text-white'"
          >
          </ShoppingBagIcon>
          <span class="text ml-6" :class="botaoAtivoV === true ? 'text-green-500' : 'text-white'"
            >Vendas</span
          >
        </button>

        <div class="flex flex-1 flex-col items-center justify-center rounded-lg bg-stone-700 p-4">
          <span class="text mb-4 font-medium text-white">Filtrar por data</span>
          <input
            type="date"
            v-model="dataSelecionada"
            @change="carregarMovimentacoesDoDia"
            class="input input-bordered w-70 rounded-lg px-2"
          />
        </div>
      </div>
      <!--div buscar produto, nova movimentação e histórico-->
      <div class="m-6 flex h-[70vh] flex-col rounded-2xl bg-stone-700 pt-1">
        <!--Buscar Produto e Nova Movimentação-->
        <div class="m-6 mb-6 flex items-center justify-between">
          <div class="relative w-80">
            <input
              type="text"
              v-model="produtoFiltro"
              @input="carregarMovimentacoesDoDia"
              placeholder="BUSCAR PRODUTO..."
              class="w-full rounded-3xl bg-white px-10 py-2 text-black focus:outline-none"
            />
            <MagnifyingGlassIcon class="absolute top-1/2 left-2 w-6 -translate-y-1/2 text-black" />
          </div>
          <button
            class="transition-tranform flex w-60 transform cursor-pointer rounded-xl bg-white px-4 py-2 font-semibold text-black duration-100 hover:scale-103"
            @click="novaMovimentacao = true"
          >
            <PlusIcon class="mr-2 w-5"></PlusIcon> NOVA MOVIMENTAÇÃO
          </button>
        </div>

        <div class="m-6 flex-1 overflow-y-auto">
          <h3 class="m-6 mb-2 text-3xl font-semibold text-white">Histórico</h3>
          <table class="w-full border-t border-white text-left">
            <thead class="sticky z-10 text-white">
              <tr class="text-2xl text-white">
                <th class="py-2">Hora</th>
                <th class="py-2">Tipo</th>
                <th class="py-2">Produto</th>
                <th class="py-2">Qtd</th>
                <th class="py-2">Usuário</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in movimentacoes" :key="i.id" class="text-xl text-white">
                <td class="py-2">
                  {{
                    new Date(i.horario).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}
                </td>
                <td class="py-2">{{ i.motivo === '1' ? 'Compra' : 'Venda' }}</td>
                <td class="py-2">
                  {{ i._produto.nome }}
                  <br />
                  <span class="badge badge-sm badge-primary">{{ i._produto.codigo }}</span>
                </td>
                <td class="py-2">{{ i.quantidade }}</td>
                <td class="py-2">{{ i._usuario.nome }}</td>
              </tr>
              <tr v-if="movimentacoes.length === 0">
                <td colspan="5" class="py-4 text-center text-white">
                  Nenhuma movimentação encontrada
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <NovaMoviment v-if="novaMovimentacao" v-model="novaMovimentacao"></NovaMoviment>
</template>

<script setup lang="ts">
import { ApiMovimentacoes } from '@/api/movimentacoes'
import { ApiProdutos } from '@/api/produtos'
import NovaMoviment from '@/components/OpDiarias/NovaMoviment.vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import type { GetConsultaMovimentacaoDto } from '../../../backend'

const produtosCache = ref<Record<string, string>>({})

function ativarCompra() {
  botaoAtivoC.value = true
  botaoAtivoV.value = false
  carregarMovimentacoesDoDia()
}

function ativarVenda() {
  botaoAtivoC.value = false
  botaoAtivoV.value = true
  carregarMovimentacoesDoDia()
}

const apiProdutos = new ApiProdutos()
async function carregarProdutos() {
  const res = await apiProdutos.obterTodos()
  if (res.ok && res.responseBody) {
    const lista = res.responseBody
    lista.forEach((p: { id: string; nome: string }) => {
      produtosCache.value[p.id] = p.nome
    })
  }
}

const botaoAtivoC = ref<boolean>(true)
const botaoAtivoV = ref<boolean>(false)

const api = new ApiMovimentacoes()
const movimentacoes = ref<GetConsultaMovimentacaoDto[]>([])
const dataSelecionada = ref<string>(formatarDataLocalParaInput(new Date()))
const produtoFiltro = ref<string | null>('')

async function carregarMovimentacoesDoDia() {
  const res = await api.obterTodos({ pagina: 1, paginaTamanho: 100 })
  /* const resp = await api.obterPorData(dataSelecionada.value) */
  if (res.ok && res.responseBody) {
    movimentacoes.value = res.responseBody
    /*
    const dados = res.responseBody as Movimentacao[]
    let filtradas = dados.filter(
      (i) => (botaoAtivoC.value && i.tipo === 1) || (botaoAtivoV.value && i.tipo != 1),
    )

    if (produtoFiltro.value && produtoFiltro.value.trim() !== '') {
      const filtroLower = produtoFiltro.value.toLowerCase()
      filtradas = filtradas.filter((i) =>
        (produtosCache.value[i.produtoId] || '').toLowerCase().includes(filtroLower),
      )
    }
    movimentacoes.value = filtradas
    */
  }
}

onMounted(async () => {
  await carregarProdutos() // carrega o id → nome
  await carregarMovimentacoesDoDia() // carrega as movimentações já filtrando pelo tipo e nome
})

ativarVenda()

function formatarDataLocalParaInput(date: Date) {
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

const novaMovimentacao = ref<boolean>(false)
</script>
