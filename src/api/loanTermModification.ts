import type { ListPayload, ListResponse } from '@/types/loanTermModification'
import { api } from './axios'

/**
 * 查詢利率約定改貸沖正(EC)清冊
 */
export function getDateList (payload: ListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<ListResponse>('/api/loanTermModification/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
