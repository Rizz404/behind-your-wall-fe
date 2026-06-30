import { api } from '@/services/api'
import type { AnalyticsOverview } from '@/types/api'

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const { data } = await api.get<AnalyticsOverview>('/v1/analytics/overview')
  return data
}
