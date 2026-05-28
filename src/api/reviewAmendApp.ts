import type { ListPayload, ListResponse } from '@/types/reviewAmendApp'
import { api } from './axios'

/**
 * 查詢開狀申請書待審核清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/reviewAmendApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
