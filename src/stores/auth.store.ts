import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginRequest } from '@/services/auth.service'
import { clearSession, getToken, getUsername, setSession } from '@/services/token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const username = ref<string | null>(getUsername())

  const isAuthenticated = computed(() => !!token.value)

  async function login(usernameInput: string, password: string): Promise<void> {
    const { accessToken } = await loginRequest({ username: usernameInput, password })
    token.value = accessToken
    username.value = usernameInput
    setSession(accessToken, usernameInput)
  }

  function logout(): void {
    token.value = null
    username.value = null
    clearSession()
  }

  return { token, username, isAuthenticated, login, logout }
})
