<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import type { Site } from '@/types/api'

const props = defineProps<{ site: Site | null }>()
const visible = defineModel<boolean>('visible', { required: true })

const toast = useToast()

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

const blockRedirect = ref(false)
const geoEnabled = ref(false)
const geoTrigger = ref('')

watch(visible, (isVisible) => {
  if (isVisible) {
    blockRedirect.value = false
    geoEnabled.value = false
    geoTrigger.value = ''
  }
})

const snippet = computed(() => {
  if (!props.site) return ''
  const attrs = [
    `  src="${apiBase}/static/widget.js"`,
    `  data-site-key="${props.site.apiKey}"`,
    `  data-api-base="${apiBase}"`,
  ]
  if (blockRedirect.value) attrs.push(`  data-block-redirect="true"`)
  if (geoEnabled.value) attrs.push(`  data-geo="true"`)
  if (geoEnabled.value && geoTrigger.value.trim()) {
    attrs.push(`  data-geo-trigger="${geoTrigger.value.trim()}"`)
  }
  const closeTag = '</' + 'script>'
  return `<script\n${attrs.join('\n')}\n>${closeTag}`
})

async function copySnippet(): Promise<void> {
  await navigator.clipboard.writeText(snippet.value)
  toast.add({ severity: 'success', summary: 'Snippet disalin', life: 2000 })
}

function close(): void {
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Embed Snippet" class="w-full max-w-xl">
    <div v-if="site" class="flex flex-col gap-4">
      <p class="text-sm text-surface-600">
        Tempel tag <code>&lt;script&gt;</code> ini sebelum <code>&lt;/body&gt;</code> di website
        <strong>{{ site.domain }}</strong
        >.
      </p>

      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-surface-800">Redirect ke /blocked</p>
            <p class="text-xs text-surface-500">
              Visitor yang diblokir otomatis diarahkan ke halaman /blocked di website kamu.
            </p>
          </div>
          <ToggleSwitch v-model="blockRedirect" />
        </div>

        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-surface-800">Geolocation (HTML5)</p>
            <p class="text-xs text-surface-500">
              Aktifkan dialog izin lokasi untuk koordinat presisi (GPS-level).
            </p>
          </div>
          <ToggleSwitch v-model="geoEnabled" />
        </div>

        <div v-if="geoEnabled" class="flex flex-col gap-1">
          <label class="text-sm font-medium text-surface-700">Geo trigger selector (opsional)</label>
          <InputText v-model="geoTrigger" placeholder="#btn-cari-toko" fluid />
          <small class="text-surface-500">
            Isi CSS selector agar dialog izin lokasi baru muncul saat elemen tersebut diklik, bukan
            saat halaman load.
          </small>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-surface-700">Kode Embed</label>
          <Button icon="pi pi-copy" label="Copy" text size="small" @click="copySnippet" />
        </div>
        <pre
          class="max-h-72 overflow-auto rounded-md border border-surface-200 bg-surface-50 p-3 text-xs"
          >{{ snippet }}</pre
        >
      </div>

      <div class="flex justify-end">
        <Button label="Selesai" @click="close" />
      </div>
    </div>
  </Dialog>
</template>
