<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
    <CardComponent
      class="bg-base-200 w-full max-w-xl rounded-2xl border border-gray-300 p-6 shadow-xl"
    >
      <!-- Título -->
      <CardTitleBar title="Inserir Nova Movimentação" />

      <!-- Formulário -->
      <form class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <LabeledInput
          class="w-full"
          html-type="text"
          label-text="Produto"
          html-place-holder="Digite o nome do produto"
        />
        <LabeledInput
          class="w-full"
          html-type="text"
          label-text="Lote"
          html-place-holder="Digite o lote"
        />
        <LabeledInput
          class="w-full"
          html-type="number"
          label-text="Quantidade"
          html-place-holder="0"
        />
        <LabeledInput
          class="w-full md:col-span-2"
          html-type="text"
          label-text="Observação"
          html-place-holder="Digite alguma observação"
        />
        <LabeledInput
          class="w-full"
          html-type="text"
          label-text="Local Origem"
          html-place-holder="Ex: Andar 1"
        />
        <LabeledInput
          class="w-full"
          html-type="text"
          label-text="Local Destino"
          html-place-holder="Ex: Andar 3"
        />
      </form>

      <!-- Mensagem de erro -->
      <p class="mt-3 text-center text-red-500">{{}}</p>

      <!-- Botões -->
      <div class="mt-6 flex justify-end gap-4">
        <ButtonComponent
          class="bg-red-500 text-white transition-colors hover:bg-red-600"
          @click="visivel = false"
        >
          Cancelar
        </ButtonComponent>
        <ButtonComponent class="bg-green-500 text-white transition-colors hover:bg-green-600">
          Confirmar
        </ButtonComponent>
      </div>
    </CardComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from '../ButtonComponent.vue'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import LabeledInput from '../LabeledInput.vue'

const visivel = defineModel()
</script>
