<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { deactivateSite, listSites } from '@/services/sites.service'
import { extractErrorMessage } from '@/services/api'
import type { Site } from '@/types/api'
import SiteFormDialog from '@/components/sites/SiteFormDialog.vue'

const toast = useToast()
const confirm = useConfirm()

const sites = ref<Site[]>([])
const loading = ref(false)
const dialogVisible = ref(false)

async function loadSites(): Promise<void> {
  loading.value = true
  try {
    sites.value = await listSites()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal memuat sites', detail: extractErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

async function copyApiKey(apiKey: string): Promise<void> {
  await navigator.clipboard.writeText(apiKey)
  toast.add({ severity: 'success', summary: 'API key disalin', life: 2000 })
}

function confirmDeactivate(site: Site): void {
  confirm.require({
    message: `Nonaktifkan site "${site.name}"?`,
    header: 'Konfirmasi',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { severity: 'danger', label: 'Nonaktifkan' },
    rejectProps: { severity: 'secondary', outlined: true, label: 'Batal' },
    accept: async () => {
      try {
        await deactivateSite(site.id)
        toast.add({ severity: 'success', summary: 'Site dinonaktifkan', life: 2000 })
        await loadSites()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Gagal menonaktifkan site', detail: extractErrorMessage(error) })
      }
    },
  })
}

onMounted(loadSites)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-surface-900">Sites</h1>
      <Button label="New Site" icon="pi pi-plus" @click="dialogVisible = true" />
    </div>

    <Skeleton v-if="loading" height="16rem" />
    <DataTable v-else :value="sites" data-key="id" striped-rows>
      <Column field="name" header="Nama" />
      <Column field="domain" header="Domain" />
      <Column header="API Key">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <code class="text-xs">{{ data.apiKey }}</code>
            <Button icon="pi pi-copy" text size="small" @click="copyApiKey(data.apiKey)" />
          </div>
        </template>
      </Column>
      <Column header="Status">
        <template #body="{ data }">
          <Tag :severity="data.isActive ? 'success' : 'danger'" :value="data.isActive ? 'Active' : 'Inactive'" />
        </template>
      </Column>
      <Column header="Dibuat">
        <template #body="{ data }">
          {{ dayjs(data.createdAt).format('DD MMM YYYY HH:mm') }}
        </template>
      </Column>
      <Column header="">
        <template #body="{ data }">
          <Button
            v-if="data.isActive"
            label="Deactivate"
            severity="danger"
            text
            size="small"
            @click="confirmDeactivate(data)"
          />
        </template>
      </Column>
      <template #empty>Belum ada site.</template>
    </DataTable>

    <SiteFormDialog v-model:visible="dialogVisible" @created="loadSites" />
  </div>
</template>
