<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from '../ButtonComponent.vue'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import LabeledInput from '../LabeledInput.vue'
import { ApiUsuario } from '@/api/usuario'
import { PasswordZ } from '@/services/objects'
import { useNotificationStore } from '@/store/config/toast'
import { ZodError } from 'zod'

const visivel = defineModel()

const error = ref()

const senhas = ref({
  anterior: '',
  nova: '',
  confirmacao: '',
})

const usuario = new ApiUsuario()

const notifications = useNotificationStore()

async function alterarSenha() {
  try {
    const _anterior = PasswordZ.parse(senhas.value.anterior)
    const _nova = PasswordZ.parse(senhas.value.nova)
    const _confirmacao = PasswordZ.parse(senhas.value.confirmacao)
    if (_confirmacao !== _nova) {
      error.value = 'Senhas não conferem!'
    } else {
      const res = await usuario.alterarSenha(_anterior, _nova)
      if (res.ok) {
        notifications.addNotification('Senha alterada com sucesso.')
        visivel.value = false
      } else {
        notifications.addNotification(res.statusText)
      }
    }
  } catch (err) {
    if (err instanceof ZodError) {
      error.value = err.issues[0].message
    } else if (err instanceof Error) {
      notifications.addNotification(err.message)
    }
  }
}
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
        v-model="senhas.anterior"
      />
      <LabeledInput
        class="floating-label justify-self-center w-full"
        html-type="password"
        html-place-holder="Nova Senha"
        label-text="Nova Senha"
        v-model="senhas.nova"
      />
      <LabeledInput
        class="floating-label justify-self-center w-full mb-2"
        html-type="password"
        html-place-holder="Nova Senha (Confirmação)"
        label-text="Nova Senha (Confirmação)"
        v-model="senhas.confirmacao"
      />
      <p v-if="error" class="text-error text-center">{{ error }}</p>
      <ButtonComponent class="btn-success mt-2" @click="alterarSenha">Confirmar</ButtonComponent>
      <ButtonComponent class="btn-error" @click="visivel = false">Cancelar</ButtonComponent>
    </CardComponent>
  </div>
</template>
