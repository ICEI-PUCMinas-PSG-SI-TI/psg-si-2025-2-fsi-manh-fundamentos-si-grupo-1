<script setup lang="ts">
import { ApiAutenticacao } from '@/api/auth'
import { ApiPerfil } from '@/api/perfil'
import router from '@/router'
import { limparConfiguracoes } from '@/services/storage'
import { useSessaoStore } from '@/store/config/sessao'
import { useNotificationStore } from '@/store/config/toast'
import { ref } from 'vue'
import ButtonComponent from '../ButtonComponent.vue'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import AlterarSenha from '../config/AlterarSenha.vue'
import LabeledInput from '../LabeledInput.vue'

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
  <CardComponent class="mb-4 flex flex-col">
    <CardTitleBar title="Perfil do usuário" />
    <div class="flex flex-col items-center justify-center">
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
      class="mb-2 grid grid-cols-1 items-center justify-center gap-x-4 align-middle md:grid-cols-2"
    >
      <LabeledInput
        class="floating-label w-full justify-self-center"
        html-type="text"
        html-place-holder="Login"
        label-text="Login"
        v-model="refLogin"
      />
      <LabeledInput
        class="floating-label w-full justify-self-center"
        html-type="text"
        html-place-holder="Nome"
        label-text="Nome"
        v-model="refNome"
      />
    </div>
    <div
      class="grid grid-cols-1 items-center justify-center gap-4 align-middle md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
