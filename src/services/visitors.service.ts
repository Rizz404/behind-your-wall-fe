import { api } from '@/services/api'
import type { ListVisitorsQuery, PaginatedVisitors, VisitorDetail } from '@/types/api'

export async function listVisitors(query: ListVisitorsQuery): Promise<PaginatedVisitors> {
  const { data } = await api.get<PaginatedVisitors>('/v1/visitors', { params: query })
  return data
}

export async function getVisitorByFingerprintId(fingerprintId: string): Promise<VisitorDetail> {
  const { data } = await api.get<VisitorDetail>(
    `/v1/visitors/${encodeURIComponent(fingerprintId)}`,
  )
  return data
}
