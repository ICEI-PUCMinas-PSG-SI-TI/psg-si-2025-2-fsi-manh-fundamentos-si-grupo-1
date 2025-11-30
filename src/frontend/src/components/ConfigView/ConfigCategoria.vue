<script setup lang="ts">
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import LabeledInput from '../LabeledInput.vue'
import { ref } from 'vue'
import { ApiCategorias } from '@/api/categorias'
import { useNotificationStore } from '@/store/config/toast'
import ButtonComponent from '../ButtonComponent.vue'
import type { GetCategoriaDTO } from '../../../../backend'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const categorias = new ApiCategorias()

const notificacoes = useNotificationStore()

const refNovaCategoria = ref()
const refCategorias = ref<GetCategoriaDTO[]>([])

async function adicionarCategoria() {
  const res = await categorias.criar(refNovaCategoria.value)
  if (res.ok) {
    notificacoes.addNotification('Informações adicionadas.', { time: 3000 })
    obterCategorias()
  }
}

async function removerCategorias(id: string) {
  const res = await categorias.excluir(id)
  if (res.ok) {
    notificacoes.addNotification('Informações excluídas.', { time: 3000 })
    obterCategorias()
  }
}

async function obterCategorias() {
  const data = await categorias.obterTodos()
  if (data.ok && data.responseBody) {
    refCategorias.value = data.responseBody
  }
}

obterCategorias()
</script>

<template>
  <CardComponent class="mb-4">
    <CardTitleBar title="Categorias" />
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
      <div class="flex flex-col w-full mb-4 gap-4 items-end xl:col-span-1">
        <LabeledInput
          class="w-full"
          html-type="text"
          label-text="Categoria"
          html-place-holder="Categoria"
          v-model="refNovaCategoria"
        />
        <ButtonComponent class="w-full" @click="adicionarCategoria"> Adicionar</ButtonComponent>
      </div>
      <div class="xl:col-span-2">
        <p
          class="flex size-full text-center m-auto justify-center items-center"
          v-if="refCategorias.length === 0"
        >
          Não há categorias.
        </p>
        <div
          class="badge badge-lg badgde-soft badge-primary m-1"
          v-for="categoria in refCategorias"
          :key="categoria.id"
        >
          <p>{{ categoria.nome }}</p>
          <button class="btn btn-xs btn-primary" @click="removerCategorias(categoria.id)">
            <XMarkIcon class="size-6" />
          </button>
        </div>
      </div>
    </div>
  </CardComponent>
</template>
