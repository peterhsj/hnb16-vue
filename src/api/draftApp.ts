import type {
  DraftLcListResponse,
  DraftLcListSearchParams,
  DraftQueryFormPayload,
} from '@/types/draftApp'
import { api } from './axios'

/**
 * 查詢押匯申請可用之信用狀清冊
 */
export function getDraftLcList (payload: DraftLcListSearchParams & Partial<DraftQueryFormPayload>) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<DraftLcListResponse>('/api/draftApp/lcList', {
    ...payload,
    page,
    pageSize,
  })
}
