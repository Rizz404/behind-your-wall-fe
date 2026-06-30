<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { createSite } from '@/services/sites.service'
import { extractErrorMessage } from '@/services/api'
import type { Site } from '@/types/api'

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ created: [site: Site] }>()

const toast = useToast()

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Nama wajib diisi').max(255),
    domain: z
      .string()
      .min(1, 'Domain wajib diisi')
      .max(255)
      .regex(/^[a-z0-9.-]+$/i, 'Domain harus berupa hostname murni (tanpa protokol/path)'),
  }),
)

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
})

const [name, nameAttrs] = defineField('name')
const [domain, domainAttrs] = defineField('domain')

const submitting = ref(false)
const formError = ref<string | null>(null)
const createdSite = ref<Site | null>(null)

watch(visible, (isVisible) => {
  if (isVisible) {
    createdSite.value = null
    formError.value = null
    resetForm()
  }
})

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  formError.value = null
  try {
    const site = await createSite(values)
    createdSite.value = site
    emit('created', site)
  } catch (error) {
    formError.value = extractErrorMessage(error)
  } finally {
    submitting.value = false
  }
})

async function copyApiKey(): Promise<void> {
  if (!createdSite.value) return
  await navigator.clipboard.writeText(createdSite.value.apiKey)
  toast.add({ severity: 'success', summary: 'API key disalin', life: 2000 })
}

function close(): void {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Site Baru" class="w-full max-w-md">
    <div v-if="!createdSite" class="flex flex-col gap-4">
      <Message v-if="formError" severity="error" :closable="false">{{ formError }}</Message>

      <div class="flex flex-col gap-1">
        <label for="site-name" class="text-sm font-medium text-surface-700">Nama</label>
        <InputText id="site-name" v-model="name" v-bind="nameAttrs" :invalid="!!errors.name" fluid />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="site-domain" class="text-sm font-medium text-surface-700">Domain</label>
        <InputText
          id="site-domain"
          v-model="domain"
          v-bind="domainAttrs"
          :invalid="!!errors.domain"
          placeholder="example.com"
          fluid
        />
        <small v-if="errors.domain" class="text-red-500">{{ errors.domain }}</small>
      </div>

      <div class="flex justify-end gap-2">
        <Button label="Batal" severity="secondary" outlined @click="close" />
        <Button label="Buat" :loading="submitting" @click="onSubmit" />
      </div>
    </div>

    <div v-else class="flex flex-col gap-4">
      <Message severity="success" :closable="false">
        Site "{{ createdSite.name }}" berhasil dibuat. Simpan API key ini — dipakai untuk pasang
        SDK di website.
      </Message>
      <div class="flex items-center gap-2 rounded-md border border-surface-200 bg-surface-50 p-3">
        <code class="flex-1 overflow-x-auto text-sm">{{ createdSite.apiKey }}</code>
        <Button icon="pi pi-copy" text size="small" @click="copyApiKey" />
      </div>
      <div class="flex justify-end">
        <Button label="Selesai" @click="close" />
      </div>
    </div>
  </Dialog>
</template>
