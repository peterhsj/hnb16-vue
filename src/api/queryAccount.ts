import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryAccount'
import { api } from './axios'

/**
 * 查詢會計帳務分錄
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryAccount/list', {
    ...payload,
    page,
    pageSize,
  })
}
