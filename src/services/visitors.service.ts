import { api } from '@/services/api'
import type {
  ListVisitorsQuery,
  ListVisitorsSummaryQuery,
  PaginatedVisitors,
  PaginatedVisitorSummary,
  VisitorDetail,
} from '@/types/api'

export async function listVisitors(query: ListVisitorsQuery): Promise<PaginatedVisitors> {
  const { data } = await api.get<PaginatedVisitors>('/v1/visitors', { params: query })
  return data
}

export async function listVisitorsSummary(
  query: ListVisitorsSummaryQuery,
): Promise<PaginatedVisitorSummary> {
  const { data } = await api.get<PaginatedVisitorSummary>('/v1/visitors/summary', { params: query })
  return data
}

export async function getVisitorByFingerprintId(fingerprintId: string): Promise<VisitorDetail> {
  const { data } = await api.get<VisitorDetail>(
    `/v1/visitors/${encodeURIComponent(fingerprintId)}`,
  )
  return data
}
