// ── 共用 ──────────────────────────────────────────────────────────────────
export type LcTypeOption = 'sight' | 'usance'

export type AmendLcStatusLabel = '未到期' | '已到期'

export interface AmendLcListItem {
  lcNo: string
  issuingBank: string
  issueDate: string
  totalAmount: number
  availableBalance: number
  beneficiaryTaxId: string
  status: AmendLcStatusLabel
  lcType: LcTypeOption
}

export interface AmendLcListSummary {
  total: number
  amount: number
}

export interface AmendLcListResponse {
  items: AmendLcListItem[]
  summary: AmendLcListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface AmendLcListSearchParams {
  page?: number
  pageSize?: number
}

export function formatLcCurrency (amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatLcTypeLabel (lcType: LcTypeOption): string {
  return lcType === 'sight' ? '即期' : '遠期'
}

export type BeneTypeOption = 'cds' | 'fpc' | 'other'

export type AmendQueryMode = 'lcNo' | 'criteria' | ''

export type LcStatusOption = 'expired' | 'active'

export interface BeneTypeItem {
  readonly title: string
  readonly value: BeneTypeOption
}

export interface LcStatusItem {
  readonly title: string
  readonly value: LcStatusOption
}

export interface AmendQueryFormPayload {
  beneType?: BeneTypeOption | null
  queryMode?: AmendQueryMode
  lcNo: string
  applicantLoanAccount: string
  beneficiaryTaxId: string
  lcStatus: LcStatusOption | null
  issueDateStart: string
  issueDateEnd: string
}

export function createInitialAmendQueryForm (): AmendQueryFormPayload {
  return {
    beneType: null, // 受益人類型
    queryMode: '', // 查詢模式：lcNo 依信用狀號碼、criteria 依條件
    lcNo: '', // 信用狀號碼
    applicantLoanAccount: '', // 申請人放款戶號
    beneficiaryTaxId: '', // 受益人統編
    lcStatus: null, // 信用狀狀態：expired 已到期、active 未到期
    issueDateStart: '', // 開狀日期起（格式 YYYY/MM/DD）
    issueDateEnd: '', // 開狀日期迄（格式 YYYY/MM/DD）
  }
}

export const BENE_TYPE_ITEMS: readonly BeneTypeItem[] = [
  {
    title: 'CDS 客戶 (中鋼、中鴻、中鋁、華新麗華、東和鋼鐵)',
    value: 'cds',
  },
  {
    title: '台塑 e 化平台客戶 (台塑集團、奇美集團)',
    value: 'fpc',
  },
  {
    title: '其他客戶',
    value: 'other',
  },
] as const

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '已到期', value: 'expired' },
  { title: '未到期', value: 'active' },
] as const

export interface AmendLcAppItem {
  lcNo: string // 信用狀號碼
  issuingBank: string // 開狀銀行
  issueDate: string //
  totalAmount: number //
  availableBalance: number //
  beneficiaryTaxId: string //
  status: AmendLcStatusLabel //
}
