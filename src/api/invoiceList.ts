import { api } from './axios'
interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
  total?: number
}

export function getInvoiceList (payload?: Record<string, any>) {
  return api.post<ApiResponse>('/api/invoice/list', payload)
}
