import type { FormData } from '@/types/auth'
import type { ApiResponse } from '@/types/common'
import { api } from './axios'

export function login (payload: FormData) {
  return api.post<ApiResponse>('/api/auth/login', payload)
}

export function logout (payload: { account: string }) {
  return api.post<ApiResponse>('/api/auth/logout', payload)
}
