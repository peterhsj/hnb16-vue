import type {
  ListResponse,
  ListSearchParams,
} from '@/types/managerPersonal'
import { api } from './axios'

/**
 * 查詢客戶群組
 */
export function getDatacList (payload: ListSearchParams) {
  const { userId = '00122' } = payload
  return api.post<ListResponse>('/api/managerPersonal/list', {
    ...payload,
    userId,
  })
}
