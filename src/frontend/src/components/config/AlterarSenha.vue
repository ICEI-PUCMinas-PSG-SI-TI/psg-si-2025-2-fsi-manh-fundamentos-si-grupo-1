<script setup lang="ts">
import { ApiPerfil } from '@/api/perfil'
import { PasswordZ } from '@/services/objects'
import { useNotificationStore } from '@/store/config/toast'
import { ref } from 'vue'
import { ZodError } from 'zod/v4'
import ButtonComponent from '../ButtonComponent.vue'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import LabeledInput from '../LabeledInput.vue'

const visivel = defineModel()

const error = ref()

const senhas = ref({
  anterior: '',
  nova: '',
  confirmacao: '',
})

const usuario = new ApiPerfil()

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
    class="fixed top-0 right-0 bottom-0 left-0 z-10 flex size-full items-center justify-center align-middle backdrop-blur-lg"
  >
    <CardComponent class="max-w-auto m-auto w-full max-w-sm border">
      <CardTitleBar title="Alteração de senha" />
      <LabeledInput
        class="floating-label w-full justify-self-center"
        html-type="password"
        html-place-holder="Senha (Antiga)"
        label-text="Senha"
        v-model="senhas.anterior"
      />
      <LabeledInput
        class="floating-label w-full justify-self-center"
        html-type="password"
        html-place-holder="Nova Senha"
        label-text="Nova Senha"
        v-model="senhas.nova"
      />
      <LabeledInput
        class="floating-label mb-2 w-full justify-self-center"
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
