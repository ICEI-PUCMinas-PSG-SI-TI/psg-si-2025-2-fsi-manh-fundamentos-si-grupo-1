<script setup lang="ts">
import { PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const props = defineProps<{
  foto?: string
  nome: string
  login: string
  descricao?: string
  habilitado: boolean
}>()
const habilitadoCheked = ref(props.habilitado)
defineEmits(['editar', 'desabilitar', 'excluir'])
</script>

<template>
  <div class="flex items-center justify-between bg-base-200 rounded-2xl p-3 shadow">
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="rounded-full w-12 h-12">
          <img v-if="foto" :src="foto" alt="Avatar" />
          <UserCircleIcon />
        </div>
      </div>
      <div>
        <p class="font-bold">{{ nome || 'N/A' }} ({{ login || 'N/A' }})</p>
        <p class="text-sm text-gray-500">{{ descricao || 'N/A' }}</p>
      </div>
    </div>

    <div class="flex items-center gap-10">
      <button class="hover:scale-110 transition-transform cursor-pointer" @click="$emit('editar')">
        <PencilIcon class="w-6 h-6"></PencilIcon>
      </button>
      <button
        class="hover:scale-105 transition-transform"
        @click="$emit('desabilitar', !habilitadoCheked)"
      >
        <input type="checkbox" class="toggle scale-85" v-model="habilitadoCheked" />
      </button>
      <button class="hover:scale-110 transition-transform cursor-pointer" @click="$emit('excluir')">
        <TrashIcon class="w-6 h-6"></TrashIcon>
      </button>
    </div>
  </div>
</template>
