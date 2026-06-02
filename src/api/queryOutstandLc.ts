import type {
  LcListResponse,
  QueryFormPayload,
} from '@/types/queryOutstandLc'
import { api } from './axios'

/**
 * 查詢未結案信用狀額度與保證金清冊
 */
export function getDatacList (payload: Partial<QueryFormPayload>) {
  return api.post<LcListResponse>('/api/queryOutstandLc/list', payload)
}
