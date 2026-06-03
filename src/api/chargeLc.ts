import type {
  ListResponse,
  ListSearchParams,
} from '@/types/chargeLc.ts'
import { api } from './axios'

/**
 * 查詢會計帳務分錄
 */
export function getDatacList (payload: ListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/chargeLc/list', {
    ...payload,
    page,
    pageSize,
  })
}
