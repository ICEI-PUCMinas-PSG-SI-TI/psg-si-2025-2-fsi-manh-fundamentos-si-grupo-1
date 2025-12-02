<template>
  <div
    class="fixed inset-0 flex justify-center items-start overflow-y-auto bg-black/40 backdrop-blur-sm z-50 p-4 overflow-x-hidden"
  >
    <CardComponent
      class="w-full max-w-2xl bg-base-200 rounded-2xl shadow-2xl border border-gray-300 p- animate-fadeIn"
    >
      <!-- Título -->
      <CardTitleBar title="Inserir Nova Movimentação" />

      <!-- Formulário -->
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 w-full" @submit.prevent="confirmar()">
        <!-- Produto + Lote + Botão Adicionar -->
        <div class="col-span-2 flex flex-col md:flex-row gap-3 items-start md:items-end">
          <!-- Produto -->
          <div class="form-control w-full">
            <label class="label">
              <span class="fieldset-legend text-lg font-semibold">Produto *</span>
            </label>
            <select class="select select-bordered w-full" v-model="produto" required>
              <option disabled value="">Selecione um produto</option>
              <option v-for="p in produtos" :key="p.id" :value="p">
                {{ p.nome }}
              </option>
            </select>
          </div>

          <!-- Lote -->
          <div class="form-control w-full">
            <label class="label">
              <span class="fieldset-legend text-lg font-semibold">Lote *</span>
            </label>
            <select
              class="select select-bordered w-full"
              v-model="lote"
              :disabled="criarLote"
              required
            >
              <option v-if="refLotes.length === 0" disabled>N/A</option>
              <option v-for="l in refLotes" :key="l.id" :value="l">
                {{ l.codigo }}
              </option>
            </select>
          </div>

          <!-- Botão Adicionar -->
          <button
            type="button"
            class="btn btn-primary flex items-center gap-1 h-12 px-4 w-full md:w-auto"
          >
            <PlusIcon class="w-5" />
            Adicionar Produto
          </button>
        </div>

        <!-- Criar novo lote -->
        <div class="col-span-2 flex flex-col md:flex-row gap-3 items-center mt-2">
          <!-- Checkbox Criar Lote -->
          <label class="cursor-pointer flex items-center gap-2">
            <input type="checkbox" v-model="criarLote" />
            Criar novo lote
          </label>

          <!-- Código do Lote (aparece se criarLote) -->
          <input
            v-if="criarLote"
            type="text"
            placeholder="Código do lote"
            class="input input-bordered w-full md:w-auto"
            v-model="novoCodigoLote"
            required
          />

          <!-- Validade do Lote -->
          <div v-if="criarLote" class="flex items-center gap-2">
            <label class="whitespace-nowrap">Validade</label>
            <input
              type="date"
              v-model="validade"
              class="input input-bordered w-full md:w-auto"
              required
            />
          </div>
        </div>

        <!-- Quantidade -->
        <div class="form-control w-full">
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Quantidade *</span>
          </label>
          <input
            type="number"
            min="1"
            class="input input-md w-full"
            placeholder="0"
            v-model="quantidade"
            required
          />
        </div>

        <!-- Motivo -->
        <fieldset class="w-full flex flex-col gap-2">
          <legend class="fieldset-legend text-lg font-semibold">Motivo *</legend>
          <select class="select text-lg w-full" v-model="motivoSelect">
            <option :value="MotivoTransacoes.Compra">{{ MotivoTransacoes.Compra }}</option>
            <option :value="MotivoTransacoes.Venda">{{ MotivoTransacoes.Venda }}</option>
            <option :value="MotivoTransacoes.Devolucao">{{ MotivoTransacoes.Devolucao }}</option>
            <option :value="MotivoTransacoes.Perda">{{ MotivoTransacoes.Perda }}</option>
            <option :value="MotivoTransacoes.Transferencia">
              {{ MotivoTransacoes.Transferencia }}
            </option>
          </select>
        </fieldset>

        <!-- Observação -->
        <div class="form-control col-span-2">
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Observação</span>
          </label>
          <input
            type="text"
            class="input input-md w-full min-w-0"
            placeholder="Digite alguma observação"
            v-model="observacao"
          />
        </div>

        <!-- Campos origem e destino -->
        <div
          v-if="motivoSelect === MotivoTransacoes.Transferencia"
          class="form-control col-span-2 lg:col-span-1"
        >
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Local Origem *</span>
          </label>
          <input
            type="text"
            class="input input-md w-full min-w-0"
            placeholder="Ex: Depósito 1"
            v-model="origem"
            required
          />
        </div>

        <div
          v-if="motivoSelect === MotivoTransacoes.Transferencia"
          class="form-control col-span-2 lg:col-span-1"
        >
          <label class="label">
            <span class="fieldset-legend text-lg font-semibold">Local Destino *</span>
          </label>
          <input
            type="text"
            class="input input-md w-full min-w-0"
            placeholder="Ex: Depósito 2"
            v-model="destino"
            required
          />
        </div>

        <!-- Botões -->
        <div class="flex flex-col md:flex-row justify-end gap-4 mt-8 col-span-2">
          <button
            class="bg-red-600 text-white px-6 py-2 rounded-xl w-full md:w-auto cursor-pointer transition-transform duration-100 hover:scale-103"
            @click="visivel = false"
          >
            Cancelar
          </button>

          <button
            class="bg-green-600 text-white px-6 py-2 rounded-xl w-full md:w-auto cursor-pointer transition-transform duration-100 hover:scale-103"
            type="submit"
          >
            Confirmar
          </button>
        </div>
      </form>
    </CardComponent>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { MotivoTransacoes, type GetConsultaProdutoDto } from '../../../../backend'
import CardComponent from '../Card/CardComponent.vue'
import CardTitleBar from '../Card/CardTitleBar.vue'
import { onMounted, ref, watch, computed, type Ref } from 'vue'
import { ApiProdutos } from '@/api/produtos'
import { ApiAutenticacao } from '@/api/auth'

const visivel = defineModel()

// Refs
const motivoSelect = ref<MotivoTransacoes>(MotivoTransacoes.Compra)
const produto = ref<GetConsultaProdutoDto | null>(null)

const quantidade = ref<number | null>(null)
const origem = ref<string>('')
const destino = ref<string>('')
const observacao = ref<string>('')

// Lotes
const lote = ref<{ id: string; codigo: string } | null>(null)
const refLotes: Ref<{ id: string; codigo: string }[]> = ref([])
const criarLote = ref(false)
const novoCodigoLote = ref('')

const validade = ref<string|null>(null)



const refProdutos: Ref<GetConsultaProdutoDto[]> = ref([])

// Produtos únicos por nome

const produtos = computed(() => {
  const mapa = new Map<string, GetConsultaProdutoDto>()
  for (const p of refProdutos.value) {
    if (!mapa.has(p.nome)) {
      mapa.set(p.nome, p)
    }
  }
  return Array.from(mapa.values())
})

// Carregar produtos
const apiProdutos = new ApiProdutos()
onMounted(() => {
  carregarProdutos()
  obterSessao()
})

async function carregarProdutos() {
  const res = await apiProdutos.obterTodos()
  if (res.ok && res.responseBody) {
    refProdutos.value = res.responseBody.sort((a, b) => a.nome.localeCompare(b.nome))
  }
}

// Watch produto para carregar lotes
//watch é um função que observa uma variável reativa(produto) e executa o codigo
//sempre q muda

watch(produto, async (p) => {
  if (p) {
    const res = await fetch(`/api/v1/lotes?produtoId=${p.id}`)
    const data = await res.json()
    refLotes.value = data.length ? data : []
  } else {
    refLotes.value = []
  }
})

const usuarioId = ref<string | null>(null)
const autenticacao = new ApiAutenticacao()
async function obterSessao() {
  const data = await autenticacao.sessao()
  if (data.ok && data.responseBody) {
    usuarioId.value = data.responseBody.id
  } else {
    usuarioId.value = null
  }
}

// Confirmar movimentação
async function confirmar() {
  try {
    let loteId: string;
    let validadeIso:string | null = null

    if (criarLote.value && validade.value) {
      validadeIso = new Date(validade.value).toISOString();
      const resLote = await fetch('/api/v1/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoId: produto.value?.id,
          codigo: novoCodigoLote.value,
          quantidade: 0,
          validade: validadeIso
        })
      });

      if (!resLote.ok) {
        throw new Error('Erro ao criar o lote');
      }

      const dataLote = await resLote.json();
      console.log(dataLote)
      loteId = dataLote.id;
      alert("LOte criado") // pega o ID do lote recém-criado
    }
    else
    {
      if (!lote.value) throw new Error('Nenhum lote selecionado');
      loteId = lote.value.id;
    }

    if (!produto.value) {
      throw new Error('Selecione um produto para criar um lote!')
    }

    const resMov = await fetch('/api/v1/transacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loteId: loteId,
        quantidade: quantidade.value,
        motivo: motivoSelect.value,
        produtoId: produto.value.id,
        localOrigem: origem.value ,
        localDestino: destino.value ,
        observacao: observacao.value,
        usuarioId: usuarioId.value,
        horario: new Date().toISOString(),

      })
    });

    if (!resMov.ok) {
      throw new Error('Erro ao criar a movimentação');
    }

    alert('Movimentação criada com sucesso!');
    visivel.value = false;

  } catch (error) {
    console.error(error);
    alert(`Ocorreu um erro: ${(error as Error).message}`);
  }
}

</script>
