<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useAuthStore } from '@/stores/auth.store'
import { extractErrorMessage } from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const schema = toTypedSchema(
  z.object({
    username: z.string().min(1, 'Username wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const submitting = ref(false)
const loginError = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  loginError.value = null
  try {
    await authStore.login(values.username, values.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (error) {
    loginError.value = extractErrorMessage(error)
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center bg-surface-50">
    <form
      class="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-surface-200 bg-white p-8 shadow-sm"
      @submit="onSubmit"
    >
      <div class="mb-2 text-center">
        <h1 class="text-xl font-semibold text-surface-900">Behind Your Wall</h1>
        <p class="text-sm text-surface-500">Admin Dashboard</p>
      </div>

      <Message v-if="loginError" severity="error" :closable="false">{{ loginError }}</Message>

      <div class="flex flex-col gap-1">
        <label for="username" class="text-sm font-medium text-surface-700">Username</label>
        <InputText
          id="username"
          v-model="username"
          v-bind="usernameAttrs"
          :invalid="!!errors.username"
          autocomplete="username"
        />
        <small v-if="errors.username" class="text-red-500">{{ errors.username }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="password" class="text-sm font-medium text-surface-700">Password</label>
        <Password
          input-id="password"
          v-model="password"
          v-bind="passwordAttrs"
          :invalid="!!errors.password"
          :feedback="false"
          toggle-mask
          fluid
          autocomplete="current-password"
        />
        <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
      </div>

      <Button type="submit" label="Login" :loading="submitting" class="mt-2" />
    </form>
  </div>
</template>
