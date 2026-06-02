import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryInterestRate'
import { api } from './axios'

/**
 * 查詢利率約定改貸清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryInterestRate/list', {
    ...payload,
    page,
    pageSize,
  })
}
