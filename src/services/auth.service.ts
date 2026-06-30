import { api } from '@/services/api'
import type { LoginDto, LoginResponse } from '@/types/api'

export async function loginRequest(dto: LoginDto): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/v1/auth/login', dto)
  return data
}
