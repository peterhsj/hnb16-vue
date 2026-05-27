import type { CurrentAmendListPayload, CurrentAmendListResponse } from '@/types/currentAmendApp'
import { api } from './axios'

/**
 * 查詢修狀沖正(EC)清冊
 */
export function getDateList (payload: CurrentAmendListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<CurrentAmendListResponse>('/api/currentAmendApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
