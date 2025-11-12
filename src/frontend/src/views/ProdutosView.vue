<template>
  <div class="flex flex-col h-screen w-screen p-6 overflow-y-auto bg-base-200 text-base-content">
    
    <h1 class="text-4xl font-bold mb-6">Gerenciar Produtos</h1>

    <div class="flex gap-6 bg-base-300 p-6 rounded-2xl shadow-lg">
    
      <div class="flex-1 grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Nome do Produto</span></label>
          <input v-model="produto.nome" type="text" class="input input-bordered w-full" placeholder="Digite o nome" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Categoria</span></label>
          <input v-model="produto.categoria" type="text" class="input input-bordered w-full" placeholder="Digite a categoria" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">SKU</span></label>
          <input v-model="produto.sku" type="text" class="input input-bordered w-full" placeholder="Ex: PROD1234" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Quantidade em Estoque</span></label>
          <input v-model.number="produto.quantidade_estoque" type="number" min="0" class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Preço de Custo (R$)</span></label>
          <input v-model.number="produto.preco_custo" type="number" step="0.01" class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">Preço de Venda (R$)</span></label>
          <input v-model.number="produto.preco_venda" type="number" step="0.01" class="input input-bordered w-full" />
        </div>

        <div class="form-control col-span-2">
          <label class="label"><span class="label-text">Descrição</span></label>
          <textarea v-model="produto.descricao" class="textarea textarea-bordered w-full h-24 resize-none"></textarea>
        </div>

        <div class="col-span-2 flex justify-end mt-2">
          <button @click="salvarProduto" class="btn btn-primary px-6">
            {{ editando ? "Salvar Alterações" : "Salvar Produto" }}
          </button>
          <button v-if="editando" @click="cancelarEdicao" class="btn btn-outline ml-3">Cancelar</button>
        </div>
      </div>

      <div class="flex flex-col justify-start items-center w-72 bg-base-100 rounded-2xl p-4">
        <label class="label font-semibold mb-2">Imagem do Produto</label>
        <input type="file" accept="image/*" @change="handleImagem" class="file-input file-input-bordered w-full" />
        <div v-if="produto.imagem" class="mt-4">
          <img :src="produto.imagem" alt="Prévia" class="w-56 h-56 object-cover rounded-xl shadow" />
        </div>
      </div>
    </div>

    <div class="mt-8 card bg-base-300 shadow-md rounded-2xl p-6">
      <h2 class="text-2xl font-semibold mb-4">Produtos Cadastrados</h2>

      <div v-if="produtos.length === 0" class="text-center opacity-70 py-8">
        Nenhum produto cadastrado ainda.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>SKU</th>
              <th>Preço Venda</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in produtos" :key="i">
              <td>
                <img v-if="p.imagem" :src="p.imagem" alt="Imagem" class="w-16 h-16 rounded-lg object-cover" />
                <div v-else class="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center opacity-50">–</div>
              </td>
              <td>{{ p.nome }}</td>
              <td>{{ p.categoria }}</td>
              <td>{{ p.sku }}</td>
              <td>R$ {{ p.preco_venda.toFixed(2) }}</td>
              <td>{{ p.quantidade_estoque }}</td>
              <td class="flex gap-2">
                <button @click="editarProduto(i)" class="btn btn-sm btn-info text-white">Editar</button>
                <button @click="removerProduto(i)" class="btn btn-sm btn-error text-white">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Produto {
  nome: string;
  categoria: string;
  sku: string;
  preco_custo: number;
  preco_venda: number;
  quantidade_estoque: number;
  descricao: string;
  imagem?: string;
}

const produtos = ref<Produto[]>([]);
const produto = ref<Produto>({
  nome: "",
  categoria: "",
  sku: "",
  preco_custo: 0,
  preco_venda: 0,
  quantidade_estoque: 0,
  descricao: "",
  imagem: "",
});

const editando = ref(false);
let indexEditando = -1;

// carregar do localStorage
onMounted(() => {
  const data = localStorage.getItem("produtos");
  if (data) produtos.value = JSON.parse(data);
});

function salvarProduto() {
  if (!produto.value.nome.trim()) {
    alert("O nome do produto é obrigatório!");
    return;
  }

  if (editando.value) {
    produtos.value[indexEditando] = { ...produto.value };
    editando.value = false;
  } else {
    produtos.value.push({ ...produto.value });
  }

  localStorage.setItem("produtos", JSON.stringify(produtos.value));
  limparFormulario();
}

function editarProduto(index: number) {
  produto.value = { ...produtos.value[index] };
  editando.value = true;
  indexEditando = index;
}

function cancelarEdicao() {
  limparFormulario();
  editando.value = false;
}

function removerProduto(index: number) {
  if (confirm("Deseja excluir este produto?")) {
    produtos.value.splice(index, 1);
    localStorage.setItem("produtos", JSON.stringify(produtos.value));
  }
}

function limparFormulario() {
  produto.value = {
    nome: "",
    categoria: "",
    sku: "",
    preco_custo: 0,
    preco_venda: 0,
    quantidade_estoque: 0,
    descricao: "",
    imagem: "",
  };
}

function handleImagem(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    produto.value.imagem = reader.result as string;
  };
  reader.readAsDataURL(file);
}
</script>
