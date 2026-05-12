import { api } from './axios'

export interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
  total?: number
  amount?: number
}

export interface LcAppItem {
  appNo: string       // 開狀申請書號碼
  lcNo: string        // 信用狀號碼
  lcType: string      // 信用狀別
  applicant: string   // 申請人
  notifyBank: string  // 通知銀行
  applyDate: string   // 申請日期
  amount: number      // 金額
  beneficiary: string // 受益人
  status: string      // 狀態
}

export interface LcAppListPayload {
  page?: number
  itemsPerPage?: number
}

/**
 * 查詢開狀申請書列表
 */
export function getLcAppList (payload: LcAppListPayload = {}) {
  const { page = 1, itemsPerPage = 20 } = payload
  return api.get<ApiResponse<LcAppItem[]>>('/api/lcApp/list', {
    params: { page, itemsPerPage },
  })
}
