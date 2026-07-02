<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue/usetoast'
import { getVisitorByFingerprintId } from '@/services/visitors.service'
import { extractErrorMessage } from '@/services/api'
import type { VisitorDetail } from '@/types/api'

const props = defineProps<{ fingerprintId: string }>()

const router = useRouter()
const toast = useToast()

const visitor = ref<VisitorDetail | null>(null)
const loading = ref(false)

async function load(): Promise<void> {
  loading.value = true
  try {
    visitor.value = await getVisitorByFingerprintId(props.fingerprintId)
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal memuat visitor', detail: extractErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <Button icon="pi pi-arrow-left" text @click="router.push({ name: 'visitors' })" />
      <h1 class="text-xl font-semibold text-surface-900">Visitor Detail</h1>
    </div>

    <Skeleton v-if="loading" height="24rem" />

    <template v-else-if="visitor">
      <Panel header="Info">
        <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
          <div>
            <dt class="text-surface-500">Fingerprint ID</dt>
            <dd class="font-mono break-all">{{ visitor.fingerprintId }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">Visit Count</dt>
            <dd>{{ visitor.visitCount }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">Country / City</dt>
            <dd>{{ [visitor.city, visitor.country].filter(Boolean).join(', ') || '—' }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">ISP</dt>
            <dd>{{ visitor.isp ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">Timezone</dt>
            <dd>{{ visitor.timezone ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">TZ Country</dt>
            <dd>{{ visitor.timezoneCountry ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">First Seen</dt>
            <dd>{{ dayjs(visitor.firstSeenAt).format('DD MMM YYYY HH:mm') }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">Last Seen</dt>
            <dd>{{ dayjs(visitor.lastSeenAt).format('DD MMM YYYY HH:mm') }}</dd>
          </div>
        </dl>
      </Panel>

      <Panel header="Fingerprint Components" toggleable :collapsed="true">
        <dl v-if="visitor.fingerprintComponent" class="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div>
            <dt class="text-surface-500">Canvas Hash</dt>
            <dd class="font-mono break-all">{{ visitor.fingerprintComponent.canvasHash ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">WebGL Hash</dt>
            <dd class="font-mono break-all">{{ visitor.fingerprintComponent.webglHash ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-surface-500">Audio Hash</dt>
            <dd class="font-mono break-all">{{ visitor.fingerprintComponent.audioHash ?? '—' }}</dd>
          </div>
        </dl>
        <pre
          v-if="visitor.fingerprintComponent?.raw"
          class="mt-3 max-h-64 overflow-auto rounded-md bg-surface-50 p-3 text-xs"
          >{{ JSON.stringify(visitor.fingerprintComponent.raw, null, 2) }}</pre
        >
        <div v-if="visitor.fingerprintComponent?.uaChRaw" class="mt-3">
          <p class="mb-1 text-sm text-surface-500">UA Client Hints (raw)</p>
          <pre class="max-h-64 overflow-auto rounded-md bg-surface-50 p-3 text-xs"
            >{{ JSON.stringify(visitor.fingerprintComponent.uaChRaw, null, 2) }}</pre
          >
        </div>
        <p v-if="!visitor.fingerprintComponent" class="text-sm text-surface-500">
          Tidak ada data fingerprint components.
        </p>
      </Panel>

      <Panel header="Visit Logs (50 terakhir)">
        <DataTable :value="visitor.visitLogs" data-key="id" striped-rows size="small">
          <Column header="Time">
            <template #body="{ data }">{{ dayjs(data.createdAt).format('DD MMM YYYY HH:mm') }}</template>
          </Column>
          <Column field="ip" header="IP" />
          <Column field="pageUrl" header="Page URL" />
          <Column field="referrer" header="Referrer">
            <template #body="{ data }">{{ data.referrer ?? '—' }}</template>
          </Column>
          <Column field="browser" header="Browser">
            <template #body="{ data }">{{ data.browser ?? '—' }}</template>
          </Column>
          <Column field="os" header="OS">
            <template #body="{ data }">{{ data.os ?? '—' }}</template>
          </Column>
          <Column field="deviceType" header="Device">
            <template #body="{ data }">{{ data.deviceType ?? '—' }}</template>
          </Column>
          <Column header="Platform">
            <template #body="{ data }">
              {{ [data.uaPlatform, data.uaPlatformVersion].filter(Boolean).join(' ') || '—' }}
            </template>
          </Column>
          <Column header="Mobile">
            <template #body="{ data }">
              {{ data.uaMobile === null || data.uaMobile === undefined ? '—' : data.uaMobile ? 'Ya' : 'Tidak' }}
            </template>
          </Column>
          <Column header="Geo">
            <template #body="{ data }">
              <span v-if="data.geoLat != null && data.geoLon != null">
                {{ data.geoLat.toFixed(4) }}, {{ data.geoLon.toFixed(4) }}
                <span v-if="data.geoAccuracy != null" class="text-surface-400">(±{{ data.geoAccuracy }}m)</span>
              </span>
              <span v-else>—</span>
            </template>
          </Column>
          <template #empty>Belum ada log kunjungan.</template>
        </DataTable>
      </Panel>
    </template>
  </div>
</template>
