<template>
  <main class="min-h-full flex-1 bg-white p-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold">CATÁLOGO</h2>
        <p class="mt-1 text-sm text-gray-500">Gerencie seus produtos aqui.</p>
      </div>

      <div class="flex gap-3">
        <button
          @click="criarProduto"
          class="rounded-full bg-black px-4 py-2 text-white hover:bg-gray-800"
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
        class="w-1/2 rounded-l-full border px-4 py-2 focus:outline-none"
      />
      <button @click="limparPesquisa" class="rounded-r-full border px-4 py-2">Limpar</button>

      <div class="ml-auto flex items-center gap-2">
        <label class="text-sm text-gray-600">Filtrar categoria:</label>
        <select v-model="categoriaFilter" class="rounded border px-2 py-1">
          <option value="">Todas</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </div>
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto rounded-lg border-2 border-green-300 p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th class="p-2 text-left"># Identificador</th>
            <th class="p-2 text-left">NOME DO PRODUTO</th>
            <th class="p-2 text-left">CATEGORIA</th>
            <th class="p-2 text-left">QUANTIDADE</th>
            <th class="p-2 text-left">PREÇO CUSTO</th>
            <th class="justify-center p-2">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produto in refProdutos" :key="produto.id" class="border-b hover:bg-gray-50">
            <!-- Use monospaced font -->
            <td class="p-2">{{ produto.codigo }}</td>
            <td class="p-2">{{ produto.nome }}</td>
            <td class="p-2">{{ produto.categoria || 'N/A' }}</td>
            <td class="p-2">{{ produto.quantidade || '0' }}</td>
            <td class="p-2">
              R$
              {{
                produto.precoCusto
                  ? (produto.precoCusto / 1000).toFixed(3).replace('.', ',')
                  : 'N/A'
              }}
            </td>
            <td class="flex justify-center gap-2 p-2">
              <button
                @click="visualizarProduto(produto)"
                class="rounded-full bg-green-800 px-3 py-1 text-white hover:bg-green-700"
              >
                Visualizar
              </button>
              <button
                @click="remover(produto)"
                class="rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-500"
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
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/40">
      <div class="w-96 rounded-lg bg-white p-6">
        <h3 class="mb-4 text-lg font-bold">Novo Produto</h3>
        <div v-if="form" class="space-y-3">
          <input v-model="form.nome" placeholder="Nome" class="w-full rounded border px-3 py-2" />
          <input
            v-model="form.categoria"
            placeholder="Categoria"
            class="w-full rounded border px-3 py-2"
          />
          <input
            v-model.number="form.quantidade"
            type="number"
            placeholder="Quantidade"
            class="w-full rounded border px-3 py-2"
          />
          <input
            v-model.number="form.preco"
            type="number"
            step="0.01"
            placeholder="Preço"
            class="w-full rounded border px-3 py-2"
          />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="closeModal" class="rounded border px-4 py-2">Cancelar</button>
          <button @click="save" class="rounded bg-green-800 px-4 py-2 text-white">Salvar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ApiCategorias } from '@/api/categorias'
import { ApiProdutos } from '@/api/produtos'
import { notificacoes } from '@/main'
import { ref, type Ref, watch } from 'vue'
import type { GetCategoriaDTO, GetConsultaProdutoDto, GetProdutoDto } from '../../../backend'

const search = ref('')
const categoriaFilter = ref('')
const showModal = ref(false)
// const modalMode = ref('create')

const refProdutos: Ref<GetConsultaProdutoDto[]> = ref([])

const form: Ref<{
  id: string
  nome: string
  categoria: string
  quantidade: number
  preco: number
} | null> = ref(null)

const categorias: Ref<GetCategoriaDTO[]> = ref([])

function criarProduto() {
  // modalMode.value = 'create'
  form.value = { id: 'id', nome: '', categoria: '', quantidade: 0, preco: 0 }
  showModal.value = true
  // TODO: redirect
  notificacoes.addNotification('Redirect to produtos/new', { isError: true })
}

function visualizarProduto(p: GetProdutoDto) {
  // TODO: redirect
  notificacoes.addNotification('Redirect to produtos/' + p.id, { isError: true })
}

function remover(_p: GetProdutoDto) {
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
    const body: { texto?: string; categoriaId?: string; pagina?: number; paginaTamanho?: number } =
      {
        pagina: 1,
        paginaTamanho: 100,
      }
    if (search.value.length > 0) body.texto = search.value
    if (categoriaFilter.value.length > 0) body.categoriaId = categoriaFilter.value
    const res = await apiProdutos.obterTodos(body)
    if (res.ok && res.responseBody) {
      refProdutos.value = res.responseBody
    }
  } else {
    const res = await apiProdutos.obterTodos({
      pagina: 1,
      paginaTamanho: 100,
    })
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
