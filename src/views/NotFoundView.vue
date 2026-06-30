<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-surface-50">
    <span class="text-6xl font-bold text-surface-300">404</span>
    <p class="text-surface-600">Halaman tidak ditemukan.</p>
    <RouterLink :to="authStore.isAuthenticated ? '/' : '/login'">
      <Button :label="authStore.isAuthenticated ? 'Ke Dashboard' : 'Ke Login'" icon="pi pi-arrow-left" />
    </RouterLink>
  </div>
</template>
