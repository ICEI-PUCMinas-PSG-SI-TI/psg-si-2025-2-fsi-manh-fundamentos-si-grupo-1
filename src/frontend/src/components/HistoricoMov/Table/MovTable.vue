<script setup lang="ts">
import { ApiMovimentacoes } from '@/api/movimentacoes'
import MovTableRow from './MovTableRow.vue'
import { ref, type Ref } from 'vue'
import type { GetConsultaMovimentacaoDto } from '../../../../../backend'

const movimentacoes = new ApiMovimentacoes()
const refMovimentacoes: Ref<GetConsultaMovimentacaoDto[]> = ref([])

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
          :col-origem="mov.localOrigem || 'N/A'"
          :col-destino="mov.localDestino || 'N/A'"
          :col-observacao="mov.observacao || ''"
          :col-usuario="mov._usuario.nome"
          :col-produto-nome="mov._produto.nome"
          :col-produto-codigo="mov._produto.codigo"
          :col-lote="mov._lote.codigo"
        />
      </tbody>
    </table>
  </div>
</template>
