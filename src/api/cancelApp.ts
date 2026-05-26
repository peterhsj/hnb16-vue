import type {
  CancelAppListResponse,
  CancelAppListSearchParams,
} from '@/types/cancelApp'
import { api } from './axios'

/**
 * 查詢註銷申請/切結書清冊
 */
export function getCancelAppList (payload: CancelAppListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<CancelAppListResponse>('/api/cancelApp/lcList', {
    ...payload,
    page,
    pageSize,
  })
}
