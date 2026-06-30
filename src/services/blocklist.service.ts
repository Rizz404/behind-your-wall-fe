import { api } from '@/services/api'
import type { BlockedIp, BlocklistCheckResult, CreateBlockedIpDto } from '@/types/api'

export async function listBlockedIps(): Promise<BlockedIp[]> {
  const { data } = await api.get<BlockedIp[]>('/v1/blocklist')
  return data
}

export async function createBlockedIp(dto: CreateBlockedIpDto): Promise<BlockedIp> {
  const { data } = await api.post<BlockedIp>('/v1/blocklist', dto)
  return data
}

export async function removeBlockedIp(ip: string): Promise<BlockedIp> {
  const { data } = await api.delete<BlockedIp>(`/v1/blocklist/${encodeURIComponent(ip)}`)
  return data
}

export async function checkIp(ip: string): Promise<BlocklistCheckResult> {
  const { data } = await api.get<BlocklistCheckResult>(
    `/v1/blocklist/check/${encodeURIComponent(ip)}`,
  )
  return data
}
