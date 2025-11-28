<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from '../ButtonComponent.vue'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import LabeledInput from '../LabeledInput.vue'
import { Identificador } from '../../../../backend'
import { useNotificationStore } from '@/store/config/toast'
import { ApiConfiguracoes } from '@/api/configuracoes'

const configuracoes = new ApiConfiguracoes()

const notificacoes = useNotificationStore()

const refNomeCliente = ref<string | null>('')
const refCpfCnpj = ref<string | null>('')
const refEndereco = ref<string | null>('')
const refIdentificador = ref<Identificador | undefined>()

async function obterConfiguracoes() {
  const data = await configuracoes.obterTodos()
  if (data.ok && data.responseBody) {
    refNomeCliente.value = data.responseBody.nomeCliente
    refCpfCnpj.value = data.responseBody.cpfCnpj
    refEndereco.value = data.responseBody.endereco
    refIdentificador.value = data.responseBody.identificador
  }
}

// TODO: If refIdentificar alterado, refletic na base de dados
async function salvarConfiguracoes() {
  const res = await configuracoes.atualizar({
    nomeCliente: refNomeCliente.value,
    cpfCnpj: refCpfCnpj.value,
    endereco: refEndereco.value,
    identificador: refIdentificador.value,
  })
  if (res.ok) {
    notificacoes.addNotification('Informações alteradas.')
  }
}

async function substituirCodigos() {
  // TODO: Ter certeza que a configuração aqui é a mesma do backend
  const res = await configuracoes.alterarIdentificador(refIdentificador.value!)
  if (res.ok) {
    notificacoes.addNotification('Códigos alterados.', { time: 3000 })
  }
  obterConfiguracoes()
}

obterConfiguracoes()
</script>

<template>
  <CardComponent class="mb-4">
    <CardTitleBar title="Configurações do sistema" />
    <div class="flex flex-col gap-3 pt-4">
      <h2>Dados do sistema</h2>
      <hr />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 justify-between">
        <LabeledInput
          class="floating-label me-2"
          html-type="text"
          html-place-holder="Nome da empresa"
          label-text="Nome da empresa"
          v-model="refNomeCliente"
        />
        <LabeledInput
          class="floating-label me-2"
          html-type="text"
          html-place-holder="CNPJ/CPF"
          label-text="CNPJ/CPF"
          v-model="refCpfCnpj"
        />
        <LabeledInput
          class="floating-label me-2"
          html-type="text"
          html-place-holder="Endereço"
          label-text="Endereço"
          v-model="refEndereco"
        />
      </div>
      <h2>Código dos produtos</h2>
      <hr />
      <div class="flex flex-col">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Identificadores de Produtos</legend>
          <select class="select" v-model="refIdentificador">
            <option :value="Identificador.Numerico">Números (0123456789)</option>
            <option :value="Identificador.Hexadecimal">Hexadecimal (0123456789ABCDEFG)</option>
            <option :value="Identificador.Seguro">Seguro (6789BCDFGHJKMNPQRTW)</option>
          </select>
          <span class="label">Como os IDs serão gerados (com quais caracteres).</span>
        </fieldset>
      </div>
      <ButtonComponent @click="salvarConfiguracoes" class="bg-green-700 text-white">
        Salvar
      </ButtonComponent>
      <ButtonComponent class="btn-error" @click="substituirCodigos">
        Substituir códigos de produtos gerados.
      </ButtonComponent>
    </div>
  </CardComponent>
</template>
