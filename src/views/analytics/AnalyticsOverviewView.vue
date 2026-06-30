<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { Bar, Line } from 'vue-chartjs'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import Skeleton from 'primevue/skeleton'
import Panel from 'primevue/panel'
import { useToast } from 'primevue/usetoast'
import { getAnalyticsOverview } from '@/services/analytics.service'
import { extractErrorMessage } from '@/services/api'
import type { AnalyticsOverview } from '@/types/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

const toast = useToast()

const overview = ref<AnalyticsOverview | null>(null)
const loading = ref(false)

async function load(): Promise<void> {
  loading.value = true
  try {
    overview.value = await getAnalyticsOverview()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal memuat analytics', detail: extractErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

const topCountriesData = computed(() => ({
  labels: overview.value?.topCountries.map((c) => c.country) ?? [],
  datasets: [
    {
      label: 'Visitors',
      backgroundColor: '#6366f1',
      data: overview.value?.topCountries.map((c) => c.count) ?? [],
    },
  ],
}))

const last30DaysData = computed(() => ({
  labels: overview.value?.last30Days.map((d) => dayjs(d.day).format('DD MMM')) ?? [],
  datasets: [
    {
      label: 'Visits',
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      tension: 0.3,
      fill: true,
      data: overview.value?.last30Days.map((d) => d.count) ?? [],
    },
  ],
}))

const chartOptions = { responsive: true, maintainAspectRatio: false }

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-xl font-semibold text-surface-900">Analytics Overview</h1>

    <Skeleton v-if="loading" height="24rem" />

    <template v-else-if="overview">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="rounded-lg border border-surface-200 bg-white p-5">
          <p class="text-sm text-surface-500">Total Visitors</p>
          <p class="text-3xl font-semibold text-surface-900">{{ overview.totalVisitors }}</p>
        </div>
        <div class="rounded-lg border border-surface-200 bg-white p-5">
          <p class="text-sm text-surface-500">Total Visits</p>
          <p class="text-3xl font-semibold text-surface-900">{{ overview.totalVisits }}</p>
        </div>
      </div>

      <Panel header="Visits — Last 30 Days">
        <div class="h-72">
          <Line :data="last30DaysData" :options="chartOptions" />
        </div>
      </Panel>

      <Panel header="Top Countries">
        <div v-if="overview.topCountries.length > 0" class="h-72">
          <Bar :data="topCountriesData" :options="chartOptions" />
        </div>
        <p v-else class="text-sm text-surface-500">Belum ada data country.</p>
      </Panel>
    </template>
  </div>
</template>
