<template>
  <div class="w-full min-h-screen">
    <h1 class="m-15 mt-7 text-6xl font-bold">Operações Diárias</h1>
    <div class="bg-base-200 m-15 pt-2 pb-1 rounded-2xl min-h-screen">
      <!--Compras, vendas e filtrar por data-->
      <div class="flex gap-15 m-6">
        <button
          @click="botaoAtivoC=true ; botaoAtivoV=false"
          class="flex flex-1 bg-stone-700 p-4 rounded-lg items-center gap-2 cursor-pointer hover:bg-stone-700 transition-transform duration-200 transform hover:scale-105"
          :class="botaoAtivoC===true
          ? 'scale-104'
          :''"
        >
          <ShoppingCartIcon class="w-15
           "
           :class="botaoAtivoC === true?'text-green-500': 'text-white'"></ShoppingCartIcon>
          <span
            class="text-2xl ml-6 "
            :class="botaoAtivoC === true?'text-green-500': 'text-white'"
            >
            Compras
        </span>
        </button>
        <button
        @click="botaoAtivoC=false; botaoAtivoV=true"
          class="flex flex-1 h-40 bg-stone-700 p-4 rounded-lg items-center gap-2 cursor-pointer hover:bg-stone-700 transition-transform duration-200 transform hover:scale-105"
          :class="botaoAtivoV===true
          ?'scale-104'
          :''"
        >
          <ShoppingBagIcon
          class="w-15 "
          :class="botaoAtivoV===true? 'text-green-500': 'text-white'"
          >
        </ShoppingBagIcon>
          <span class="text-2xl ml-6"
          :class="botaoAtivoV===true? 'text-green-500 ': 'text-white'">Vendas</span>
        </button>
        <div class="flex flex-col bg-stone-700 p-4 rounded-lg flex-1 items-center justify-center">
          <span class="text-2xl font-medium mb-4 text-white">Filtrar por data</span>
          <input
            type="date"
            class=" input input-bordered w-70  px-2 rounded-lg"
          />

        </div>
      </div>
      <!--div buscar produto, nova movimentação e histórico-->
      <div class="bg-stone-700 m-6 rounded-2xl pt-1 min-h-screen">
        <!--Buscar Produto e Nova Movimentação-->
        <div class="m-6 flex justify-between items-center mb-6">
          <div class="relative w-80">
            <input
              type="text"
              placeholder="BUSCAR PRODUTO..."
              class="w-full px-10 py-2 rounded-3xl bg-white text-black focus:outline-none"
            />
            <MagnifyingGlassIcon
              class="w-6  text-black absolute left-2 top-1/2 -translate-y-1/2"
            />
          </div>
          <button
            class="bg-white w-60 flex text-black font-semibold px-4 py-2 rounded-xl  transition-tranform duration-100 transform hover:scale-103 cursor-pointer"
          >
            <PlusIcon class="w-5 mr-2"></PlusIcon>  NOVA MOVIMENTAÇÃO
          </button>
        </div>
        <div class="m-6">
          <h3 class="text-3xl font-semibold mb-2 text-white">Histórico</h3>
          <table class="w-full text-left border-t border-white">
            <thead>
              <tr class="text-white text-2xl">
                <th class="py-2">Hora</th>
                <th class="py-2">Tipo</th>
                <th class="py-2">Produto</th>
                <th class="py-2">Qtd</th>
                <th class="py-2">Usuário</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-xl">
                <td class="py-2">dfaggds</td>
                <td class="py-2">gdsagd</td>
                <td class="py-2">dsagdg</td>
                <td class="py-2">dsgasdg</td>
                <td class="py-2">sdgasdg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCartIcon, ShoppingBagIcon, MagnifyingGlassIcon, PlusIcon} from '@heroicons/vue/24/outline'
import { ref } from 'vue';

const botaoAtivoC = ref<boolean>(false)
const botaoAtivoV = ref<boolean>(false)
</script>
