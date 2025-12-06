<script setup lang="ts">
import { ApiAutenticacao } from '@/api/auth'
import { ApiPerfil } from '@/api/perfil'
import router from '@/router'
import { imageFileToBase64 } from '@/services/helpers'
import { limparConfiguracoes } from '@/services/storage'
import { useSessaoStore } from '@/store/config/sessao'
import { useNotificationStore } from '@/store/config/toast'
import { ref } from 'vue'
import type { SetPerfilDto } from '../../../../backend'
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
  const atualizarInformacoes = {
    login: refLogin.value,
    nome: refNome.value,
  } as SetPerfilDto
  if (novaFotoPerfil.value) {
    atualizarInformacoes.foto = novaFotoPerfil.value
  }
  const req = await usuario.atualizarPerfil(atualizarInformacoes)
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
    fotoPerfilSrc.value = data.responseBody.foto
  }
}

const novaFotoPerfil = ref<string>()
const fotoPerfilSrc = ref<string | null | undefined>()

async function validarFotoPerfil(event: Event) {
  const target = event.target
  if (target instanceof HTMLInputElement && target.files && target.files.length) {
    imageFileToBase64(target.files[0])
      .then((base64) => {
        fotoPerfilSrc.value = base64
        novaFotoPerfil.value = base64
      })
      .catch((message) => notificacoes.addNotification(message, { isError: true }))
  }
}

obterSessao()
</script>

<template>
  <CardComponent class="mb-4 flex flex-col">
    <CardTitleBar title="Perfil do usuário" />
    <div class="flex flex-col items-center justify-center">
      <!-- TODO: Verificar se o bundler interpreta corretamente a expressão src -->
      <img
        class="avatar h-32 w-32 rounded-full border object-cover"
        :src="fotoPerfilSrc || '/src/assets/profile.png'"
      />
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Escolha uma imagem</legend>
        <input type="file" class="file-input w-100" accept="image/*" @change="validarFotoPerfil" />
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
