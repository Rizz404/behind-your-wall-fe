<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import dayjs from 'dayjs'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { createBlockedIp } from '@/services/blocklist.service'
import { extractErrorMessage } from '@/services/api'
import type { BlockedIp } from '@/types/api'

const IP_REGEX =
  /^(((\d{1,3}\.){3}\d{1,3})|([0-9a-fA-F:]+:[0-9a-fA-F:]*))$/

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ created: [blockedIp: BlockedIp] }>()

const schema = toTypedSchema(
  z.object({
    ip: z.string().min(1, 'IP wajib diisi').regex(IP_REGEX, 'Format IP tidak valid'),
    reason: z.string().max(1000).optional(),
    expiresAt: z.date().optional(),
  }),
)

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
})

const [ip, ipAttrs] = defineField('ip')
const [reason, reasonAttrs] = defineField('reason')
const [expiresAt, expiresAtAttrs] = defineField('expiresAt')

const submitting = ref(false)
const formError = ref<string | null>(null)

watch(visible, (isVisible) => {
  if (isVisible) {
    formError.value = null
    resetForm()
  }
})

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  formError.value = null
  try {
    const blockedIp = await createBlockedIp({
      ip: values.ip,
      reason: values.reason || undefined,
      expiresAt: values.expiresAt ? dayjs(values.expiresAt).toISOString() : undefined,
    })
    emit('created', blockedIp)
    visible.value = false
  } catch (error) {
    formError.value = extractErrorMessage(error)
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Block IP" class="w-full max-w-md">
    <div class="flex flex-col gap-4">
      <Message v-if="formError" severity="error" :closable="false">{{ formError }}</Message>

      <div class="flex flex-col gap-1">
        <label for="block-ip" class="text-sm font-medium text-surface-700">IP Address</label>
        <InputText id="block-ip" v-model="ip" v-bind="ipAttrs" :invalid="!!errors.ip" fluid />
        <small v-if="errors.ip" class="text-red-500">{{ errors.ip }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="block-reason" class="text-sm font-medium text-surface-700">Reason (opsional)</label>
        <Textarea id="block-reason" v-model="reason" v-bind="reasonAttrs" rows="3" auto-resize fluid />
        <small v-if="errors.reason" class="text-red-500">{{ errors.reason }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-surface-700">Expires At (opsional)</label>
        <DatePicker
          v-model="expiresAt"
          v-bind="expiresAtAttrs"
          show-time
          hour-format="24"
          date-format="yy-mm-dd"
          show-icon
          fluid
        />
        <small class="text-surface-400">Kosongkan untuk block permanen.</small>
      </div>

      <div class="flex justify-end gap-2">
        <Button label="Batal" severity="secondary" outlined @click="visible = false" />
        <Button label="Block" severity="danger" :loading="submitting" @click="onSubmit" />
      </div>
    </div>
  </Dialog>
</template>
