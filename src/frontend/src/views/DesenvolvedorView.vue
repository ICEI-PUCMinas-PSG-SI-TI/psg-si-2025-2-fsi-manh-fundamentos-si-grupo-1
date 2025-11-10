<script setup lang="ts">
import CardTitleBar from '@/components/Card/CardTitleBar.vue'
import DevCardLotes from '@/components/dev/DevCardLotes.vue'
import DevCardProdutos from '@/components/dev/DevCardProdutos.vue'
import DevCardUnidadesMedida from '@/components/dev/DevCardUnidadesMedida.vue'
import DevCardUsuarios from '@/components/dev/DevCardUsuarios.vue'
import DevCardMovimentacoes from '@/components/dev/DevCardMovimentacoes.vue'
import DevCardCategorias from '@/components/dev/DevCardCategorias.vue'
</script>

<template>
  <div class="flex flex-col p-3 w-full">
    <div class="card bg-base-100 border-2 border-base-300 mb-4">
      <div class="card-body">
        <!-- TODO: Inserir o conteúdo dentro do title? -->
        <CardTitleBar title="Ferramentas de Desenvolvedor/Testes" class="mb-3" />
        <div class="m-2">
          <p>Aqui estão listadas varias ferramentas para facilitar os testes da aplicação.</p>
          <p>
            Dentre as funções, estão algumas ferramentas para criação de entidades, que agilizam o
            cadastro e testes.
          </p>
          <p>
            O proposito desta página é apenas realizar testes, portanto apenas usuários marcados
            como desenvolvedor possuem acesso.
          </p>
        </div>
      </div>
    </div>
    <div class="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <DevCardProdutos />
      <DevCardMovimentacoes />
      <DevCardUsuarios />
      <DevCardLotes />
      <DevCardUnidadesMedida />
      <DevCardCategorias />
    </div>
  </div>
</template>
