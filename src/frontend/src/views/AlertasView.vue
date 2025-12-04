<template>
  <div class="p-6 w-full flex flex-col gap-4">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div class="tracking-wide flex items-center gap-2">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-500" />
        <p class="text-base-content text-2xl font-semibold">ALERTAS</p>
      </div>
      <button class="btn btn-outline btn-info">
        <ArrowPathIcon class="size-4" />
        Verificar
      </button>
    </div>
    <!-- FILTRO POR MOTIVO -->
    <div class="flex items-center gap-4">
      <label class="font-medium text-base-content">Filtrar por motivo:</label>
      <select v-model="filtroMotivo" @change="obterAlertas" class="border rounded px-3 py-1">
        <option :value="null">Todos</option>
        <option :value="MotivoAlerta.Validade">Perto da validade</option>
        <option :value="MotivoAlerta.QuantidadeMaxima">Estoque acima do máximo</option>
        <option :value="MotivoAlerta.QuantidadeMinima">Estoque abaixo do mínimo</option>
      </select>
    </div>
    <!-- TABLE WRAPPER -->
    <div class="shadow rounded-2xl overflow-hidden border border-base-200 mt-4">
      <table class="w-full text-left bg-base-200">
        <thead class="text-sm uppercase">
          <tr>
            <th class="px-6 py-3">Nome</th>
            <th class="px-6 py-3">Motivo</th>
            <th class="px-6 py-3">Descrição</th>
            <th class="px-6 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in alertas" :key="a.id" class="border-t hover:bg-base-100 transition">
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
            <td class="px-6 py-4 flex justify-center gap-2">
              <div class="tooltip" data-tip="Ignorar alerta por 24 horas">
                <button
                  @click="silenciar(a.id)"
                  class="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                >
                  <BellSlashIcon class="w-4 h-4" /> Ignorar
                </button>
              </div>
              <button
                class="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition"
              >
                <PencilSquareIcon class="w-4 h-4" /> Visualizar
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

onMounted(() => obterAlertas())
</script>
