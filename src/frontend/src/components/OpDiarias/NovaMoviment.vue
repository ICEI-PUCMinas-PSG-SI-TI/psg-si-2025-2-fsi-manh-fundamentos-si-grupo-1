<template>
  <div
    class="fixed inset-0 flex justify-center items-start overflow-y-auto bg-black/40 backdrop-blur-sm z-50 p-4 overflow-x-hidden"
  >
    <CardComponent
      class="w-full max-w-2xl bg-base-200 rounded-2xl shadow-2xl border border-gray-300 p- animate-fadeIn"
    >
      <!-- Título -->
      <CardTitleBar title="Inserir Nova Movimentação" />

      <!-- Formulário -->
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 w-full" @submit.prevent="confirmar()">
        <!-- Produto + botão -->
        <div class="col-span-2 flex flex-col md:flex-row gap-3 items-start md:items-end">
          <div class="form-control w-full">
            <label class="label">
              <span class="fieldset-legend text-lg font-semibold">Produto *</span>
            </label>
            <input
              type="text"
              class="input input-md w-full"
              placeholder="Digite o nome do produto"
              v-model="produto"
              required
            />
          </div>

          <button
            type="button"
            class="btn btn-primary flex items-center gap-1 h-12 px-4 w-full md:w-auto"
          >
            <PlusIcon class="w-5" />
            Adicionar
          </button>
        </div>

        <!-- Quantidade -->
        <div class="form-control w-full">
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Quantidade *</span>
          </label>
          <input
            type="number"
            min="1"
            class="input input-md w-full"
            placeholder="0"
            v-model="quantidade"
            required
          />
        </div>

        <!-- Motivo -->
        <fieldset class="w-full flex flex-col gap-2">
          <legend class="fieldset-legend text-lg font-semibold">Motivo *</legend>
          <select class="select text-lg w-full" v-model="motivoSelect">
            <option :value="MotivoTransacoes.Compra">{{ MotivoTransacoes.Compra }}</option>
            <option :value="MotivoTransacoes.Venda">{{ MotivoTransacoes.Venda }}</option>
            <option :value="MotivoTransacoes.Devolucao">{{ MotivoTransacoes.Devolucao }}</option>
            <option :value="MotivoTransacoes.Perda">{{ MotivoTransacoes.Perda }}</option>
            <option :value="MotivoTransacoes.Transferencia">
              {{ MotivoTransacoes.Transferencia }}
            </option>
          </select>
        </fieldset>

        <!-- Observação -->
        <div class="form-control col-span-2">
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Observação</span>
          </label>
          <input
            type="text"
            class="input input-md w-full min-w-0"
            placeholder="Digite alguma observação"
            v-model="observacao"
          />
        </div>

        <!-- Campos origem e destino -->
        <div
          v-if="motivoSelect === MotivoTransacoes.Transferencia"
          class="form-control col-span-2 lg:col-span-1"
        >
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Local Origem *</span>
          </label>
          <input
            type="text"
            class="input input-md w-full min-w-0"
            placeholder="Ex: Depósito 1"
            v-model="origem"
            required
          />
        </div>

        <div
          v-if="motivoSelect === MotivoTransacoes.Transferencia"
          class="form-control col-span-2 lg:col-span-1"
        >
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Local Destino *</span>
          </label>
          <input
            type="text"
            class="input input-md w-full min-w-0"
            placeholder="Ex: Depósito 2"
            v-model="destino"
            required
          />
        </div>

        <!-- Botões -->
        <div class="flex flex-col md:flex-row justify-end gap-4 mt-8 col-span-2">
          <button
            class="bg-red-600 text-white px-6 py-2 rounded-xl w-full md:w-auto cursor-pointer transition-transform duration-100 hover:scale-103"
            @click="visivel = false"
          >
            Cancelar
          </button>

          <button
            class="bg-green-600 text-white px-6 py-2 rounded-xl w-full md:w-auto cursor-pointer transition-transform duration-100 hover:scale-103"
            type="submit"
          >
            Confirmar
          </button>
        </div>
      </form>
    </CardComponent>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { MotivoTransacoes } from '../../../../backend'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import { ref } from 'vue'

const visivel = defineModel()

const motivoSelect = ref<MotivoTransacoes>(MotivoTransacoes.Compra)
const produto = ref('')
const quantidade = ref<number | null>(null)
const origem = ref<string>('')
const destino = ref<string>('')
const observacao = ref<string>('')

function confirmar() {
  const dados = {
    produto: produto.value,
    quantidade: quantidade.value,
    motivo: motivoSelect.value,
    observacao: observacao.value,
    origem: origem.value,
    destino: destino.value,
  }
  visivel.value = false
  alert(`
  Produto: ${dados.produto}
  Quantidade: ${dados.quantidade}
  motivo: ${dados.motivo}
  observacao: ${dados.observacao}
  origem: ${dados.origem}
  destino: ${dados.destino}`)
}
</script>
