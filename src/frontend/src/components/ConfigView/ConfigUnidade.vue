<script setup lang="ts">
import { ApiUnidadesMedida } from '@/api/unidades'
import { useNotificationStore } from '@/store/config/toast'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import type { GetUnidadeDto } from '../../../../backend'
import ButtonComponent from '../ButtonComponent.vue'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import LabeledInput from '../LabeledInput.vue'

const unidadesMedida = new ApiUnidadesMedida()

const notificacoes = useNotificationStore()

const refUnidadesMedida = ref([] as GetUnidadeDto[])
const refNovaUnidadeMedida = ref({
  nome: '',
  abreviacao: '',
})

async function adicionarUnidadeMedida() {
  const { nome, abreviacao } = refNovaUnidadeMedida.value
  const res = await unidadesMedida.criar(nome, abreviacao)
  if (res.ok) {
    notificacoes.addNotification('Informações adicionadas.', { time: 3000 })
    obterUnidadesMedida()
  }
}

async function removerUnidadeMedida(id: string) {
  const res = await unidadesMedida.excluir(id)
  if (res.ok) {
    notificacoes.addNotification('Informações excluídas.', { time: 3000 })
    obterUnidadesMedida()
  }
}

async function obterUnidadesMedida() {
  const data = await unidadesMedida.obterTodos()
  if (data.ok && data.responseBody) {
    refUnidadesMedida.value = data.responseBody
  }
}

obterUnidadesMedida()
</script>

<template>
  <CardComponent class="mb-4">
    <CardTitleBar title="Unidades de medida" />
    <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <div class="xl:col-span-1">
        <LabeledInput
          class="w-full"
          html-type="text"
          label-text="Nome da unidades de medida"
          html-place-holder="Nome da unidades de medida"
          v-model="refNovaUnidadeMedida.nome"
        />
        <LabeledInput
          class="mb-4 w-full"
          html-type="text"
          label-text="Abreviação"
          html-place-holder="Abreviação"
          v-model="refNovaUnidadeMedida.abreviacao"
        />
        <ButtonComponent class="w-full" @click="adicionarUnidadeMedida">
          Adicionar
        </ButtonComponent>
      </div>
      <div class="xl:col-span-2">
        <p
          class="m-auto flex size-full items-center justify-center text-center"
          v-if="refUnidadesMedida.length === 0"
        >
          Não há unidades de medida.
        </p>
        <div
          class="badge badge-lg badgde-soft badge-primary m-1"
          v-for="unidade in refUnidadesMedida"
          :key="unidade.id"
        >
          <div class="flex flex-col">
            <p>{{ unidade.nome }} ({{ unidade.abreviacao }})</p>
          </div>
          <button class="btn btn-xs btn-primary" @click="removerUnidadeMedida(unidade.id)">
            <XMarkIcon class="size-6" />
          </button>
        </div>
      </div>
    </div>
  </CardComponent>
</template>
