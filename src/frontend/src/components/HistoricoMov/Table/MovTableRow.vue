<script setup lang="ts">
import { computed } from 'vue'

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
  colUsuario: string
  colProdutoNome: string
  colProdutoCodigo: string
  colLote: string
}>()

const data = computed(() => new Date(props.colData))
const dataDate = computed(() =>
  data.value.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
)
const dataTime = computed(() =>
  data.value.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
)

const observacao = computed(() => {
  if (props.colObservacao && props.colObservacao.length > 80) {
    return props.colObservacao.substring(0, 77) + '...'
  } else return props.colObservacao
})
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
      <p class="font-bold">{{ colUsuario }}</p>
    </td>
    <td>
      {{ colProdutoNome || 'Produto N/A' }}
      <br />
      <span class="badge badge-sm badge-primary">{{ colProdutoCodigo || 'Lote N/A' }}</span>
    </td>
    <td>{{ colQuantidade }}</td>
    <td>{{ colOrigem }}</td>
    <td>{{ colDestino }}</td>
    <!-- Limit to 80 characters-->
    <td>{{ observacao }}</td>
  </tr>
</template>
