import type { ListPayload, ListResponse } from '@/types/amendAdjustment'
import { api } from './axios'

/**
 * 查詢修狀沖正(EC)清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/amendAdjustment/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
