<template>
  <div
    class="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-md z-50 p-4"
  >
    <CardComponent class="w-full max-w-xl p-6 bg-base-200 rounded-2xl shadow-xl border border-gray-300">
      <!-- Título -->
      <CardTitleBar title="Inserir Nova Movimentação" />

      <!-- Formulário -->
      <form class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <LabeledInput
          class="w-full "
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
      <p class="text-red-500 text-center mt-3">{{}}</p>

      <!-- Botões -->
      <div class="flex justify-end gap-4 mt-6">
        <ButtonComponent
          class="bg-red-500 text-white hover:bg-red-600 transition-colors"
          @click="visivel = false"
        >
          Cancelar
        </ButtonComponent>
        <ButtonComponent
          class="bg-green-500 text-white hover:bg-green-600 transition-colors"

        >
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
