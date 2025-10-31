<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend mx-1">{{ labelText }}</legend>
    <input
      :type="htmlType"
      class="input input-md focus:outline-offset-0 w-full"
      :placeholder="htmlPlaceHolder"
      v-model="model"
    />
  </fieldset>
</template>

<script setup lang="ts">
defineProps(['labelText', 'htmlType', 'htmlPlaceHolder'])
const model = defineModel()
</script>
