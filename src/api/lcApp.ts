import { api } from './axios'
export interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
  total?: number
  amount?: number
}

export interface TypeForm {
  beneficiaryType: string | null // 受益人類型
  beneficiary: string | null // 受益人 Id
  inputType: string | null // 輸入類型 new: 新增 edit: 編輯
}
export interface SearchForm {
  searchType: 'lcNo' | 'appNo' | 'advanced' // 搜尋類型：信用狀號碼、申請書號碼、進階搜尋
  lcNo: string | null // 信用狀號碼
  appNo: string | null // 開狀申請書號碼
  beneNo: string | null // 申請人放款戶號
  beneInNo: string | null // 受益人統編
  status: string | null // 狀態
  startDate: string | null // 開狀日期起始日期
  endDate: string | null // 開狀日期結束日期
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
