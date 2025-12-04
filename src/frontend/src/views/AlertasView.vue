<template>
  <div class="flex w-full flex-col gap-4 p-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 tracking-wide">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-500" />
        <p class="text-base-content text-2xl font-semibold">ALERTAS</p>
      </div>
      <button class="btn btn-outline btn-info" @click="verificarAlertas">
        <ArrowPathIcon class="size-4" />
        Verificar
      </button>
    </div>
    <!-- FILTRO POR MOTIVO -->
    <div class="flex items-center gap-4">
      <label class="text-base-content font-medium">Filtrar por motivo:</label>
      <select v-model="filtroMotivo" @change="obterAlertas" class="rounded border px-3 py-1">
        <option :value="null">Todos</option>
        <option :value="MotivoAlerta.Validade">Perto da validade</option>
        <option :value="MotivoAlerta.QuantidadeMaxima">Estoque acima do máximo</option>
        <option :value="MotivoAlerta.QuantidadeMinima">Estoque abaixo do mínimo</option>
      </select>
    </div>
    <!-- TABLE WRAPPER -->
    <div class="border-base-200 mt-4 overflow-hidden rounded-2xl border shadow">
      <table class="bg-base-200 w-full text-left">
        <thead class="text-sm uppercase">
          <tr>
            <th class="px-6 py-3">Nome</th>
            <th class="px-6 py-3">Motivo</th>
            <th class="px-6 py-3">Descrição</th>
            <th class="px-6 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in alertas" :key="a.id" class="hover:bg-base-100 border-t transition">
            <!-- DADOS -->
            <td class="px-6 py-4">{{ a._produto?.nome || a.produtoId }}</td>
            <td class="px-6 py-4">
              <template v-if="a.motivo == MotivoAlerta.QuantidadeMaxima">
                Quant. Minima Excedida
              </template>
              <template v-else-if="a.motivo == MotivoAlerta.QuantidadeMinima">
                Quant. Minima Antingida
              </template>
              <template v-else-if="a.motivo == MotivoAlerta.Validade"> Validade </template>
              <template v-else> Não Identificado </template>
            </td>
            <td class="px-6 py-4">
              <template v-if="a.motivo == MotivoAlerta.QuantidadeMaxima">
                A quantidade atual do produto está maior que a quantidade minima indicada.
              </template>
              <template v-else-if="a.motivo == MotivoAlerta.QuantidadeMinima">
                A quantidade atual do produto está menor que a quantidade minima indicada.
              </template>
              <template v-else-if="a.motivo == MotivoAlerta.Validade">
                O produto está perto da validade indicada.
              </template>
              <template v-else> N/A </template>
            </td>
            <!-- AÇÕES: BOTÕES BONITOS -->
            <td class="flex justify-center gap-2 px-6 py-4">
              <div class="tooltip" data-tip="Ignorar alerta por 24 horas">
                <button
                  @click="silenciar(a.id)"
                  class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200"
                >
                  <BellSlashIcon class="h-4 w-4" /> Ignorar
                </button>
              </div>
              <button
                class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-800 transition hover:bg-blue-200"
              >
                <PencilSquareIcon class="h-4 w-4" /> Visualizar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiAlertas from '@/api/alertas'
import { notificacoes } from '@/main'
import {
  ArrowPathIcon,
  BellSlashIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import { onMounted, ref, type Ref } from 'vue'
import {
  MotivoAlerta,
  type GetConsultaAlertasDto,
  type ParamsConsultaAlertas,
} from '../../../backend'

const filtroMotivo: Ref<MotivoAlerta | null> = ref(null)
const alertas: Ref<GetConsultaAlertasDto[]> = ref([])

async function obterAlertas() {
  const filtros = {
    pagina: 1,
    paginaTamanho: 100,
  } as ParamsConsultaAlertas
  if (filtroMotivo.value) {
    filtros.comMotivo = filtroMotivo.value
  }
  const res = await apiAlertas.consultar(filtros)
  if (res.ok && res.responseBody) {
    alertas.value = res.responseBody
  }
}

async function silenciar(id: string) {
  const res = await apiAlertas.silenciar(id)
  if (res.ok) {
    notificacoes.addNotification('Alerta silenciado temporariamente.')
    obterAlertas()
  }
}

async function verificarAlertas() {
  const res = await apiAlertas.verificar()
  if (res.ok) {
    notificacoes.addNotification('Alertas verificados.')
    obterAlertas()
  }
}

onMounted(() => obterAlertas())
</script>
