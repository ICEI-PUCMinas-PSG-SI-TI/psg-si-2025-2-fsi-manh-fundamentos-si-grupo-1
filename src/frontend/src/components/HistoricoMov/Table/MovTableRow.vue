<script setup lang="ts">
import MovTableProduct from './MovTableProduct.vue'
import MovTableUser from './MovTableUser.vue'

defineProps([
  'colUserId',
  'colProductId',
  'colLoteId',
  'colData',
  'colTipo',
  'colQuantidade',
  'colOrigem',
  'colDestino',
  'colObservacao',
])

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
      <p>02/11/2025</p>
      <p>16:11</p>
    </td>
    <td>
      <MovTableUser user-id="userId" />
    </td>
    <td>
      <MovTableProduct />
    </td>
    <td>500</td>
    <td>Belo Horizonte</td>
    <td>São Paulo</td>
    <!-- Limit to 80 characters-->
    <td class="">
      Ustulo adhaero soleo amplexus aro acceptus. Statim accendo acidus suspendo officia.
    </td>
  </tr>
</template>
