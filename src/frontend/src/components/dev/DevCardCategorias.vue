<script setup lang="ts">
import apiFaker from '@/api/faker'
import ButtonComponent from '@/components/ButtonComponent.vue'
import LabeledInput from '@/components/LabeledInput.vue'
import { notificacoes } from '@/main'
import { ref } from 'vue'

const quant = ref(10)
const recurse = ref(false)

async function gerar() {
  const res = await apiFaker.criarCategorias(recurse.value, quant.value)
  if (res.ok) {
    notificacoes.addNotification('Categorias criadas com sucesso!', { time: 3000 })
  }
}

function deleteAll() {
  alert('deleteAll')
}

function deleteId(id: string) {
  alert(`delete(${id})`)
}

function show() {
  alert('show')
}
</script>

<template>
  <div class="card bg-base-100 border-2 border-base-300">
    <div class="card-body">
      <div class="flex flex-col p-2 gap-2">
        <div class="font-semibold text-xl mb-4">Lotes</div>
        <strong>Criar categorias com dados aleatórios</strong>
        <LabeledInput html-type="number" html-place-holder="Quantidade" v-model="quant" />
        <div class="flex flex-row items-center">
          <input type="checkbox" v-model="recurse" class="checkbox checkbox-md me-2" />
          <p>Recursivo: Gerar outras entidades dependentes se necessário.</p>
        </div>
        <ButtonComponent class="btn-success" @click="gerar"> Gerar </ButtonComponent>
        <hr />
        <p><strong>Deletar todos as categorias.</strong></p>
        <p>
          Observação: Isso também ira deletar outras informações associadas as {entidades}
          deletadas.
        </p>
        <ButtonComponent class="btn-error btn-disabled" @click="deleteAll">
          Deletar
        </ButtonComponent>
        <hr />
        <p><strong>Deletar categorias por ID</strong></p>
        <p>
          Observação: Isso também ira deletar outras informações associadas as {entidades}
          deletadas.
        </p>
        <LabeledInput html-type="text" html-place-holder="ID" disabled />
        <ButtonComponent class="btn-error btn-disabled" @click="deleteId">Deletar</ButtonComponent>
        <hr />
        <p><strong>Outros</strong></p>
        <!-- TODO: Inserir pagina e paginaTamanho -->
        <ButtonComponent class="btn-primary btn-disabled" @click="show">
          Mostrar categorias no console
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>
