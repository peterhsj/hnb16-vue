// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type DraftQueryMode = 'lcNo' | 'criteria' | ''

export type DraftLcStatusOption = 'expired' | 'active'

export type DraftLcStatusLabel = '未到期' | '已到期'

export interface DraftLcStatusItem {
  readonly title: string
  readonly value: DraftLcStatusOption
}

export interface DraftQueryFormPayload {
  queryMode: DraftQueryMode
  lcNo: string
  applicantTaxId: string    // 申請人統編
  beneficiaryTaxId: string  // 受益人統編
  lcStatus: DraftLcStatusOption | null
  issueDateStart: string
  issueDateEnd: string
}

export function createInitialDraftQueryForm (): DraftQueryFormPayload {
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

export const LC_STATUS_ITEMS: readonly DraftLcStatusItem[] = [
  { title: '已到期', value: 'expired' },
  { title: '未到期', value: 'active' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
export interface DraftLcListItem {
  lcNo: string
  issuingBank: string
  issueDate: string
  totalAmount: number
  availableBalance: number
  beneficiary: string
  beneficiaryTaxId: string
  status: DraftLcStatusLabel
  isAccepted: boolean
}

export interface DraftLcListSummary {
  total: number
  amount: number
}

export interface DraftLcListResponse {
  items: DraftLcListItem[]
  summary: DraftLcListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface DraftLcListSearchParams {
  page?: number
  pageSize?: number
}

// ── 押匯申請書 Props ──────────────────────────────────────────────────────────
export interface DraftLcData {
  appNo: string
}

// ── 押匯申請書表單 Payload ────────────────────────────────────────────────────
export interface DraftLcPayload {
  negotiationAmount: string  // 押匯/承兌金額
  draftIssueDate: string     // 匯票發票日
}

export function createInitialDraftLcForm (): DraftLcPayload {
  return {
    negotiationAmount: '',
    draftIssueDate: '',
  }
}
