<template>
  <div class="flex flex-col w-full h-full p-4">
    <!-- Perfil do usuário -->
    <CardComponent>
      <CardTitleBar title="Perfil do usuário" />

      <div class="flex flex-col">
        <div class="flex flex-col justify-center items-center mb-4">
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
          class="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center align-middle items-center mb-8"
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
          <LabeledInput
            class="floating-label justify-self-center w-full"
            html-type="password"
            html-place-holder="Senha"
            label-text="Senha"
          />
          <LabeledInput
            class="floating-label justify-self-center w-full"
            html-type="password"
            html-place-holder="Senha (Confirmação)"
            label-text="Senha (Confirmação)"
          />
        </div>
        <ButtonComponent>Salvar</ButtonComponent>
      </div>
    </CardComponent>
    <!-- Configurações do sistema -->
    <CardComponent>
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
    <CardComponent>
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
          <ButtonComponent class="w-full" @click="adicionarCategoria">Adicionar</ButtonComponent>
        </div>
        <div class="xl:col-span-2">
          <div
            class="badge badge-xl badgde-soft badge-primary m-1"
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
    <CardComponent>
      <CardTitleBar title="Unidades de medida" />
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
        <form class="xl:col-span-1">
          <LabeledInput
            class="w-full"
            html-type="text"
            label-text="Unidades de medida"
            html-place-holder="Unidades de medida"
          />
          <LabeledInput
            class="w-full mb-4"
            html-type="text"
            label-text="Abreviação"
            html-place-holder="Abreviação"
          />
          <ButtonComponent class="w-full">Adicionar</ButtonComponent>
        </form>
        <div class="xl:col-span-2">
          <div
            class="badge badge-xl badgde-soft badge-primary m-1"
            v-for="unidade in unidadesMedida"
            :key="unidade.uuid"
          >
            <div class="flex flex-col">
              <p>{{ unidade.nome }} ({{ unidade.abrev }})</p>
            </div>
            <button>
              <XMarkIcon class="size-6" />
            </button>
          </div>
        </div>
      </div>
    </CardComponent>
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

const refConfig = ref({
  nomeCliente: '',
  cpfCnpj: '',
  endereco: '',
})

const refCategorias = ref([] as Categorias[])

// TODO: Verificar se é possível extrair o valor sem declarar uma ref
const refNovaCategoria = ref()

const unidadesMedida = ref([
  {
    uuid: 1,
    nome: 'Metro',
    abrev: 'm',
  },
  {
    uuid: 2,
    nome: 'Litro',
    abrev: 'L',
  },
  {
    uuid: 3,
    nome: 'Bytes',
    abrev: 'B',
  },
  {
    uuid: 4,
    nome: 'bits',
    abrev: 'b',
  },
])

const configuracoes = new ApiConfiguracoes()
const categorias = new ApiCategorias()

async function obterConfiguracoes() {
  const data = await configuracoes.obterTodos()
  if (data.ok) {
    refConfig.value = await data.json()
  } else {
    // TODO: mostrar toast
    alert(data.statusText)
  }
}

async function salvarConfiguracoes() {
  const res = await configuracoes.atualizar(refConfig.value)
  // TODO: mostrar toast
  // if (res.ok)
  alert(res.statusText)
}

async function obterCategorias() {
  const data = await categorias.obterTodos()
  if (data.ok) {
    refCategorias.value = await data.json()
  } else {
    // TODO: mostrar toast
    alert(data.statusText)
  }
}

async function adicionarCategoria() {
  const res = await categorias.criar(refNovaCategoria.value)
  if (res.ok) {
    obterCategorias()
  } else {
    alert(res.statusText)
  }
}

async function removerCategorias(id: string) {
  const res = await categorias.excluir(id)
  if (res.ok) {
    obterCategorias()
  } else {
    alert(res.statusText)
  }
}

obterConfiguracoes()
obterCategorias()
</script>
