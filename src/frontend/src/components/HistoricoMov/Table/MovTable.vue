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
  const res = await movimentacoes.obterTodos()
  if (res.ok && res.responseBody) {
    refMovimentacoes.value = res.responseBody as []
  }
}

obterMovimentacoes()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <!--
          <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th>
          -->
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
          :col-lote-id="mov.loteId"
          :col-user-id="mov.usuarioId"
          :col-quantidade="mov.quantidade"
          :col-tipo="mov.motivo"
          :col-product-id="mov.produtoId"
          :col-origem="mov.localOrigem"
          :col-destino="mov.localDestino"
          :col-observacao="mov.observacao"
        />
      </tbody>
      <!-- foot -->
      <tfoot>
        <tr>
          <th>Data</th>
          <th>Usuário</th>
          <th>Produto</th>
          <th>Quant.</th>
          <th>Origem</th>
          <th>Destino</th>
          <!-- TODO: Aumentar tamanho do campo caso haja texto -->
          <th>Observação</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
