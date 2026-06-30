import { api } from '@/services/api'
import type { CreateSiteDto, Site } from '@/types/api'

export async function listSites(): Promise<Site[]> {
  const { data } = await api.get<Site[]>('/v1/sites')
  return data
}

export async function createSite(dto: CreateSiteDto): Promise<Site> {
  const { data } = await api.post<Site>('/v1/sites', dto)
  return data
}

export async function deactivateSite(id: string): Promise<Site> {
  const { data } = await api.delete<Site>(`/v1/sites/${id}`)
  return data
}
