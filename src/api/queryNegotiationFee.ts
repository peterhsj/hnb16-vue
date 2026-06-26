import type {
  ListResponse,
  QueryFormPayload,
} from '@/types/queryNegotiationFee'
import { api } from './axios'

/**
 * 查詢未結案信用狀額度與保證金清冊
 */
export function getDatacList (payload: Partial<QueryFormPayload>) {
  return api.post<ListResponse>('/api/queryNegotiationFee/list', payload)
}
