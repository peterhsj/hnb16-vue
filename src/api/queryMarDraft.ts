import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryMarDraft'
import { api } from './axios'

/**
 * 查詢主管核准押匯紀錄清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryMarDraft/list', {
    ...payload,
    page,
    pageSize,
  })
}
