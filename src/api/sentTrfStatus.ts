import type { ListResponse, ListSearchParams } from '@/types/sentTrfStatus'
import { api } from './axios'

/**
 * 查詢傳送已轉帳狀態清冊
 */
export function getDataList (payload: ListSearchParams) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/sentTrfStatus/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
