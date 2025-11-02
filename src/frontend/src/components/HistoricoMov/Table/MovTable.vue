<script setup lang="ts">
import MovTableRow from './MovTableRow.vue'
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
        <MovTableRow v-for="n in 10" :key="n" />
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
