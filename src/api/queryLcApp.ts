import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryLcApp'
import { api } from './axios'

/**
 * 查詢開狀申請書清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryLcApp/list', {
    ...payload,
    page,
    pageSize,
  })
}
