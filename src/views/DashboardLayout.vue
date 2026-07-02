<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { navigation } from '@/config/navigation'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

function isActive(to: string, matchPrefix?: boolean): boolean {
  return matchPrefix ? route.path.startsWith(to) : route.path === to
}

function closeSidebar(): void {
  sidebarOpen.value = false
}

function logout(): void {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-surface-50">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
      @click="closeSidebar"
    />

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col border-r border-surface-200 bg-white transition-transform duration-200 md:static md:z-auto md:w-60 md:translate-x-0"
      :class="{ 'translate-x-0': sidebarOpen }"
    >
      <div class="flex items-center justify-between px-5 py-5">
        <span class="text-lg font-semibold text-surface-900">Behind Your Wall</span>
        <Button
          icon="pi pi-times"
          text
          rounded
          size="small"
          class="md:hidden"
          @click="closeSidebar"
        />
      </div>
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
          @click="closeSidebar"
        >
          <i :class="item.icon" />
          {{ item.label }}
        </router-link>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <header
        class="flex h-14 shrink-0 items-center gap-3 border-b border-surface-200 bg-white px-4 sm:px-6"
      >
        <Button
          icon="pi pi-bars"
          text
          rounded
          class="md:hidden"
          @click="sidebarOpen = true"
        />
        <div class="flex-1" />
        <span class="truncate text-sm text-surface-600">{{ authStore.username }}</span>
        <Button label="Logout" icon="pi pi-sign-out" size="small" severity="secondary" outlined @click="logout" />
      </header>
      <main class="flex-1 overflow-auto p-4 sm:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
