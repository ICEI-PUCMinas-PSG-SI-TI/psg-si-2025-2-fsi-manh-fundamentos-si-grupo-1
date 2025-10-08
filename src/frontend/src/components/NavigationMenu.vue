<script setup lang="ts">
import {
  ArchiveBoxIcon,
  ArrowsUpDownIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PresentationChartBarIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import NavigationMenuItem from './NavigationMenuItem.vue'
import LogoMenuItem from './LogoMenuItem.vue'
import NavigationMenuItemSeparator from './NavigationMenuItemSeparator.vue'
import DarkModeToggle from './DarkModeToggle.vue'
// import TemaToggle from './TemaToggle.vue'
</script>

<template>
  <ul class="flex menu menu-lg bg-base-200 w-96 px-2 h-lvh align-top">
    <LogoMenuItem class="mb-2" />

    <NavigationMenuItemSeparator />

    <RouterLink to="/dashboard" v-slot="{ href, navigate, isActive }" custom>
      <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
        <PresentationChartBarIcon class="m-2" />
        Dashboard
      </NavigationMenuItem>
    </RouterLink>

    <RouterLink to="/movimentacoes" v-slot="{ href, navigate, isActive }" custom>
      <NavigationMenuItem :href="href" :navigate="navigate" :is-active="isActive">
        <ArrowsUpDownIcon class="m-2" />
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

    <NavigationMenuItemSeparator />

    <RouterLink to="/usuarios" v-slot="{ href, navigate, isActive }" custom>
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
</template>
