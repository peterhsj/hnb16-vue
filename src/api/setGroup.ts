import type {
  ListResponse,
  ListSearchParams,
} from '@/types/setGroup'
import { api } from './axios'

/**
 * 查詢客戶群組
 */
export function getDatacList (payload: ListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/setGroup/list', {
    ...payload,
    page,
    pageSize,
  })
}
