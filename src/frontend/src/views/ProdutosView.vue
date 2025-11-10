<template>
  <div class="flex flex-col h-screen w-screen p-4 overflow-y-auto transition-colors duration-300">
    <!-- Título -->
    <h1 class="text-4xl font-bold mb-6 text-base-content">Informações do Produto</h1>

    <div class="flex gap-6 w-full">
      <!-- Lado esquerdo -->
      <div class="flex flex-col flex-1 gap-4">
        <!-- Bloco principal -->
        <div class="card bg-base-200 shadow-md rounded-2xl p-6 flex flex-col gap-4">
          <h2 class="text-2xl font-semibold mb-2">Dados Gerais</h2>

          <div class="grid grid-cols-2 gap-4">
            <!-- Nome -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nome do Produto</span>
              </label>
              <input type="text" class="input input-bordered w-full" placeholder="Digite o nome" />
            </div>

            <!-- Categoria -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Categoria</span>
              </label>
              <input type="text" class="input input-bordered w-full" placeholder="Digite a categoria" />
            </div>

            <!-- SKU -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">SKU</span>
              </label>
              <input type="text" class="input input-bordered w-full" placeholder="Ex: PROD1234" />
            </div>

            <!-- Quantidade -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Quantidade em Estoque</span>
              </label>
              <input type="number" class="input input-bordered w-full" placeholder="0" min="0" />
            </div>

            <!-- Preço de Custo -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Preço de Custo (R$)</span>
              </label>
              <input type="number" step="0.01" class="input input-bordered w-full" placeholder="0.00" />
            </div>

            <!-- Preço de Venda -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Preço de Venda (R$)</span>
              </label>
              <input type="number" step="0.01" class="input input-bordered w-full" placeholder="0.00" />
            </div>

            <!-- Descrição -->
            <div class="form-control col-span-2">
              <label class="label">
                <span class="label-text">Descrição</span>
              </label>
              <textarea
                class="textarea textarea-bordered w-full h-32 resize-none"
                placeholder="Digite a descrição do produto"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Área de Lote -->
        <div class="card bg-base-200 shadow-md rounded-2xl p-6 flex flex-col gap-4">
          <h2 class="text-2xl font-semibold mb-2">Lote</h2>
          <p class="text-sm opacity-70">
            Esta área será utilizada futuramente para o cadastro e controle de lotes do produto.
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Código do Lote</span>
              </label>
              <input type="text" class="input input-bordered w-full" disabled placeholder="—" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Validade</span>
              </label>
              <input type="date" class="input input-bordered w-full" disabled />
            </div>
          </div>
        </div>
      </div>

      <!-- Lado direito (Imagens) -->
      <div class="card bg-base-200 shadow-md rounded-2xl p-6 flex flex-col w-1/3 h-fit gap-4">
        <h2 class="text-2xl font-semibold mb-2">Imagens do Produto</h2>
        <div
          class="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-6 hover:border-base-content transition-colors duration-300 cursor-pointer"
        >
          <span class="text-base-content opacity-70">Clique para enviar imagens</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="aspect-square bg-base-300 rounded-lg"></div>
          <div class="aspect-square bg-base-300 rounded-lg"></div>
          <div class="aspect-square bg-base-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

