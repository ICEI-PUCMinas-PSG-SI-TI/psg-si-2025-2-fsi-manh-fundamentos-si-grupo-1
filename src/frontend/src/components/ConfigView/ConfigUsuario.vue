<script setup lang="ts">
import { ApiPerfil } from '@/api/perfil'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import AlterarSenha from '../config/AlterarSenha.vue'
import LabeledInput from '../LabeledInput.vue'
import { ApiAutenticacao } from '@/api/auth'
import { ref } from 'vue'
import { useSessaoStore } from '@/store/config/sessao'
import { useNotificationStore } from '@/store/config/toast'
import { limparConfiguracoes } from '@/services/storage'
import router from '@/router'
import ButtonComponent from '../ButtonComponent.vue'

const autenticacao = new ApiAutenticacao()
const usuario = new ApiPerfil()

const useSessao = useSessaoStore()
const notificacoes = useNotificationStore()

const showAlterarSenha = ref<boolean>(false)
const refLogin = ref()
const refNome = ref()

async function alterarInformacoesUsuario() {
  const req = await usuario.alterarLoginNome(refLogin.value, refNome.value)
  if (req.ok) {
    notificacoes.addNotification('Informações alteradas.')
    obterSessao()
  }
}

async function deslogarSessao() {
  await autenticacao.logout()
  useSessao.logout()
  limparConfiguracoes()
  router.push('/login')
}

async function deslogarSessaoTodas() {
  // TODO: Confirmar primeiro
  await autenticacao.logoutAll()
  useSessao.logout()
  limparConfiguracoes()
  router.push('/login')
}

async function obterSessao() {
  // TODO: Criar serviço e armazenar informações
  const data = await autenticacao.sessao()
  if (data.ok && data.responseBody) {
    refLogin.value = data.responseBody.login
    refNome.value = data.responseBody.nome
  }
}

obterSessao()
</script>

<template>
  <CardComponent class="flex flex-col mb-4">
    <CardTitleBar title="Perfil do usuário" />
    <div class="flex flex-col justify-center items-center">
      <img
        class="avatar rounded-full border"
        width="100px"
        height="100px"
        src="@/assets/profile.png"
        alt=""
      />
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Escolha uma imagem</legend>
        <input type="file" class="file-input" />
        <label class="label">Tamanho máximo de 2MB</label>
      </fieldset>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-x-4 justify-center align-middle items-center mb-2"
    >
      <LabeledInput
        class="floating-label justify-self-center w-full"
        html-type="text"
        html-place-holder="Login"
        label-text="Login"
        v-model="refLogin"
      />
      <LabeledInput
        class="floating-label justify-self-center w-full"
        html-type="text"
        html-place-holder="Nome"
        label-text="Nome"
        v-model="refNome"
      />
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center align-middle items-center"
    >
      <ButtonComponent class="btn-accent" @click="alterarInformacoesUsuario">
        Salvar
      </ButtonComponent>
      <ButtonComponent class="btn-warning" @click="showAlterarSenha = true">
        Alterar Senha
      </ButtonComponent>
      <ButtonComponent class="btn-error" @click="deslogarSessao"> Deslogar </ButtonComponent>
      <ButtonComponent class="btn-error" @click="deslogarSessaoTodas">
        Deslogar de todas as sessões
      </ButtonComponent>
    </div>
  </CardComponent>
  <AlterarSenha v-if="showAlterarSenha" v-model="showAlterarSenha" />
</template>
