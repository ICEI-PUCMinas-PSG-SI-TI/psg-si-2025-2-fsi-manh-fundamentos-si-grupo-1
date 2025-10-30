<template>
  <div class="flex flex-col w-full h-full p-4">
    <!-- Perfil do usuário -->
    <CardComponent>
      <CardTitleBar title="Perfil do usuário" />

      <form class="flex flex-col">
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
      </form>
    </CardComponent>
    <!-- Configurações do sistema -->
    <CardComponent>
      <CardTitleBar title="Configurações do sistema" />
      <form class="flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 justify-between">
          <LabeledInput
            class="floating-label me-2"
            html-type="text"
            html-place-holder="Nome da empresa"
            label-text="Nome da empresa"
          />
          <LabeledInput
            class="floating-label me-2"
            html-type="text"
            html-place-holder="CNPJ/CPF"
            label-text="CNPJ/CPF"
          />
          <LabeledInput
            class="floating-label me-2"
            html-type="text"
            html-place-holder="Endereço"
            label-text="Endereço"
          />
        </div>
        <ButtonComponent>Salvar</ButtonComponent>
      </form>
    </CardComponent>
    <!-- Categorias -->
    <CardComponent>
      <CardTitleBar title="Categorias" />
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
        <form class="flex flex-col w-full mb-4 gap-4 items-end xl:col-span-1">
          <LabeledInput
            class="w-full"
            html-type="text"
            label-text="Categoria"
            html-place-holder="Categoria"
          />
          <ButtonComponent class="w-full">Adicionar</ButtonComponent>
        </form>
        <div class="xl:col-span-2">
          <div
            class="badge badge-xl badgde-soft badge-primary m-1"
            v-for="value in categorias"
            :key="value"
          >
            <p>{{ value }}</p>
            <button>
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

const categorias = ref([
  'Automotivo',
  'Bebê',
  'Beleza',
  'Brinquedos',
  'Casa',
  'Computadores',
  'Crianças',
  'Eletrônicos',
  'Esportes',
  'Ferramentas',
  'Filmes',
  'Industrial',
  'Jardim',
  'Jogos',
  'Jóias',
  'Livros',
  'Mercearia',
  'Música',
  'Roupas',
  'Sapatos',
  'Saúde',
  'Turismo',
])
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
</script>
