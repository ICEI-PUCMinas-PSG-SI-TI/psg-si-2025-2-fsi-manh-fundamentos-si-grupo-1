<script setup lang="ts">
import { PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const props = defineProps<{
  foto?: string | null
  nome: string
  login: string
  descricao?: string | null
  habilitado: boolean
}>()
const habilitadoCheked = ref(props.habilitado)
defineEmits(['editar', 'desabilitar', 'excluir'])
</script>

<template>
  <div class="bg-base-200 flex items-center justify-between rounded-2xl p-3 shadow">
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="h-12 w-12 rounded-full">
          <UserCircleIcon v-if="!foto" />
          <img
            v-if="foto"
            class="avatar h-full w-full rounded-full border object-cover"
            :src="foto"
          />
        </div>
      </div>
      <div>
        <p class="font-bold">{{ nome || 'N/A' }} ({{ login || 'N/A' }})</p>
        <p class="text-sm text-gray-500">{{ descricao || 'N/A' }}</p>
      </div>
    </div>

    <div class="flex items-center gap-10">
      <button class="cursor-pointer transition-transform hover:scale-110" @click="$emit('editar')">
        <PencilIcon class="h-6 w-6"></PencilIcon>
      </button>
      <button
        class="transition-transform hover:scale-105"
        @click="$emit('desabilitar', !habilitadoCheked)"
      >
        <input type="checkbox" class="toggle scale-85" v-model="habilitadoCheked" />
      </button>
      <button class="cursor-pointer transition-transform hover:scale-110" @click="$emit('excluir')">
        <TrashIcon class="h-6 w-6"></TrashIcon>
      </button>
    </div>
  </div>
</template>
