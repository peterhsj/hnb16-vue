import { api } from './axios'
interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
  total?: number
}

export function getDraftDetailList (payload: { draftNo: string }) {
  return api.post<ApiResponse>('/api/draftDetail/list', payload)
}
