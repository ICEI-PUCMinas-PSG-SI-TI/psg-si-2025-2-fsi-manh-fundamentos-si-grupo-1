<template>
  <div class="card bg-base-200 shadow-md rounded-2xl p-6 w-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold">{{ produtoLocal?.id ? 'Editar Produto' : 'Novo Produto' }}</h3>
      <button class="btn btn-ghost" @click="onCancelar">Cancelar</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label"><span class="label-text">Nome</span></label>
        <input v-model="produtoLocal.nome" class="input input-bordered" type="text" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">SKU</span></label>
        <input v-model="produtoLocal.sku" class="input input-bordered" type="text" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Quantidade em Estoque</span></label>
        <input v-model.number="produtoLocal.quantidade_estoque" class="input input-bordered" type="number" min="0" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Categoria</span></label>
        <input v-model="produtoLocal.categoria" class="input input-bordered" type="text" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Preço de Custo (R$)</span></label>
        <input v-model.number="produtoLocal.preco_custo" class="input input-bordered" type="number" step="0.01" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Preço de Venda (R$)</span></label>
        <input v-model.number="produtoLocal.preco_venda" class="input input-bordered" type="number" step="0.01" />
      </div>

      <div class="form-control md:col-span-2">
        <label class="label"><span class="label-text">Descrição</span></label>
        <textarea v-model="produtoLocal.descricao" class="textarea textarea-bordered h-24 resize-none"></textarea>
      </div>

      <div class="md:col-span-2">
        <label class="label"><span class="label-text">Imagens do Produto</span></label>

        <div
          class="flex items-center gap-3 mb-3"
        >
          <input type="file" accept="image/*" @change="onFileChange" multiple class="file-input file-input-bordered" />
          <button class="btn btn-outline" @click="limparImagens" type="button">Limpar</button>
        </div>

        <div class="flex gap-3 flex-wrap">
          <div
            v-for="(img, idx) in imagemPreviews"
            :key="idx"
            class="w-24 h-24 bg-base-300 rounded-lg overflow-hidden relative"
          >
            <img :src="img" class="object-cover w-full h-full" />
            <button class="btn btn-xs btn-circle absolute top-1 right-1" @click="removerPreview(idx)">✕</button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <button class="btn btn-ghost" @click="onCancelar">Cancelar</button>
      <button class="btn btn-primary" @click="onSalvar">Salvar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRaw } from 'vue'

interface Produto {
  id?: string
  nome?: string
  sku?: string
  descricao?: string
  categoria?: string
  preco_custo?: number
  preco_venda?: number
  quantidade_estoque?: number
  imagens?: string[] | any[] 
}

const props = defineProps<{
  produto: Produto | null
}>()

const emit = defineEmits<{
  (e: 'salvar', payload: Produto): void
  (e: 'cancelar'): void
}>()

const produtoLocal = ref<Produto>({
  id: undefined,
  nome: '',
  sku: '',
  descricao: '',
  categoria: '',
  preco_custo: 0,
  preco_venda: 0,
  quantidade_estoque: 0,
  imagens: [],
})

watch(
  () => props.produto,
  (p) => {
    if (p) produtoLocal.value = JSON.parse(JSON.stringify(p))
    else produtoLocal.value = { id: undefined, nome: '', sku: '', descricao: '', categoria: '', preco_custo: 0, preco_venda: 0, quantidade_estoque: 0, imagens: [] }
  },
  { immediate: true },
)

const imagemFiles = ref<File[]>([])
const imagemPreviews = ref<string[]>([])

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  for (const f of Array.from(input.files)) {
    imagemFiles.value.push(f)
    const reader = new FileReader()
    reader.onload = () => {
      imagemPreviews.value.push(String(reader.result))
    }
    reader.readAsDataURL(f)
  }
  
  produtoLocal.value.imagens = [...(produtoLocal.value.imagens || []), ...imagemPreviews.value]
}

function removerPreview(idx: number) {
  imagemPreviews.value.splice(idx, 1)
  imagemFiles.value.splice(idx, 1)

  produtoLocal.value.imagens = [...imagemPreviews.value]
}

function limparImagens() {
  imagemFiles.value = []
  imagemPreviews.value = []
  produtoLocal.value.imagens = []
}

function onSalvar() {
  
  const payload = { ...toRaw(produtoLocal.value) }
  
  payload.imagens = imagemPreviews.value.length ? [...imagemPreviews.value] : (payload.imagens || [])
  emit('salvar', payload)
}

function onCancelar() {
  emit('cancelar')
}
</script>
