<script setup lang="ts">
import ButtonComponent from '../ButtonComponent.vue'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import LabeledInput from '../LabeledInput.vue'

const visivel = defineModel()
</script>

<template>
  <div
    class="fixed flex size-full top-0 left-0 right-0 bottom-0 backdrop-blur-lg z-10 justify-center items-center align-middle"
  >
    <CardComponent class="w-full max-w-sm max-w-auto m-auto border">
      <CardTitleBar title="Alteração de senha" />
      <LabeledInput
        class="floating-label justify-self-center w-full"
        html-type="password"
        html-place-holder="Senha (Antiga)"
        label-text="Senha"
      />
      <LabeledInput
        class="floating-label justify-self-center w-full"
        html-type="password"
        html-place-holder="Nova Senha"
        label-text="Nova Senha"
      />
      <LabeledInput
        class="floating-label justify-self-center w-full mb-4"
        html-type="password"
        html-place-holder="Nova Senha (Confirmação)"
        label-text="Nova Senha (Confirmação)"
      />
      <ButtonComponent class="btn-success">Confirmar</ButtonComponent>
      <ButtonComponent class="btn-error" @click="visivel = false">Cancelar</ButtonComponent>
    </CardComponent>
  </div>
</template>
