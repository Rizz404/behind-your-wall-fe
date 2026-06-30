import type { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export const authGuard: NavigationGuardWithThis<undefined> = (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
    return redirect
  }

  return true
}
