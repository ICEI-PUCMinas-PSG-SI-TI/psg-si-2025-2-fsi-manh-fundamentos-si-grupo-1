<template>
  <div class="p-6 w-full flex flex-col gap-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-semibold text-gray-700 tracking-wide flex items-center gap-2">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-500" /> ALERTAS
      </h1>
      <button
        class="px-4 py-2 rounded-full border border-pink-600 text-pink-600 hover:bg-pink-50 transition"
      >
        + NOVO ALERTA
      </button>
    </div>
    <!-- FILTRO POR MOTIVO -->
    <div class="flex items-center gap-4 mt-4">
      <label class="font-medium text-gray-700">Filtrar por motivo:</label>
      <select v-model="filtroMotivo" class="border rounded px-3 py-1">
        <option value="">Todos</option>
        <option value="Perto da validade">Perto da validade</option>
        <option value="Estoque acima do máximo ou abaixo do mínimo">
          Estoque acima do máximo ou abaixo do mínimo
        </option>
      </select>
    </div>
    <!-- TABLE WRAPPER -->
    <div class="bg-white shadow rounded-2xl overflow-hidden border border-gray-200 mt-4">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 text-sm uppercase">
          <tr>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Nome</th>
            <th class="px-6 py-3">Motivo</th>
            <th class="px-6 py-3">Descrição</th>
            <th class="px-6 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="a in alertasFiltrados"
            :key="a.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <!-- STATUS -->
            <td class="px-6 py-4">
              <span
                v-if="a.status === 'ok'"
                class="h-3 w-3 rounded-full bg-green-500 inline-block"
              ></span>
              <span
                v-else-if="a.status === 'atenção'"
                class="h-3 w-3 rounded-full bg-yellow-400 inline-block"
              ></span>
              <span v-else class="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
            </td>
            <!-- DADOS -->
            <td class="px-6 py-4">{{ a.nome }}</td>
            <td class="px-6 py-4">{{ a.motivo }}</td>
            <td class="px-6 py-4">{{ a.descricao }}</td>
            <!-- AÇÕES: BOTÕES BONITOS -->
            <td class="px-6 py-4 flex justify-center gap-2">
              <button
                class="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
              >
                <i class="fa-solid fa-bell-slash"></i> Mutar
              </button>
              <button
                class="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
              >
                <i class="fa-solid fa-pen-to-square"></i> Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
