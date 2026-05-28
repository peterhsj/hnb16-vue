import type { ListResponse, ListSearchParams } from '@/types/expiredLc'
import { api } from './axios'

/**
 * 查詢 CDS 過期案件主動註銷清冊
 */
export function getDataList (payload: ListSearchParams) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/expiredLc/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
