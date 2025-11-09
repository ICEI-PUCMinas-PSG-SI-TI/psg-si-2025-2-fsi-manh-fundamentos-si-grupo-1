<template>
  <div class="flex flex-col w-screen h-screen justify-center align-middle items-center">
    <LogoLoginItem class="mb-6" />
    <span class="loading loading-bars loading-xl mb-3"></span>
    <p v-if="status === Status.Conectando">Conectando ao servidor...</p>
    <p v-if="status === Status.Erro" class="text-error">Não foi possível conectar ao servidor...</p>
  </div>
</template>

<script setup lang="ts">
import { ApiConfiguracoes } from '@/api/configuracoes'
import LogoLoginItem from '@/components/login/LogoLoginItem.vue'
import { useSessaoStore } from '@/store/config/sessao'
import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

enum Status {
  Conectando,
  Erro,
}

const status: Ref<Status> = ref(Status.Conectando)
const apiConfiguracoes = new ApiConfiguracoes()
const router = useRouter()
const sessao = useSessaoStore()

async function ping() {
  const res = await apiConfiguracoes.ping()
  if (!res.ok) {
    status.value = Status.Erro
    return
  }
  await sessao.checkLogin()
  if (sessao.isLoggedIn) {
    router.push('/')
  } else {
    router.push('login')
  }
}

ping()
const pingInterval = setInterval(ping, 5000)

onBeforeUnmount(() => clearInterval(pingInterval))
</script>
