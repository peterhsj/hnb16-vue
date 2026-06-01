import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryDraft'
import { api } from './axios'

/**
 * 查詢押匯清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryDraft/list', {
    ...payload,
    page,
    pageSize,
  })
}
