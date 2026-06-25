import type {
  ListResponse,
  ListSearchParams,
} from '@/types/managerMember'
import { api } from './axios'

/**
 * 查詢會員清冊
 */
export function getDatacList (payload: ListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/managerMember/list', {
    ...payload,
    page,
    pageSize,
  })
}
