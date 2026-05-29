import type { BeneListResponse, ListPayload, ListResponse } from '@/types/reviewDraftApp'
import { api } from './axios'

/**
 * 查詢押匯申請待審核清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/reviewDraftApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}

/**
 * 查詢押匯申請待審核受益人清冊
 */
export function getBeneList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<BeneListResponse>('/api/reviewDraftApp/beneList', {
    ...payload,
    page,
    itemsPerPage,
  })
}
