<template>
  <fieldset class="fieldset">
    <legend v-if="labelText" class="fieldset-legend mx-1">{{ labelText }}</legend>
    <input
      :type="htmlType"
      class="input input-md focus:outline-offset-0 w-full bg-base-100"
      :placeholder="htmlPlaceHolder"
      v-model="model"
    />
  </fieldset>
</template>

<script setup lang="ts">
defineProps(['labelText', 'htmlType', 'htmlPlaceHolder'])
const model = defineModel()
</script>
