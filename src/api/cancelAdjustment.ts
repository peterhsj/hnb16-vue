import type { ListPayload, ListResponse } from '@/types/cancelAdjustment'
import { api } from './axios'

/**
 * 查詢註銷申請當日調整帳務清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/cancelAdjustment/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
