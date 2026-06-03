import type {
  ListResponse,
  ListSearchParams,
} from '@/types/setBeneficiary'
import { api } from './axios'

/**
 * 查詢客戶群組
 */
export function getDatacList (payload: ListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/setBeneficiary/list', {
    ...payload,
    page,
    pageSize,
  })
}
