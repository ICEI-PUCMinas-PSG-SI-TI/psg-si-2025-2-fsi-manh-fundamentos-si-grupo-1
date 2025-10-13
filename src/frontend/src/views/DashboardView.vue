<script setup lang="ts">
import { ref, type Ref } from 'vue'

// Demonstração: Criação de tipo unico
// Aqui é criado um novo tipo que possui numero e o seu nome por extenso
type Numeros = {
  numero: number
  extenso: string
}

// Aqui é criado uma referencia para um vetor de itens do tipo Numero
// Sempre que essa referência é atualizada o layout que depende dela é atualizado automaticamente
const listaItens: Ref<Numeros[]> = ref([
  {
    numero: 1,
    extenso: 'Um',
  },
  {
    numero: 2,
    extenso: 'Dois',
  },
  {
    numero: 3,
    extenso: 'Três',
  },
  {
    numero: 4,
    extenso: 'Quatro',
  },
])
</script>

<template>
  <div class="w-full h-full m-auto justify-center items-center text-center">
    <p>Dashboard</p>

    <div class="flex flex-col">
      <!-- Utilizando v-for o layout é replicado para cada valor da lista de itens -->
      <!-- obs: sempre utilizar uma chave/key para identificar o objeto -->
      <div
        v-for="item in listaItens"
        :key="item.numero"
        class="flex flex-col card card-body bg-base-200 m-2"
      >
        <p>Número: {{ item.numero }}</p>
        <p>Por extenso: {{ item.extenso }}</p>
      </div>
    </div>
  </div>
</template>
