<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import DataTable, { type DataTablePageEvent, type DataTableRowClickEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import { listVisitors } from '@/services/visitors.service'
import { extractErrorMessage } from '@/services/api'
import type { Visitor } from '@/types/api'

const router = useRouter()
const toast = useToast()

const visitors = ref<Visitor[]>([])
const total = ref(0)
const loading = ref(false)

const query = reactive({
  skip: 0,
  take: 25,
  country: '',
  from: null as Date | null,
  to: null as Date | null,
})

async function loadVisitors(): Promise<void> {
  loading.value = true
  try {
    const result = await listVisitors({
      skip: query.skip,
      take: query.take,
      country: query.country || undefined,
      from: query.from ? dayjs(query.from).startOf('day').toISOString() : undefined,
      to: query.to ? dayjs(query.to).endOf('day').toISOString() : undefined,
    })
    visitors.value = result.items
    total.value = result.total
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal memuat visitors', detail: extractErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

function applyFilter(): void {
  query.skip = 0
  loadVisitors()
}

function resetFilter(): void {
  query.country = ''
  query.from = null
  query.to = null
  query.skip = 0
  loadVisitors()
}

function onPage(event: DataTablePageEvent): void {
  query.skip = event.first
  query.take = event.rows
  loadVisitors()
}

function onRowClick(event: DataTableRowClickEvent): void {
  const visitor = event.data as Visitor
  router.push({ name: 'visitor-detail', params: { fingerprintId: visitor.fingerprintId } })
}

onMounted(loadVisitors)
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-xl font-semibold text-surface-900">Visitors</h1>

    <div class="flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-surface-700">Country</label>
        <InputText v-model="query.country" placeholder="ID, US, ..." @keyup.enter="applyFilter" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-surface-700">From</label>
        <DatePicker v-model="query.from" date-format="yy-mm-dd" show-icon />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-surface-700">To</label>
        <DatePicker v-model="query.to" date-format="yy-mm-dd" show-icon />
      </div>
      <Button label="Filter" icon="pi pi-filter" @click="applyFilter" />
      <Button label="Reset" severity="secondary" outlined @click="resetFilter" />
    </div>

    <Skeleton v-if="loading && visitors.length === 0" height="20rem" />
    <DataTable
      v-else
      :value="visitors"
      data-key="id"
      striped-rows
      lazy
      paginator
      :rows="query.take"
      :total-records="total"
      :first="query.skip"
      :loading="loading"
      row-hover
      class="cursor-pointer"
      @page="onPage"
      @row-click="onRowClick"
    >
      <Column field="fingerprintId" header="Fingerprint ID">
        <template #body="{ data }">
          <code class="text-xs">{{ data.fingerprintId.slice(0, 16) }}…</code>
        </template>
      </Column>
      <Column field="visitCount" header="Visits" />
      <Column header="Location">
        <template #body="{ data }">
          {{ [data.city, data.country].filter(Boolean).join(', ') || '—' }}
        </template>
      </Column>
      <Column field="isp" header="ISP">
        <template #body="{ data }">{{ data.isp ?? '—' }}</template>
      </Column>
      <Column header="First Seen">
        <template #body="{ data }">{{ dayjs(data.firstSeenAt).format('DD MMM YYYY HH:mm') }}</template>
      </Column>
      <Column header="Last Seen">
        <template #body="{ data }">{{ dayjs(data.lastSeenAt).format('DD MMM YYYY HH:mm') }}</template>
      </Column>
      <template #empty>Belum ada visitor.</template>
    </DataTable>
  </div>
</template>
