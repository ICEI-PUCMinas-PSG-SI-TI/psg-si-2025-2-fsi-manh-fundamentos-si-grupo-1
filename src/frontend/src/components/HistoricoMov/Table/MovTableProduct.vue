<script setup lang="ts">
import { ApiProdutos } from '@/api/produtos'
import { ApiLotes } from '@/api/lotes'
import { ref, watch, type Ref } from 'vue'

const props = defineProps<{ productId: string; loteId: string }>()

const refProductId = ref(props.productId)
const refProductData: Ref<{
  id?: string
  nome?: string
}> = ref({})

const produtos = new ApiProdutos()

watch(refProductId, obterProduto)

const refLoteId = ref(props.loteId)
const refLoteData: Ref<{
  id?: string
  lote?: string
}> = ref({})

const lotes = new ApiLotes()

async function obterLote(id: string) {
  const res = await lotes.obter(id)
  if (res.ok) {
    refLoteData.value = await res.json()
  }
  // TODO: Criar campos padrão
}
async function obterProduto(id: string) {
  const res = await produtos.obter(id)
  if (res.ok) {
    const data = await res.json()
    console.log(data)
    refProductData.value = data
  }
  // TODO: Criar campos padrão
}

watch(refLoteId, obterLote)
obterLote(props.loteId)
obterProduto(props.productId)
</script>

<template>
  {{ refProductData.nome || 'Produto N/A' }}
  <br />
  <span class="badge badge-sm badge-primary">{{ refLoteData.lote || 'Lote N/A' }}</span>
</template>
