import type {
  LcListResponse,
  LcListSearchParams,
  QueryFormPayload,
} from '@/types/queryAmendNotice'
import { api } from './axios'

/**
 * 查詢信用狀修改通知書清冊
 */
export function getDatacList (payload: LcListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<LcListResponse>('/api/queryAmendNotice/list', {
    ...payload,
    page,
    pageSize,
  })
}
