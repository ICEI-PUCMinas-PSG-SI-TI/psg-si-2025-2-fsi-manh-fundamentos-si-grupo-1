<template>
  <div class="w-full min-h-screen">
    <h1 class="m-15 mt-7 text-6xl font-bold">Operações Diárias</h1>
    <div class="bg-base-200 m-12 pt-2 pb-1 rounded-2xl overflow-auto flex flex-col h-[83vh]">
      <!--Compras, vendas e filtrar por data-->
      <div class="flex flex-row gap-8 m-6">
        <button
          @click="ativarCompra"
          class="flex bg-stone-700 p-4 rounded-lg items-center cursor-pointer hover:bg-stone-700 transition-transform duration-200 transform hover:scale-105"
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
          class="flex bg-stone-700 p-4 rounded-lg items-center cursor-pointer hover:bg-stone-700 transition-transform duration-200 transform hover:scale-105"
          :class="botaoAtivoV === true ? 'scale-104' : ''"
        >
          <ShoppingBagIcon
            class="w-15"
            :class="botaoAtivoV === true ? 'text-green-500' : 'text-white'"
          >
          </ShoppingBagIcon>
          <span class="text ml-6" :class="botaoAtivoV === true ? 'text-green-500 ' : 'text-white'"
            >Vendas</span
          >
        </button>

        <div class="flex flex-col bg-stone-700 p-4 rounded-lg flex-1 items-center justify-center">
          <span class="text font-medium mb-4 text-white">Filtrar por data</span>
          <input
            type="date"
            v-model="dataSelecionada"
            @change="carregarMovimentacoesDoDia"
            class="input input-bordered w-70 px-2 rounded-lg"
          />
        </div>
      </div>
      <!--div buscar produto, nova movimentação e histórico-->
      <div class="bg-stone-700 m-6 rounded-2xl pt-1 flex flex-col h-[70vh]">
        <!--Buscar Produto e Nova Movimentação-->
        <div class="m-6 flex justify-between items-center mb-6">
          <div class="relative w-80">
            <input
              type="text"
              v-model="produtoFiltro"
              @input="carregarMovimentacoesDoDia"
              placeholder="BUSCAR PRODUTO..."
              class="w-full px-10 py-2 rounded-3xl bg-white text-black focus:outline-none"
            />
            <MagnifyingGlassIcon class="w-6 text-black absolute left-2 top-1/2 -translate-y-1/2" />
          </div>
          <button
            class="bg-white w-60 flex text-black font-semibold px-4 py-2 rounded-xl transition-tranform duration-100 transform hover:scale-103 cursor-pointer"
            @click="novaMovimentacao = true"
          >
            <PlusIcon class="w-5 mr-2"></PlusIcon> NOVA MOVIMENTAÇÃO
          </button>
        </div>

        <div class="m-6 flex-1 overflow-y-auto">
          <h3 class="m-6 text-3xl font-semibold mb-2 text-white">Histórico</h3>
          <table class="w-full text-left border-t border-white">
            <thead class="sticky z-10 text-white">
              <tr class="text-white text-2xl">
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
                <td class="py-2">{{ i.tipo === 1 ? 'Compra' : 'Venda' }}</td>
                <td class="py-2">
                  <MovTableProduct :product-id="i.produtoId" :lote-id="i.loteId" />
                </td>
                <td class="py-2">{{ i.quantidade }}</td>
                <td class="py-2">{{ i.usuarioId }}</td>
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
import MovTableProduct from '@/components/HistoricoMov/Table/MovTableProduct.vue'
import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import NovaMoviment from '@/components/OpDiarias/NovaMoviment.vue'
import { ApiProdutos } from '@/api/produtos'
import { ApiUsuario } from '@/api/usuarios'
import { ApiPerfil } from '@/api/perfil'

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

async function carregarProdutos() {
  const res = await ApiProdutos.obterTodos()
  const lista = await res.json()
  lista.forEach((p: { id: string; nome: string }) => {
    produtosCache.value[p.id] = p.nome
  })
}

const botaoAtivoC = ref<boolean>(true)
const botaoAtivoV = ref<boolean>(false)

const apiUsuarios = new ApiPerfil()

async function getUsuariosId(usuarioId: string) {
  const res = await apiUsuarios.obterPorId(usuarioId)
  if (res.ok && res.responseBody) {
    return res.responseBody
  }
}

interface Movimentacao {
  id: string
  produtoId: string
  usuarioId: string
  loteId: string
  tipo: number
  quantidade: number
  horario: string
  local_origem_id: string
  local_destino_id: string
  observacao: string
}

const api = new ApiMovimentacoes()
const movimentacoes = ref<Movimentacao[]>([])
const dataSelecionada = ref<string>(formatarDataLocalParaInput(new Date()))
const produtoFiltro = ref<string | null>('')

async function carregarMovimentacoesDoDia() {
  const res = await api.obterTodos()
  /* const resp = await api.obterPorData(dataSelecionada.value) */
  if (res.ok && res.responseBody) {
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
