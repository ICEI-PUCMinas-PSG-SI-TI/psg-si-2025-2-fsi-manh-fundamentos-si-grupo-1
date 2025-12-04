<template>
  <div class="flex h-screen w-screen flex-col items-center justify-center align-middle">
    <LogoLoginItem class="mb-6" />
    <span class="loading loading-bars mb-3 w-24"></span>
    <p v-if="status === Status.Conectando">Conectando ao servidor...</p>
    <p v-if="status === Status.Erro">Não foi possível conectar ao servidor...</p>
  </div>
</template>

<script setup lang="ts">
import { ApiConfiguracoes } from '@/api/configuracoes'
import LogoLoginItem from '@/components/login/LogoLoginItem.vue'
import { useSessaoStore } from '@/store/config/sessao'
import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

enum Status {
  Conectando,
  Erro,
}

const status: Ref<Status> = ref(Status.Conectando)
const apiConfiguracoes = new ApiConfiguracoes()
const router = useRouter()
const route = useRoute()
const sessao = useSessaoStore()

async function ping() {
  const res = await apiConfiguracoes.ping()
  if (!res.ok) {
    status.value = Status.Erro
    return
  }
  await sessao.checkLogin()

  if (sessao.isLoggedIn) {
    if (typeof route.query.nextPage === 'string' && router.hasRoute(route.query.nextPage)) {
      router.push(route.query.nextPage)
    } else {
      router.push({ name: 'start' })
    }
  } else {
    router.push({ name: 'login' })
  }
}

ping()
const pingInterval = setInterval(ping, 5000)

onBeforeUnmount(() => clearInterval(pingInterval))
</script>
