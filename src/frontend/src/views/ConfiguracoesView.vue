<template>
  <div class="flex flex-col w-full h-full p-4">
    <!-- Perfil do usuário -->
    <CardComponent class="flex flex-col mb-4">
      <CardTitleBar title="Perfil do usuário" />
      <div class="flex flex-col justify-center items-center">
        <img
          class="avatar rounded-full border"
          width="100px"
          height="100px"
          src="../assets/profile.png"
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
        />
        <LabeledInput
          class="floating-label justify-self-center w-full"
          html-type="text"
          html-place-holder="Nome"
          label-text="Nome"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center align-middle items-center">
        <ButtonComponent class="btn-accent">Salvar</ButtonComponent>
        <ButtonComponent class="btn-warning" @click="showAlterarSenha = true">
          Alterar Senha
        </ButtonComponent>
      </div>
    </CardComponent>
    <!-- Configurações do sistema -->
    <CardComponent class="mb-4">
      <CardTitleBar title="Configurações do sistema" />
      <div class="flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 justify-between">
          <LabeledInput
            class="floating-label me-2"
            html-type="text"
            html-place-holder="Nome da empresa"
            label-text="Nome da empresa"
            v-model="refConfig.nomeCliente"
          />
          <LabeledInput
            class="floating-label me-2"
            html-type="text"
            html-place-holder="CNPJ/CPF"
            label-text="CNPJ/CPF"
            v-model="refConfig.cpfCnpj"
          />
          <LabeledInput
            class="floating-label me-2"
            html-type="text"
            html-place-holder="Endereço"
            label-text="Endereço"
            v-model="refConfig.endereco"
          />
        </div>
        <ButtonComponent @click="salvarConfiguracoes">Salvar</ButtonComponent>
      </div>
    </CardComponent>
    <!-- Categorias -->
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
          <div
            class="badge badge-lg badgde-soft badge-primary m-1"
            v-for="categoria in refCategorias"
            :key="categoria.id"
          >
            <p>{{ categoria.nome }}</p>
            <button class="btn btn-xs btn-primary" @click="removerCategorias(categoria.id)">
              <XMarkIcon class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </CardComponent>
    <!-- Unidades de medida -->
    <CardComponent class="mb-4">
      <CardTitleBar title="Unidades de medida" />
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
        <div class="xl:col-span-1">
          <LabeledInput
            class="w-full"
            html-type="text"
            label-text="Nome da unidades de medida"
            html-place-holder="Nome da unidades de medida"
            v-model="refNovaUnidadeMedida.nome"
          />
          <LabeledInput
            class="w-full mb-4"
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
    <AlterarSenha v-if="showAlterarSenha" v-model="showAlterarSenha" />
  </div>
</template>

<script setup lang="ts">
import CardComponent from '@/components/Card/CardComponent.vue'
import CardTitleBar from '@/components/Card/CardTitleBar.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import LabeledInput from '@/components/LabeledInput.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { ApiConfiguracoes } from '@/api/configuracoes'
import { ApiCategorias, type Categorias } from '@/api/categorias'
import { ApiUnidadesMedida, type UnidadeMedida } from '@/api/unidades'
import { useNotificationStore } from '@/store/config/toast'
import AlterarSenha from '@/components/config/AlterarSenha.vue'

const refConfig = ref({
  nomeCliente: '',
  cpfCnpj: '',
  endereco: '',
})

const refCategorias = ref([] as Categorias[])

// TODO: Verificar se é possível extrair o valor sem declarar uma ref
const refNovaCategoria = ref()

const refNovaUnidadeMedida = ref({
  nome: '',
  abreviacao: '',
})

const showAlterarSenha = ref(false)

const refUnidadesMedida = ref([] as UnidadeMedida[])

const configuracoes = new ApiConfiguracoes()
const categorias = new ApiCategorias()
const unidadesMedida = new ApiUnidadesMedida()

const notificacoes = useNotificationStore()

async function obterConfiguracoes() {
  const data = await configuracoes.obterTodos()
  if (data.ok) {
    refConfig.value = await data.json()
  } else {
    // TODO: mostrar toast
    notificacoes.addNotification(data.statusText, true)
  }
}

async function salvarConfiguracoes() {
  const res = await configuracoes.atualizar(refConfig.value)
  // TODO: mostrar toast
  // if (res.ok)
  notificacoes.addNotification(res.statusText, true)
}

async function obterCategorias() {
  const data = await categorias.obterTodos()
  if (data.ok) {
    refCategorias.value = await data.json()
  } else {
    // TODO: mostrar toast
    notificacoes.addNotification(data.statusText, true)
  }
}

async function adicionarCategoria() {
  const res = await categorias.criar(refNovaCategoria.value)
  if (res.ok) {
    obterCategorias()
  } else {
    notificacoes.addNotification(res.statusText, true)
  }
}

async function removerCategorias(id: string) {
  const res = await categorias.excluir(id)
  if (res.ok) {
    obterCategorias()
  } else {
    notificacoes.addNotification(res.statusText, true)
  }
}

async function obterUnidadesMedida() {
  const data = await unidadesMedida.obterTodos()
  if (data.ok) {
    refUnidadesMedida.value = await data.json()
  } else {
    notificacoes.addNotification(data.statusText, true)
  }
}

async function adicionarUnidadeMedida() {
  const { nome, abreviacao } = refNovaUnidadeMedida.value
  const res = await unidadesMedida.criar(nome, abreviacao)
  if (res.ok) {
    obterUnidadesMedida()
  } else {
    notificacoes.addNotification(res.statusText, true)
  }
}

async function removerUnidadeMedida(id: string) {
  const res = await unidadesMedida.excluir(id)
  if (res.ok) {
    obterUnidadesMedida()
  } else {
    notificacoes.addNotification(res.statusText, true)
  }
}

obterConfiguracoes()
obterCategorias()
obterUnidadesMedida()
</script>
