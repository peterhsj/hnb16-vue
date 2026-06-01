import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryLc'
import { api } from './axios'

/**
 * 查詢信用狀清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryLc/list', {
    ...payload,
    page,
    pageSize,
  })
}
