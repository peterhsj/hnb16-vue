import type {
  ListResponse,
  QueryFormPayload,
} from '@/types/queryLcFeeDetail'
import { api } from './axios'

/**
 * 查詢信用狀手續費明細表
 */
export function getDatacList (payload: Partial<QueryFormPayload>) {
  return api.post<ListResponse>('/api/queryLcFeeDetail/list', payload)
}
