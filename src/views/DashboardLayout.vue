<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { navigation } from '@/config/navigation'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

function isActive(to: string, matchPrefix?: boolean): boolean {
  return matchPrefix ? route.path.startsWith(to) : route.path === to
}

function logout(): void {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-surface-50">
    <aside class="flex w-60 shrink-0 flex-col border-r border-surface-200 bg-white">
      <div class="px-5 py-5 text-lg font-semibold text-surface-900">Behind Your Wall</div>
      <nav class="flex flex-1 flex-col gap-1 px-3">
        <router-link
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="
            isActive(item.to, item.matchPrefix)
              ? 'bg-primary-50 text-primary-700'
              : 'text-surface-600 hover:bg-surface-100'
          "
        >
          <i :class="item.icon" />
          {{ item.label }}
        </router-link>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <header
        class="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-surface-200 bg-white px-6"
      >
        <span class="text-sm text-surface-600">{{ authStore.username }}</span>
        <Button label="Logout" icon="pi pi-sign-out" size="small" severity="secondary" outlined @click="logout" />
      </header>
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
