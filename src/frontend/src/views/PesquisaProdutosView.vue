<template>
  <main class="flex-1 bg-white p-8 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold">CATÁLOGO</h2>
        <p class="text-sm text-gray-500 mt-1">Gerencie seus produtos aqui.</p>
      </div>

      <div class="flex gap-3">
        <button
          @click="criarProduto"
          class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
        >
          + PRODUTO
        </button>
      </div>
    </div>

    <!-- Busca -->
    <div class="mb-6 flex items-center gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="BUSCAR PRODUTO..."
        class="border rounded-l-full px-4 py-2 w-1/2 focus:outline-none"
      />
      <button @click="limparPesquisa" class="border rounded-r-full px-4 py-2">Limpar</button>

      <div class="ml-auto flex items-center gap-2">
        <label class="text-sm text-gray-600">Filtrar categoria:</label>
        <select v-model="categoriaFilter" class="border px-2 py-1 rounded">
          <option value="">Todas</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </div>
    </div>

    <!-- Tabela -->
    <div class="border-2 border-green-300 rounded-lg p-4 overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th class="text-left p-2"># Identificador</th>
            <th class="text-left p-2">NOME DO PRODUTO</th>
            <th class="text-left p-2">CATEGORIA</th>
            <th class="text-left p-2">QUANTIDADE</th>
            <th class="text-left p-2">PREÇO CUSTO</th>
            <th class="p-2 justify-center">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produto in refProdutos" :key="produto.id" class="border-b hover:bg-gray-50">
            <td class="p-2">{{ produto.id }}</td>
            <td class="p-2">{{ produto.nome }}</td>
            <td class="p-2">{{ produto.categoria }}</td>
            <td class="p-2">{{ produto.quantidade || 'N/A' }}</td>
            <td class="p-2">
              R$
              {{
                produto.precoCusto
                  ? (produto.precoCusto / 1000).toFixed(3).replace('.', ',')
                  : 'N/A'
              }}
            </td>
            <td class="p-2 flex justify-center gap-2">
              <button
                @click="visualizarProduto(produto)"
                class="bg-green-800 text-white px-3 py-1 rounded-full hover:bg-green-700"
              >
                Visualizar
              </button>
              <button
                @click="remover(produto)"
                class="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-500"
              >
                Remover
              </button>
            </td>
          </tr>

          <tr v-if="!refProdutos || refProdutos.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500">Nenhum produto encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal simples para criar/editar -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-bold mb-4">Novo Produto</h3>
        <div v-if="form" class="space-y-3">
          <input v-model="form.nome" placeholder="Nome" class="w-full border px-3 py-2 rounded" />
          <input
            v-model="form.categoria"
            placeholder="Categoria"
            class="w-full border px-3 py-2 rounded"
          />
          <input
            v-model.number="form.quantidade"
            type="number"
            placeholder="Quantidade"
            class="w-full border px-3 py-2 rounded"
          />
          <input
            v-model.number="form.preco"
            type="number"
            step="0.01"
            placeholder="Preço"
            class="w-full border px-3 py-2 rounded"
          />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
          <button @click="save" class="px-4 py-2 rounded bg-green-800 text-white">Salvar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { ApiProdutos } from '@/api/produtos'
import { ApiCategorias } from '@/api/categorias'
import type { SelectProdutosSchema } from '../../../backend/src/db/schema/produtos'
import type { SelectCategoriaSchema } from '../../../backend/src/db/schema/categorias'
import { notificacoes } from '@/main'

const search = ref('')
const categoriaFilter = ref('')
const showModal = ref(false)
// const modalMode = ref('create')

type SelectProdutosSchemaEx = SelectProdutosSchema & {
  quantidade?: number
}

const refProdutos: Ref<SelectProdutosSchemaEx[] | null> = ref(null)

const form: Ref<{
  id: string
  nome: string
  categoria: string
  quantidade: number
  preco: number
} | null> = ref(null)

const categorias: Ref<SelectCategoriaSchema[]> = ref([])

function criarProduto() {
  // modalMode.value = 'create'
  form.value = { id: 'id', nome: '', categoria: '', quantidade: 0, preco: 0 }
  showModal.value = true
  // TODO: redirect
  alert('Redirect to produtos/new')
}

function visualizarProduto(p: SelectProdutosSchema) {
  // TODO: redirect
  alert('Redirect to produtos/' + p.id)
}

function remover(p: SelectProdutosSchema) {
  // TODO: Devido a dependencias.
  notificacoes.addNotification('No momento não é permitido a exclusão de produtos!', { time: 3000 })
  /*
  if (!confirm(`Remover "${p.nome}"?`)) return
  refProdutos.value = refProdutos.value.filter((x) => x.id !== p.id)
  if (selected.value && selected.value.id === p.id) selected.value = null
  */
}

function closeModal() {
  showModal.value = false
}

function save() {
  /*
  const payload = { ...form.value }
  if (modalMode.value === 'create') {
    payload.id = produtos.value.length ? Math.max(...produtos.value.map((x) => x.id)) + 1 : 1
    produtos.value.push(payload)
  } else {
    const idx = produtos.value.findIndex((x) => x.id === payload.id)
    if (idx !== -1) produtos.value[idx] = payload
  }
    */
  showModal.value = false
}

let searchInterval: NodeJS.Timeout | null = null
watch(categoriaFilter, () => obterProdutos())
watch(search, () => {
  if (searchInterval) clearTimeout(searchInterval)
  searchInterval = setTimeout(obterProdutos, 200)
})

const apiProdutos = new ApiProdutos()
const apiCategorias = new ApiCategorias()

async function obterProdutos() {
  if (search.value.length > 0 || categoriaFilter.value.length > 0) {
    const body: { texto?: string; categorias?: string } = {}
    if (search.value.length > 0) body.texto = search.value
    if (categoriaFilter.value.length > 0) body.texto = categoriaFilter.value
    const res = await apiProdutos.obterTodos(body)
    if (res.ok && res.responseBody) {
      refProdutos.value = res.responseBody
    }
  } else {
    const res = await apiProdutos.obterTodos()
    if (res.ok && res.responseBody) {
      refProdutos.value = res.responseBody
    }
  }
}

async function obterCategorias() {
  const res = await apiCategorias.obterTodos()
  if (res.ok && res.responseBody) {
    categorias.value = res.responseBody
  }
}

obterProdutos()
obterCategorias()

function limparPesquisa() {
  search.value = ''
  categoriaFilter.value = ''
}
</script>

<style scoped>
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}
</style>
