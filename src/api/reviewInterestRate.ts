import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/reviewInterestRate'
import { api } from './axios'

/**
 * 查詢押匯申請可用之信用狀清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/reviewInterestRate/list', {
    ...payload,
    page,
    pageSize,
  })
}
