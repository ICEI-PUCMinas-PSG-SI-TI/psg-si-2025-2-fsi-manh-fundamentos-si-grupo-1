<template>
  <div class="min-h-full p-6">
    <h1 class="mb-6 text-3xl font-bold">Informações do Produto</h1>

    <!-- Layout principal -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Card esquerdo -->
      <div class="bg-base-200 rounded-2xl p-5 shadow lg:col-span-2">
        <div class="flex w-full flex-wrap justify-center gap-4">
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Nome do Produto</label>
            <input v-model="produtoNome" type="text" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Código</label>
            <input v-model="produtoCodigo" type="text" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>SKU</label>
            <input v-model="produtoSku" type="text" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Código de barras (EAN/UPC)</label>
            <input v-model="produtoCodigoBarra" type="text" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs md:col-span-2">
            <label>Descrição</label>
            <textarea
              v-model="produtoDescricao"
              class="input h-28 focus:outline-offset-0"
            ></textarea>
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Categoria</label>
            <input v-model="categoria" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Marca</label>
            <input v-model="produtoMarca" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Fornecedor</label>
            <input v-model="produtoFornecedor" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Dimensões</label>
            <input v-model="produtoDimensoes" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Peso</label>
            <input v-model="produtoPeso" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Unidade de Medida</label>
            <input v-model="medidas" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Preço Custo</label>
            <input v-model="produtoPrecoCusto" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Preço Venda</label>
            <input v-model="produtoPrecoVenda" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Preço Promocional</label>
            <input v-model="produtoPrecoPromocao" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Estoque mínimo</label>
            <input v-model="produtoQuantidadeMinima" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Estoque máximo</label>
            <input v-model="produtoQuantidadeMaxima" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Localidade do Estoque</label>
            <input v-model="produtoLocalizacao" class="input focus:outline-offset-0" />
          </fieldset>
          <fieldset class="fieldset max-w-4xs min-w-2xs">
            <label>Status do Produto</label>
            <select v-model="produtoStatus" class="select input focus:outline-offset-0">
              <option :value="StatusProduto.Ativo">Ativo</option>
              <option :value="StatusProduto.Inativo">Inativo</option>
              <option :value="StatusProduto.Bloqueado">Bloqueado</option>
              <option :value="StatusProduto.Descontinuado">Descontinuado</option>
            </select>
          </fieldset>
        </div>

        <!-- Imagens -->
        <div class="mt-6 flex w-full flex-row justify-center gap-4">
          <div class="border-base-100 h-20 w-20 rounded-xl border bg-gray-200"></div>
          <div class="border-base-100 h-20 w-20 rounded-xl border bg-gray-200"></div>
          <div class="border-base-100 h-20 w-20 rounded-xl border bg-gray-200"></div>
          <div
            class="border-base-100 flex h-20 w-20 items-center justify-center rounded-xl border bg-gray-200 text-3xl"
          >
            +
          </div>
        </div>

        <!-- Botões -->
        <div class="mt-6 flex w-full justify-center gap-4">
          <button class="rounded-xl bg-green-600 px-6 py-2 text-white" @click="confirmarLote">
            Confirmar alterações
          </button>
        </div>
      </div>

      <!-- Card direito (lotes) -->
      <div class="bg-base-200 h-fit rounded-2xl p-5 shadow">
        <fieldset class="fieldset w-full">
          <label>Lote</label>
          <input v-model="novoLoteCodigo" class="input w-full focus:outline-offset-0" />
        </fieldset>
        <fieldset class="fieldset w-full">
          <label>Validade</label>
          <input
            v-model="novoLoteValidade"
            type="date"
            class="input w-full focus:outline-offset-0"
          />
        </fieldset>
        <fieldset class="fieldset w-full">
          <label>Quantidade</label>
          <input
            v-model="novoLoteQuantidade"
            type="number"
            class="input w-full focus:outline-offset-0"
          />
        </fieldset>
        <button
          class="mt-3 w-full rounded-xl bg-green-600 px-4 py-2 text-white"
          @click="adicionarLote"
        >
          Adicionar lote
        </button>

        <!-- Lista de lotes -->
        <div class="mt-6 space-y-4">
          <CardLote
            v-for="l in lotes"
            :key="l.id"
            :id="l.id"
            :codigo="l.codigo"
            :produto-id="l.produtoId"
            :validade="l.validade"
            :quantidade="l.quantidade"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import apiLotes from '@/api/lotes'
import apiProdutos from '@/api/produtos'
import CardLote from '@/components/Produtos/CardLote.vue'
import { notificacoes } from '@/main'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { StatusProduto, type GetLoteDTO } from '../../../backend'

const lotes: Ref<GetLoteDTO[]> = ref([])
const route = useRoute()
const router = useRouter()

const produtoId: Ref<string> = ref()
const produtoNome: Ref<string> = ref()
const produtoCodigo: Ref<string> = ref()
const produtoSku: Ref<string | null> = ref(null)
const produtoCodigoBarra: Ref<string | null> = ref(null)
const produtoDescricao: Ref<string | null> = ref(null)
const produtoCategoriaId: Ref<string | null> = ref(null)
const produtoMarca: Ref<string | null> = ref(null)
const produtoFornecedor: Ref<string | null> = ref(null)
const produtoDimensoes: Ref<string | null> = ref(null)
const produtoPeso: Ref<number | null> = ref(null)
const produtoPrecoCusto: Ref<string | null> = ref(null)
const produtoPrecoVenda: Ref<string | null> = ref(null)
const produtoPrecoPromocao: Ref<string | null> = ref(null)
const produtoUnidadeMedidaId: Ref<string | null> = ref(null)
const produtoQuantidadeMinima: Ref<number | null> = ref(null)
const produtoQuantidadeMaxima: Ref<number | null> = ref(null)
const produtoLocalizacao: Ref<string | null> = ref(null)
const produtoStatus: Ref<StatusProduto> = ref(StatusProduto.Ativo)
const produtoImagem: Ref<string | null> = ref(null)

const novoLoteCodigo: Ref<string> = ref('')
const novoLoteValidade: Ref<string | null> = ref(null)
const novoLoteQuantidade: Ref<number | null> = ref(0)

async function obterLotes() {
  const res = await apiLotes.consultar({ produtoId: produtoId.value })
  if (res.ok && res.responseBody) {
    lotes.value = res.responseBody
  }
}

async function obterProduto() {
  const res = await apiProdutos.obterPorId(produtoId.value)
  if (res.ok && res.responseBody) {
    const produto = res.responseBody
    produtoStatus.value = produto.status
    produtoNome.value = produto.nome
    produtoCodigo.value = produto.codigo
    produtoSku.value = produto.sku
    produtoCodigoBarra.value = produto.codigoBarra
    produtoDescricao.value = produto.descricao
    produtoCategoriaId.value = produto.categoriaId
    produtoMarca.value = produto.marca
    produtoFornecedor.value = produto.fornecedor
    produtoDimensoes.value = produto.dimensoes
    produtoPeso.value = produto.peso
    produtoPrecoCusto.value = formatarInt(produto.precoCusto)
    produtoPrecoVenda.value = formatarInt(produto.precoVenda)
    produtoPrecoPromocao.value = formatarInt(produto.precoPromocao)
    produtoQuantidadeMinima.value = produto.quantidadeMinima
    produtoQuantidadeMaxima.value = produto.quantidadeMaxima
    produtoLocalizacao.value = produto.localizacao
    // produtoImagem.value = produto.imagem
  }
}

async function adicionarLote() {
  const res = await apiLotes.criar({
    produtoId: produtoId.value,
    codigo: novoLoteCodigo.value,
    quantidade: novoLoteQuantidade.value ?? 0,
    validade: novoLoteValidade.value ? new Date(novoLoteValidade.value).toISOString() : null,
  })
  if (res.ok && res.responseBody) {
    notificacoes.addNotification('Lote adicionado com sucesso!', { time: 3000 })
    obterLotes()
  } else {
    notificacoes.addNotification('Erro ao adicionar lote.')
  }
}

onMounted(() => {
  const _produtoId = route.params.id as string
  if (!_produtoId) {
    // Produto não encontrado
    router.push({ name: 'produtos' })
    // notificacoes.addNotification("Produto não encontrado.")
  } else {
    produtoId.value = _produtoId
    obterProduto()
    obterLotes()
  }
})

//

//

const lote = ref<{ id: string; codigo: string } | null>(null)
const lotecodigo = ref('')
const validade = ref<string | null>(null)
const quant = ref<number | null>(null)
const nameProd = ref('')
const sku = ref('')
const codBarras = ref('')
const desc = ref('')
const categoria = ref('')
const marca = ref('')
const forn = ref('')
const dimensoes = ref('')
const peso = ref<number | null>(null)
const medidas = ref('')
const preco = ref<number | null>(null)
const venda = ref<number | null>(null)
const precoPromo = ref<number | null>(null)
const estoqueMin = ref<number | null>(null)
const estoqueMax = ref<number | null>(null)
const localEst = ref('')
const imagem = ref<string | null>(null) // base64

// Você mencionou produto.value.id, então deixo preparado:
const produto = ref<{ id: string } | null>(null)

// format int to floating point with 3 decimals
function formatarInt(valor: number | null): string | null {
  if (valor !== null) {
    return parseFloat((valor / 100).toFixed(3))
      .toString()
      .replace('.', ',')
  } else {
    return null
  }
}

async function confirmarLote() {
  try {
    let _loteId: string
    let validadeIso: string | null = null

    // Caso tenha validade → cria novo lote
    if (validade.value) {
      validadeIso = new Date(validade.value).toISOString()

      const res = await apiLotes.criar({
        produtoId: produto.value!.id,
        codigo: lotecodigo.value,
        quantidade: quant.value ?? 0,
        validade: validadeIso,
      })

      if (!res.ok || !res.responseBody) {
        notificacoes.addNotification('Erro ao criar o lote')
      } else {
        notificacoes.addNotification('Lote criado com sucesso!', { time: 3000 })
      }
    }

    // Caso NÃO tenha validade → usa um lote já existente
    else {
      if (!lote.value) {
        notificacoes.addNotification('Nenhum lote selecionado')
      } else {
        _loteId = lote.value.id
      }
    }

    notificacoes.addNotification('ID do lote utilizado:')
  } catch (e: any) {
    notificacoes.addNotification(e.message || 'Erro ao confirmar')
  }
}
</script>
