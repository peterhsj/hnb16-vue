// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type ExpiredLcQueryMode = 'lcNo' | 'criteria' | ''

export type LcStatusOption = 'expired' | 'active'

export type LcStatusLabel = '未到期' | '已到期'

export interface LcStatusItem {
  readonly title: string
  readonly value: LcStatusOption
}

export interface QueryFormPayload {
  queryMode: ExpiredLcQueryMode
  lcNo: string // 信用狀號碼
  beneficiaryTaxId: string // 受益人統編
  lcStatus: LcStatusOption | null // 信用狀狀態
  issueDateStart: string // 開狀日期起（格式 YYYY/MM/DD）
  issueDateEnd: string // 開狀日期訖（格式 YYYY/MM/DD）
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    queryMode: '', // 查詢模式：lcNo 依信用狀號碼、criteria 依條件
    lcNo: '', // 信用狀號碼
    beneficiaryTaxId: '', // 受益人統編
    lcStatus: null, // 信用狀狀態
    issueDateStart: '', // 開狀日期起
    issueDateEnd: '', // 開狀日期訖
  }
}

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '已到期', value: 'expired' },
  { title: '未到期', value: 'active' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
export interface LcData {
  lcNo: string
}

// ── 清單項目 ──────────────────────────────────────────────────────────────────
export interface ListItem {
  lcNo: string // 信用狀號碼
  issuingBank: string // 開狀銀行
  issueDate: string // 開狀日期
  totalAmount: number // 總金額
  availableAmount: number // 可用餘額
  beneficiaryTaxId: string // 受益人統編
  status: LcStatusLabel // 狀態
}

export interface ListSummary {
  total: number // 總筆數
  amount: number // 總金額
}

export interface ListResponse {
  items: ListItem[]
  summary: ListSummary
  page: number
  itemsPerPage: number
  totalPages: number
}

export interface ListSearchParams {
  page?: number
  itemsPerPage?: number
  lcNo?: string
  beneficiaryTaxId?: string
  lcStatus?: LcStatusOption | null
  issueDateStart?: string
  issueDateEnd?: string
}
