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
import { listBlockedIps, removeBlockedIp } from '@/services/blocklist.service'
import { extractErrorMessage } from '@/services/api'
import type { BlockedIp } from '@/types/api'
import BlockIpDialog from '@/components/blocklist/BlockIpDialog.vue'

const toast = useToast()
const confirm = useConfirm()

const blockedIps = ref<BlockedIp[]>([])
const loading = ref(false)
const dialogVisible = ref(false)

async function load(): Promise<void> {
  loading.value = true
  try {
    blockedIps.value = await listBlockedIps()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal memuat blocklist', detail: extractErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

function isExpired(blockedIp: BlockedIp): boolean {
  return !!blockedIp.expiresAt && dayjs(blockedIp.expiresAt).isBefore(dayjs())
}

function confirmRemove(blockedIp: BlockedIp): void {
  confirm.require({
    message: `Hapus blokir untuk IP "${blockedIp.ip}"?`,
    header: 'Konfirmasi',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: { severity: 'danger', label: 'Hapus' },
    rejectProps: { severity: 'secondary', outlined: true, label: 'Batal' },
    accept: async () => {
      try {
        await removeBlockedIp(blockedIp.ip)
        toast.add({ severity: 'success', summary: 'IP dihapus dari blocklist', life: 2000 })
        await load()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Gagal menghapus IP', detail: extractErrorMessage(error) })
      }
    },
  })
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-surface-900">Blocklist</h1>
      <Button label="Block IP" icon="pi pi-plus" severity="danger" @click="dialogVisible = true" />
    </div>

    <Skeleton v-if="loading" height="16rem" />
    <DataTable v-else :value="blockedIps" data-key="id" striped-rows>
      <Column field="ip" header="IP" />
      <Column field="reason" header="Reason">
        <template #body="{ data }">{{ data.reason ?? '—' }}</template>
      </Column>
      <Column field="blockedBy" header="Blocked By">
        <template #body="{ data }">{{ data.blockedBy ?? '—' }}</template>
      </Column>
      <Column header="Expires">
        <template #body="{ data }">
          <Tag v-if="!data.expiresAt" severity="info" value="Permanent" />
          <Tag
            v-else
            :severity="isExpired(data) ? 'secondary' : 'warn'"
            :value="dayjs(data.expiresAt).format('DD MMM YYYY HH:mm')"
          />
        </template>
      </Column>
      <Column header="Dibuat">
        <template #body="{ data }">{{ dayjs(data.createdAt).format('DD MMM YYYY HH:mm') }}</template>
      </Column>
      <Column header="">
        <template #body="{ data }">
          <Button icon="pi pi-trash" severity="danger" text size="small" @click="confirmRemove(data)" />
        </template>
      </Column>
      <template #empty>Belum ada IP yang diblokir.</template>
    </DataTable>

    <BlockIpDialog v-model:visible="dialogVisible" @created="load" />
  </div>
</template>
