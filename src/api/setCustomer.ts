import type {
  ListResponse,
  ListSearchParams,
} from '@/types/setCustomer'
import { api } from './axios'

/**
 * 查詢客戶群組
 */
export function getDatacList (payload: ListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/setCustomer/list', {
    ...payload,
    page,
    pageSize,
  })
}
