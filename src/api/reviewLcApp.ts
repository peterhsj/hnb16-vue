import type { ListPayload, ListResponse } from '@/types/reviewLcApp'
import { api } from './axios'

/**
 * 查詢開狀申請書待審核清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/reviewLcApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
