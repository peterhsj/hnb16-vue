import type {
  AmendLcListResponse,
  AmendLcListSearchParams,
} from '@/types/amendLcList'
import type { AmendQueryFormPayload, BeneTypeOption } from '@/types/amendQuery'
import { api } from './axios'

// export interface SearchAmendLcListPayload {
//   page?: number
//   itemsPerPage?: number
//   // beneficiaryType?: string | null // 受益人類型
//   // beneficiary?: string | null // 受益人 Id
// }

/**
 * 查詢修改申請書可用之信用狀清冊
 */
export function getAmendLcList (payload: AmendLcListSearchParams) {
  const { page = 1, pageSize = 10 } = payload
  return api.post<AmendLcListResponse>('/api/amendApp/lcList', {
    ...payload,
    page,
    pageSize,
  })
}
