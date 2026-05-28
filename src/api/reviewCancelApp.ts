import type { ListPayload, ListResponse } from '@/types/reviewCancelApp'
import { api } from './axios'

/**
 * 查詢註銷申請書待審核清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/reviewCancelApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
