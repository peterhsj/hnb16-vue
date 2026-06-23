import type {
  ListResponse,
  ListSearchParams,
} from '@/types/draftRejection'
import { api } from './axios'

/**
 * 查詢信用狀清冊
 */
export function getDatacList (payload: ListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/draftRejection/list', {
    ...payload,
    page,
    pageSize,
  })
}
