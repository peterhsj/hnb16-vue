import type {
  ListResponse,
  ListSearchParams,
  QueryFormPayload,
} from '@/types/querySar'
import { api } from './axios'

/**
 * 查詢主管核准押匯紀錄清冊
 */
export function getDatacList (payload: ListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/querySar/list', {
    ...payload,
    page,
    pageSize,
  })
}
