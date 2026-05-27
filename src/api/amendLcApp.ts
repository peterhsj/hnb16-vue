import type { ListPayload, ListResponse } from '@/types/amendLcApp'
import { api } from './axios'

/**
 * 查詢開狀沖正(EC)清冊
 */
export function getDataList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/amendLcApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
