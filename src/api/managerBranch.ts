import type {
  ListResponse,
  ListSearchParams,
} from '@/types/managerBranch'
import { api } from './axios'

/**
 * 查詢分行清冊
 */
export function getDatacList (payload: ListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<ListResponse>('/api/managerBranch/list', {
    ...payload,
    page,
    pageSize,
  })
}
