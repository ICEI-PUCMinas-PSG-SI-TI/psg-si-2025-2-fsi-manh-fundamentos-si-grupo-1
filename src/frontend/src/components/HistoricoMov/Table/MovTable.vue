<script setup lang="ts">
import { ApiMovimentacoes } from '@/api/movimentacoes'
import MovTableRow from './MovTableRow.vue'
import { ref, type Ref } from 'vue'

const movimentacoes = new ApiMovimentacoes()
const refMovimentacoes: Ref<
  {
    id: string
    produtoId: string
    usuarioId: string
    loteId: string
    motivo: string
    quantidade: number
    horario: string
    localOrigem: string
    localDestino: string
    observacao: string
  }[]
> = ref([])

async function obterMovimentacoes() {
  const res = await movimentacoes.obterTodos({
    pagina: 1,
    paginaTamanho: 100,
  })
  if (res.ok && res.responseBody) {
    refMovimentacoes.value = res.responseBody as []
  }
}

obterMovimentacoes()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Usuário</th>
          <th>Produto</th>
          <th>Quant.</th>
          <th>Origem</th>
          <th>Destino</th>
          <th>Observação</th>
        </tr>
      </thead>
      <tbody>
        <MovTableRow
          v-for="mov in refMovimentacoes"
          :key="mov.id"
          :col-data="mov.horario"
          :col-user-id="mov.usuarioId"
          :col-product-id="mov.produtoId"
          :col-lote-id="mov.loteId"
          :col-quantidade="mov.quantidade"
          :col-tipo="mov.motivo"
          :col-origem="mov.localOrigem"
          :col-destino="mov.localDestino"
          :col-observacao="mov.observacao"
        />
      </tbody>
    </table>
  </div>
</template>
