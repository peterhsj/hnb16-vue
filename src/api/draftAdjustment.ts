import type { ListPayload, ListResponse } from '@/types/draftAdjustment'
import { api } from './axios'

/**
 * 查詢押匯沖正(EC)清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/draftAdjustment/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
