<script setup lang="ts">
import { computed } from 'vue'
import MovTableProduct from './MovTableProduct.vue'
import { ref, watch, type Ref } from 'vue'
import { ApiUsuario } from '@/api/usuario'

const props = defineProps<{
  colUserId: string
  colProductId: string
  colLoteId: string
  colData: string
  colTipo: string // TODO: Sem uso
  colQuantidade: number
  colOrigem: string
  colDestino: string
  colObservacao: string
}>()

const data = computed(() => new Date(props.colData))
const dataDate = computed(() =>
  data.value.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
)
const dataTime = computed(() =>
  data.value.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
)

const redUsuarioId = ref(props.colUserId)
const refUsuariodata: Ref<{
  id?: string
  nome?: string
}> = ref({})

const usuarios = new ApiUsuario()

async function obterUsuario(id: string) {
  const res = await usuarios.obter(id)
  if (res.ok) {
    refUsuariodata.value = await res.json()
  }
  // TODO: Criar campos padrão
}

watch(redUsuarioId, obterUsuario)
obterUsuario(props.colUserId)

// const isChecked = defineModel()
</script>

<template>
  <tr>
    <!--
    <th>
      <label>
        <input type="checkbox" class="checkbox" v-model="isChecked" />
      </label>
    </th>
    -->
    <td>
      <p>{{ dataDate }}</p>
      <p>{{ dataTime }}</p>
    </td>
    <td>
      <p class="font-bold">{{ refUsuariodata.nome || 'N/A' }}</p>
    </td>
    <td>
      <MovTableProduct :product-id="colProductId" :lote-id="colLoteId" />
    </td>
    <td>{{ colQuantidade }}</td>
    <td>{{ colOrigem }}</td>
    <td>{{ colDestino }}</td>
    <!-- Limit to 80 characters-->
    <td class="">
      {{ colObservacao.substring(0, 80) }}
    </td>
  </tr>
</template>
