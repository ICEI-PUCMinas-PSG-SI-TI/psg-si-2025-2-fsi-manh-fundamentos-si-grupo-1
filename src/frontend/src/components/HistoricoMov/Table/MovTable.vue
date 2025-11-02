<script setup lang="ts">
import { ApiMovimentacoes } from '@/api/movimentacoes'
import MovTableRow from './MovTableRow.vue'
import { ref, type Ref } from 'vue'
import { useNotificationStore } from '@/store/config/toast'

const noticicacoes = useNotificationStore()
const movimentacoes = new ApiMovimentacoes()
const refMovimentacoes: Ref<
  {
    id: string
  }[]
> = ref([])

async function obterMovimentacoes() {
  const res = await movimentacoes.obterTodos()
  if (res.ok) {
    refMovimentacoes.value = res.json()
  } else {
    noticicacoes.addNotification(res.statusText)
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
        <MovTableRow v-for="mov in refMovimentacoes" :key="mov.id" />
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
