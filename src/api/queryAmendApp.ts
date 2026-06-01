import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryAmendApp'
import { api } from './axios'

/**
 * 查詢修改申請書清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload> & { amendAppNo?: string }) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryAmendApp/list', {
    ...payload,
    page,
    pageSize,
  })
}
