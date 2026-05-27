import type { ListPayload, ListResponse } from '@/types/currentCancelApp'
import { api } from './axios'

/**
 * 查詢註銷信用狀沖正(EC)清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/currentCancelApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
