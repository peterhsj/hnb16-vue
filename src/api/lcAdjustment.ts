import type { ListPayload, ListResponse } from '@/types/lcAdjustment'
import { api } from './axios'

/**
 * 查詢開狀沖正(EC)清冊
 */
export function getDataList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/lcAdjustment/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
