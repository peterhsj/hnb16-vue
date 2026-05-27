import type { AmendLcAppListResponse, AmendLcListPayload } from '@/types/amendLcApp'
import { api } from './axios'

/**
 * 查詢開狀沖正(EC)清冊
 */
export function getAmendLcList (payload: AmendLcListPayload) {
  const { page = 1, itemsPerPage = 10 } = payload
  return api.post<AmendLcAppListResponse>('/api/amendLcApp/list', {
    ...payload,
    page,
    itemsPerPage,
  })
}
