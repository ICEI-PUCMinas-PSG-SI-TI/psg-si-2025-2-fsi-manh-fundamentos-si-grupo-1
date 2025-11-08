<script setup lang="ts">
import {
  ArchiveBoxIcon,
  ArrowsUpDownIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  PresentationChartBarIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import NavigationMenuItem from './NavigationMenuItem.vue'
import LogoMenuItem from './LogoMenuItem.vue'
import NavigationMenuItemSeparator from './NavigationMenuItemSeparator.vue'
import DarkModeToggle from './DarkModeToggle.vue'
import { useSessaoStore } from '@/store/config/sessao'
import { computed } from 'vue'
import { Permissoes } from '../../../backend/src/db/schema/permissoes'

const useSessao = useSessaoStore()
const ehAdm = computed(() => useSessao.possuiPermissao(Permissoes.Administrador))
</script>

<template>
  <div class="h-screen bg-base-200 top-0 overflow-y-auto sticky w-full max-w-72">
    <ul class="flex flex-col menu menu-lg w-full min-h-screen">
      <LogoMenuItem class="mb-2" />

      <NavigationMenuItemSeparator />

      <RouterLink to="/dashboard" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <PresentationChartBarIcon class="m-2" />
          Dashboard
        </NavigationMenuItem>
      </RouterLink>

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

      <!-- TODO: Funcionalidade não será implementada no momento (sprint 3)
      <NavigationMenuItemSeparator />

      <RouterLink to="/relatorio_1" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <ChartBarIcon class="m-2" />
          Relatório 1
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink to="/relatorio_2" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <ChartBarIcon class="m-2" />
          Relatório 2
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink to="/relatorio_3" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <ChartBarIcon class="m-2" />
          Relatório 3
        </NavigationMenuItem>
      </RouterLink>
      -->

      <NavigationMenuItemSeparator />

      <RouterLink v-if="ehAdm" to="/usuarios" v-slot="{ href, navigate, isActive }" custom>
        <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
          <UsersIcon class="m-2" />
          Usuários
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
