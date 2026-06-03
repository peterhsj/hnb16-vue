import type {
  ListResponse,
  ListSearchParams,
  QueryFormPayload,
} from '@/types/rePromptDraft'
import { api } from './axios'

/**
 * 查詢會計帳務分錄
 */
export function getDatacList (payload: ListSearchParams & Partial<QueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/rePromptDraft/list', {
    ...payload,
    page,
    pageSize,
  })
}
