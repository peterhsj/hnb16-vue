import type {
  ListResponse,
  QueryFormPayload,
} from '@/types/managerBeneficiary'
import { api } from './axios'

/**
 * 查詢台塑網通訊傳輸排程檢視
 */
export function getDatacList (payload: Partial<QueryFormPayload>) {
  return api.post<ListResponse>('/api/managerBeneficiary/list', payload)
}
