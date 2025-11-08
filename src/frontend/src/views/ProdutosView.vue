<template>
  <main class="flex-1 bg-white p-8 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold">CATÁLOGO</h2>
        <p class="text-sm text-gray-500 mt-1">Gerencie seus produtos aqui.</p>
      </div>

      <div class="flex gap-3">
        <button
          @click="openCreate"
          class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
        >
          + PRODUTO
        </button>
        <button
          v-if="selected"
          @click="editSelected"
          class="bg-green-800 text-white px-4 py-2 rounded-full hover:bg-green-700"
        >
          EDITAR SELECIONADO
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
      <button @click="clearSearch" class="border rounded-r-full px-4 py-2">
        Limpar
      </button>

      <div class="ml-auto flex items-center gap-2">
        <label class="text-sm text-gray-600">Filtrar categoria:</label>
        <select v-model="categoriaFilter" class="border px-2 py-1 rounded">
          <option value="">Todas</option>
          <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <!-- Tabela -->
    <div class="border-2 border-green-300 rounded-lg p-4 overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th class="text-left p-2">#</th>
            <th class="text-left p-2">NOME DO PRODUTO</th>
            <th class="text-left p-2">CATEGORIA</th>
            <th class="text-left p-2">QUANTIDADE</th>
            <th class="text-left p-2">PREÇO</th>
            <th class="p-2">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="produto in filteredProducts"
            :key="produto.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-2">{{ produto.id }}</td>
            <td class="p-2">{{ produto.nome }}</td>
            <td class="p-2">{{ produto.categoria }}</td>
            <td class="p-2">{{ produto.quantidade }}</td>
            <td class="p-2">R$ {{ produto.preco.toFixed(2) }}</td>
            <td class="p-2 flex gap-2">
              <button
                @click="selectProduto(produto)"
                :class="['px-3 py-1 rounded-full', selected && selected.id === produto.id ? 'bg-yellow-400' : 'bg-gray-200']"
              >
                Selecionar
              </button>
              <button
                @click="editar(produto)"
                class="bg-green-800 text-white px-3 py-1 rounded-full hover:bg-green-700"
              >
                Editar
              </button>
              <button
                @click="remover(produto)"
                class="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-500"
              >
                Remover
              </button>
            </td>
          </tr>

          <tr v-if="filteredProducts.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500">
              Nenhum produto encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal simples para criar/editar -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-bold mb-4">{{ modalMode === 'create' ? 'Novo Produto' : 'Editar Produto' }}</h3>

        <div class="space-y-3">
          <input v-model="form.nome" placeholder="Nome" class="w-full border px-3 py-2 rounded" />
          <input v-model="form.categoria" placeholder="Categoria" class="w-full border px-3 py-2 rounded" />
          <input v-model.number="form.quantidade" type="number" placeholder="Quantidade" class="w-full border px-3 py-2 rounded" />
          <input v-model.number="form.preco" type="number" step="0.01" placeholder="Preço" class="w-full border px-3 py-2 rounded" />
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 rounded border">Cancelar</button>
          <button @click="save" class="px-4 py-2 rounded bg-green-800 text-white">Salvar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const categoriaFilter = ref('')
const showModal = ref(false)
const modalMode = ref('create')
const selected = ref(null)

const produtos = ref([
  { id: 1, nome: 'Produto A', categoria: 'Categoria X', quantidade: 12, preco: 10.5 },
  { id: 2, nome: 'Produto B', categoria: 'Categoria Y', quantidade: 5, preco: 23.0 },
  { id: 3, nome: 'Produto C', categoria: 'Categoria Z', quantidade: 9, preco: 7.75 },
])

const form = ref({
  id: null,
  nome: '',
  categoria: '',
  quantidade: 0,
  preco: 0,
})

const categorias = computed(() => {
  const set = new Set(produtos.value.map((p) => p.categoria))
  return Array.from(set)
})

const filteredProducts = computed(() => {
  return produtos.value.filter((p) => {
    const termo = search.value.trim().toLowerCase()
    const matchNome = termo === '' || p.nome.toLowerCase().includes(termo)
    const matchCategoria = categoriaFilter.value === '' || p.categoria === categoriaFilter.value
    return matchNome && matchCategoria
  })
})

function openCreate() {
  modalMode.value = 'create'
  form.value = { id: null, nome: '', categoria: '', quantidade: 0, preco: 0 }
  showModal.value = true
}

function editSelected() {
  if (!selected.value) return
  editar(selected.value)
}

function selectProduto(p) {
  selected.value = selected.value && selected.value.id === p.id ? null : p
}

function editar(p) {
  modalMode.value = 'edit'
  form.value = { ...p }
  showModal.value = true
}

function remover(p) {
  if (!confirm(`Remover "${p.nome}"?`)) return
  produtos.value = produtos.value.filter((x) => x.id !== p.id)
  if (selected.value && selected.value.id === p.id) selected.value = null
}

function closeModal() {
  showModal.value = false
}

function save() {
  const payload = { ...form.value }
  if (modalMode.value === 'create') {
    payload.id = produtos.value.length ? Math.max(...produtos.value.map((x) => x.id)) + 1 : 1
    produtos.value.push(payload)
  } else {
    const idx = produtos.value.findIndex((x) => x.id === payload.id)
    if (idx !== -1) produtos.value[idx] = payload
  }
  showModal.value = false
}

function clearSearch() {
  search.value = ''
  categoriaFilter.value = ''
}
</script>

<style scoped>
input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
}
</style>
