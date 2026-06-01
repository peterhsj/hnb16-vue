import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryCancelApp'
import { api } from './axios'

/**
 * 查詢註銷申請書清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryCancelApp/list', {
    ...payload,
    page,
    pageSize,
  })
}
