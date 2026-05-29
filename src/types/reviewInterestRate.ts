// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type QueryMode = 'lcNo' | 'criteria' | ''

export type LcStatusOption = 'expired' | 'active'

export type LcStatusLabel = '未到期' | '已到期'

export interface LcStatusItem {
  readonly title: string
  readonly value: LcStatusOption
}

export interface QueryFormPayload {
  queryMode: QueryMode
  lcNo: string
  applicantTaxId: string    // 申請人統編
  beneficiaryTaxId: string  // 受益人統編
  lcStatus: LcStatusOption | null
  issueDateStart: string
  issueDateEnd: string
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    queryMode: '',           // 查詢模式：lcNo 依信用狀號碼、criteria 依條件
    lcNo: '',                // 信用狀號碼
    applicantTaxId: '',      // 申請人統編
    beneficiaryTaxId: '',    // 受益人統編
    lcStatus: null,          // 信用狀狀態：expired 已到期、active 未到期
    issueDateStart: '',      // 開狀日期起（格式 YYYY/MM/DD）
    issueDateEnd: '',        // 開狀日期迄（格式 YYYY/MM/DD）
  }
}

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '已到期', value: 'expired' },
  { title: '未到期', value: 'active' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
export interface LcListItem {
  lcNo: string // 信用狀號碼
  issueDate: string // 開狀日期
  totalAmount: number // 總金額
  draftNo: string | null // 匯票號碼
  draftAmount: number // 匯票金額
  beneficiary: string // 受益人
  expiryDate: string // 有效期限
  status: string // 利率改貸狀態
  confirmationDate: string // 確認日期
}

export interface LcListSummary {
  total: number
  amount: number
}

export interface LcListResponse {
  items: LcListItem[]
  summary: LcListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface LcListSearchParams {
  page?: number
  pageSize?: number
}

// ── 押匯申請書 Props ──────────────────────────────────────────────────────────
export interface LcData {
  appNo: string
}

// ── 押匯申請書表單 Payload ────────────────────────────────────────────────────
export interface LcPayload {
  negotiationAmount: string  // 押匯/承兌金額
  draftIssueDate: string     // 匯票發票日
}

export function createInitialLcForm (): LcPayload {
  return {
    negotiationAmount: '',
    draftIssueDate: '',
  }
}
