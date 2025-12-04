<template>
  <div class="w-full min-h-full p-6 overflow-x-hidden">
    <h1 class="text-5xl font-bold mb-4">Cadastro de usuários</h1>

    <!-- Formulário -->
    <div class="bg-base-200 p-6 rounded-2xl mb-8">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!--Primeira coluna-->
        <div class="flex flex-col gap-4 h-full justify-end-safe">
          <h1 class="text-2xl mb-2">{{ editando ? 'Editando usuário' : 'Novo usuário' }}</h1>
          <p v-if="editando">{{ usuarioId }}</p>
          <div class="flex flex-col items-center">
            <img
              :src="usuarioFoto || '/src/assets/profile.png'"
              alt="avatar"
              class="w-24 h-24 rounded-full object-cover"
            />
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Escolha uma imagem</legend>
              <input
                type="file"
                class="file-input w-full"
                accept="image/*"
                @change="validarFotoPerfil"
              />
              <label class="label">Tamanho máximo de 2MB</label>
            </fieldset>
          </div>
          <LabeledInput
            html-place-holder="login"
            html-type="text"
            label-text="login"
            v-model="usuarioLogin"
          />
        </div>

        <!-- Coluna Inputs -->
        <div class="flex flex-col gap-4">
          <LabeledInput
            html-place-holder="Nome de usuário"
            html-type="text"
            label-text="Nome de usuário"
            v-model="usuarioNome"
          />
          <div class="mt-auto">
            <label class="block text-sm opacity-80">Informações adicionais</label>
            <textarea
              class="textarea textarea-bordered w-full"
              placeholder="Ex: Gestor de estoque"
              v-model="usuarioDescricao"
            />
          </div>
          <LabeledInput
            html-place-holder="Insira uma nova senha"
            html-type="password"
            label-text="Senha"
            v-model="usuarioSenha"
          />
        </div>

        <!-- Coluna Permissões -->
        <div class="flex flex-col h-full justify-center">
          <h2 class="text-xl font-semibold mb-4 flex flex-col items-center">Permissões</h2>
          <div class="flex flex-col gap-1">
            <label class="flex flex-row justify-start items-center">
              <input
                type="radio"
                v-model="permissoes"
                name="radio-1"
                class="radio me-2"
                checked="true"
                :value="Permissoes.Administrador"
              />
              Administrador
            </label>
            <p class="text-sm mb-2">Acesso total ao sistema.</p>

            <label class="flex flex-row justify-start items-center">
              <input
                type="radio"
                v-model="permissoes"
                name="radio-1"
                class="radio me-2"
                :value="Permissoes.Operacional"
              />
              Operacional
            </label>
            <p class="text-sm mb-2">
              Permite realizar movimentações, visualizar e cadastrar produtos.
            </p>

            <label class="flex flex-row justify-start items-center">
              <input
                type="radio"
                v-model="permissoes"
                name="radio-1"
                class="radio me-2"
                :value="Permissoes.Consulta"
              />
              Consulta
            </label>
            <p class="text-sm">Permite apenas visualizar informações de produtos.</p>
          </div>
        </div>
        <!--Coluna 4-->
        <div class="m-auto">
          <div class="flex flex-col items-end gap-4">
            <button
              class="text-white btn bg-green-600 w-32 rounded-4xl hover:scale-105 transition-transform duration-100"
              @click="confirmar"
            >
              Confirmar
            </button>
            <button
              class="text-white btn bg-red-500 w-32 rounded-4xl hover:scale-105 transition-transform duration-100"
              @click="limparCampos"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de usuários -->
    <div class="flex flex-col gap-4 w-full">
      <InfoUsuario
        :nome="usuario.nome"
        :login="usuario.login"
        :foto="usuario.foto"
        v-for="usuario in refUsuarios"
        :key="usuario.id"
        :habilitado="usuario.habilitado"
        v-on:desabilitar="(s: boolean) => desabilitar(usuario, s)"
        v-on:editar="editar(usuario)"
        v-on:excluir="excluir"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'

import { ApiPermissoes } from '@/api/permissoes'
import { ApiUsuario } from '@/api/usuarios'
import InfoUsuario from '@/components/CadastroUsuario/InfoUsuario.vue'
import LabeledInput from '@/components/LabeledInput.vue'
import { notificacoes } from '@/main'
import { imageFileToBase64 } from '@/services/helpers'
import { CrecenciaisZ } from '@/services/objects'
import { Permissoes, type GetUsuarioDto } from '../../../backend'

// TODO: Não exportar senhas para o frontend
const refUsuarios: Ref<GetUsuarioDto[] | null> = ref(null)
const editando: Ref<boolean> = ref(false)
const permissoes: Ref<Permissoes> = ref(Permissoes.Consulta)

const usuarioId: Ref<string | null> = ref(null)
const usuarioLogin: Ref<string> = ref('')
const usuarioNome: Ref<string> = ref('')
const usuarioDescricao: Ref<string | null> = ref(null)
const usuarioSenha: Ref<string> = ref('')
const usuarioFoto: Ref<string | null> = ref(null)

const apiUsuario = new ApiUsuario()
const apiPermissoes = new ApiPermissoes()

async function validarFotoPerfil(event: Event) {
  const target = event.target
  if (target instanceof HTMLInputElement && target.files && target.files.length) {
    imageFileToBase64(target.files[0])
      .then((base64) => {
        usuarioFoto.value = base64
      })
      .catch((message) => notificacoes.addNotification(message, { isError: true }))
  }
}

function excluir() {
  // TODO: Devido a dependencias.
  notificacoes.addNotification('No momento não é permitido excluir usuários.')
}

async function desabilitar(usuario: GetUsuarioDto, status: boolean) {
  const res = await apiUsuario.atualizar(usuario.id, { habilitado: status })
  if (res.ok) {
    if (status) {
      notificacoes.addNotification('Usuário habilitado.')
    } else {
      notificacoes.addNotification('Usuário desabilitado.')
    }
  }
}

async function editar(usuario: GetUsuarioDto) {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  editando.value = true
  usuarioId.value = usuario.id
  usuarioNome.value = usuario.nome
  usuarioLogin.value = usuario.login
  usuarioDescricao.value = usuario.descricao
  usuarioFoto.value = usuario.foto
  // TODO: Carregar permissões do usuário
  const res = await apiPermissoes.visualizar(usuario.id)
  if (res.ok && res.responseBody) {
    if (res.responseBody.includes(Permissoes.Administrador))
      permissoes.value = Permissoes.Administrador
    else if (res.responseBody.includes(Permissoes.Operacional))
      permissoes.value = Permissoes.Operacional
    else if (res.responseBody.includes(Permissoes.Consulta)) permissoes.value = Permissoes.Consulta
  }
}

async function confirmar() {
  if (!editando.value) {
    const credenciais = CrecenciaisZ.safeParse({
      usuario: usuarioLogin.value,
      senha: usuarioSenha.value,
    })
    if (!credenciais.data) {
      const error = credenciais.error.issues[0].message
      notificacoes.addNotification(error, { isError: true })
      return
    }
    const res = await apiUsuario.criar({
      login: usuarioLogin.value,
      nome: usuarioNome.value,
      descricao: usuarioDescricao.value,
      senha: credenciais.data.senha,
      password: credenciais.data.senha,
      foto: usuarioFoto.value || null,
    })
    if (!res.ok || !res.responseBody) return
    const res2 = await apiPermissoes.definir(res.responseBody, [permissoes.value])
    if (res2.ok) {
      notificacoes.addNotification('Usuário e permissões configurados com sucesso.')
      limparCampos()
      obterUsuarios()
    }
  } else {
    const credenciais = CrecenciaisZ.safeParse({
      usuario: usuarioLogin.value,
      senha: usuarioSenha.value,
    })
    if (!credenciais.data) {
      const error = credenciais.error.issues[0].message
      notificacoes.addNotification(error, { isError: true })
      return
    }
    // TODO: Atualizar senha
    const res = await apiUsuario.atualizar(usuarioId.value!, {
      login: usuarioLogin.value,
      nome: usuarioNome.value,
      descricao: usuarioDescricao.value,
      foto: usuarioFoto.value || null,
    })
    if (!res.ok) return
    // TODO: Atualizar senha opcional?
    const res2 = await apiUsuario.alterarSenha(usuarioId.value!, usuarioSenha.value)
    if (!res2.ok) return
    // TODO: Atualizar senha opcional?
    const res3 = await apiPermissoes.definir(usuarioId.value!, [permissoes.value])
    if (!res3.ok) return
    notificacoes.addNotification('Usuário e permissões atualizados com sucesso.')
    limparCampos()
    obterUsuarios()
  }
}

function limparCampos() {
  usuarioId.value = null
  usuarioLogin.value = ''
  usuarioNome.value = ''
  usuarioDescricao.value = null
  usuarioSenha.value = ''
  editando.value = false
  permissoes.value = Permissoes.Consulta
}

async function obterUsuarios() {
  const res = await apiUsuario.obter()
  if (res.ok && res.responseBody) {
    refUsuarios.value = res.responseBody
  }
}

obterUsuarios()
</script>
