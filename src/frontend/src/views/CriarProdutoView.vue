<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Informações do Produto</h1>

    <!-- Layout principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Card esquerdo -->
      <div class="lg:col-span-2 bg-white p-5 rounded-2xl shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Nome do Produto</label>
            <input v-model="nameProd" type="text" class="input" />
          </div>
          <div>
            <label>SKU</label>
            <input v-model="sku" type="text" class="input" />
          </div>
          <div>
            <label>Código de barras (EAN/UPC)</label>
            <input v-model="codBarras" type="text" class="input" />
          </div>
          <div class="md:col-span-2">
            <label>Descrição</label>
            <textarea v-model="desc" class="input h-28"></textarea>
          </div>

          <div>
            <label>Categoria</label>
            <input v-model="categoria" class="input" />
          </div>
          <div>
            <label>Marca</label>
            <input v-model="marca" class="input" />
          </div>
          <div>
            <label>Fornecedor</label>
            <input v-model="forn" class="input" />
          </div>
          <div>
            <label>Dimensões</label>
            <input v-model="dimensoes" class="input" />
          </div>
          <div>
            <label>Peso</label>
            <input v-model="peso" class="input" />
          </div>
          <div>
            <label>Unidade de Medida</label>
            <input v-model="medidas" class="input" />
          </div>
          <div>
            <label>Preço Custo</label>
            <input v-model="preco" class="input" />
          </div>
          <div>
            <label>Preço Venda</label>
            <input v-model="venda" class="input" />
          </div>
          <div>
            <label>Preço Promocional</label>
            <input v-model="precoPromo" class="input" />
          </div>
          <div>
            <label>Estoque mínimo</label>
            <input v-model="estoqueMin" class="input" />
          </div>
          <div>
            <label>Estoque máximo</label>
            <input v-model="estoqueMax" class="input" />
          </div>
          <div>
            <label>Localidade do Estoque</label>
            <input v-model="localEst" class="input" />
          </div>
        </div>

        <!-- Imagens -->
        <div class="mt-6 flex gap-4">
          <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
          <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
          <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
          <div class="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-3xl">+</div>
        </div>

        <!-- Botões -->
        <div class="mt-6 flex gap-4">
          <button class="px-6 py-2 rounded-xl bg-green-600 text-white">Confirmar</button>
          <button class="px-6 py-2 rounded-xl bg-blue-600 text-white">Alterar</button>
          <button class="px-6 py-2 rounded-xl bg-red-600 text-white">Bloquear movimentações</button>
        </div>
      </div>

      <!-- Card direito (lotes) -->
      <div class="bg-white p-5 rounded-2xl shadow h-fit">
        <div>
          <label>Lote</label>
          <input v-model="lotecodigo" class="input" />
        </div>
        <div>
          <label>Validade</label>
          <input v-model="validade" type="date" class="input" />
        </div>
        <div>
          <label>Quantidade</label>
          <input v-model="quant" type="number" class="input" />
        </div>
        <button class="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl w-full">Adicionar lote</button>

        <!-- Lista de lotes -->
        <div class="mt-6 space-y-4">
          <div class="p-4 bg-gray-100 rounded-xl">
            <p><strong>Lote: 123</strong></p>
            <p>Quantidade: 100 unidades</p>
            <p>Validade: 01/09/2025</p>
          </div>
          <div class="p-4 bg-gray-100 rounded-xl">
            <p><strong>Lote: 123</strong></p>
            <p>Quantidade: 100 unidades</p>
            <p>Validade: 01/09/2025</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

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

async function confirmar() {
  try {
    let loteId: string
    let validadeIso: string | null = null

    // Caso tenha validade → cria novo lote
    if (validade.value) {
      validadeIso = new Date(validade.value).toISOString()

      const resLote = await fetch('/api/v1/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoId: produto.value?.id,
          codigo: lotecodigo.value,
          quantidade: quant.value ?? 0,
          validade: validadeIso
        })
      })

      if (!resLote.ok) {
        throw new Error('Erro ao criar o lote')
      }

      const dataLote = await resLote.json()
      console.log("Lote criado:", dataLote)

      loteId = dataLote.id
      alert('Lote criado com sucesso!')
    }

    // Caso NÃO tenha validade → usa um lote já existente
    else {
      if (!lote.value) throw new Error('Nenhum lote selecionado')
      loteId = lote.value.id
    }

    console.log("ID do lote utilizado:", loteId)
    
  } catch (e: any) {
    alert(e.message || 'Erro ao confirmar')
  }
}
</script>
