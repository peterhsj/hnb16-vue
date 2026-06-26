import type {
  ListResponse,
  QueryFormPayload,
} from '@/types/queryDomesticLcFee.ts'
import { api } from './axios'

/**
 * 查詢國內信用狀開狀手續費
 */
export function getDatacList (payload: Partial<QueryFormPayload>) {
  return api.post<ListResponse>('/api/queryDomesticLcFee/list', payload)
}
