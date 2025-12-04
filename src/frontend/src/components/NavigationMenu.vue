<script setup lang="ts">
import { useSessaoStore } from '@/store/config/sessao'
import {
  ArchiveBoxIcon,
  ArrowsUpDownIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { Permissoes } from '../../../backend'
import DarkModeToggle from './DarkModeToggle.vue'
import LogoMenuItem from './LogoMenuItem.vue'
import NavigationMenuItem from './NavigationMenuItem.vue'
import NavigationMenuItemSeparator from './NavigationMenuItemSeparator.vue'

const useSessao = useSessaoStore()
const ehAdm = computed(() => useSessao.possuiPermissao(Permissoes.Administrador))
const ehDev = computed(() => useSessao.possuiPermissao(Permissoes.Desenvolvedor))
</script>

<template>
  <div class="bg-base-200 sticky top-0 h-screen w-full max-w-72 overflow-y-auto">
    <ul class="menu menu-lg flex min-h-screen w-full flex-col">
      <LogoMenuItem class="mb-2" />

      <NavigationMenuItemSeparator />

      <RouterLink to="/operacoes" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <ArrowsUpDownIcon class="m-2" />
          Operações
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink to="/movimentacoes" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <ClipboardDocumentListIcon class="m-2" />
          Movimentações
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink to="/produtos" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <ArchiveBoxIcon class="m-2" />
          Produtos
        </NavigationMenuItem>
      </RouterLink>

      <NavigationMenuItemSeparator />

      <RouterLink v-if="ehAdm || ehDev" to="/usuarios" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <UsersIcon class="m-2" />
          Usuários
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink v-if="ehDev" to="/desenvolvedor" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <UsersIcon class="m-2" />
          Desenvolvedor
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink to="/configuracoes" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <Cog6ToothIcon class="m-2" />
          Configurações
        </NavigationMenuItem>
      </RouterLink>

      <DarkModeToggle class="mx-auto mt-auto p-2" />
    </ul>
  </div>
</template>
