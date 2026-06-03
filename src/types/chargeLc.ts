// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type QueryMode = 'accountSummary' | 'journalEntry' | ''

export type LcStatusOption = 'pendingOperator' | 'pendingManager' | 'issued' | 'rejected'

export type LcStatusLabel = '已到期' | '未到期'

export interface LcStatusItem {
  readonly title: string
  readonly value: LcStatusOption
}

export interface IssuingBankItem {
  readonly title: string
  readonly value: string
}

export type LcTypeOption = 'sight' | 'usance'

export interface LcTypeItem {
  readonly title: string
  readonly value: LcTypeOption
}

export type TransactionTypeOption = 'lcOpen' | 'lcAmend' | 'depositRefund' | 'cancelBalance' | ''

export interface TransactionTypeItem {
  readonly title: string
  readonly value: TransactionTypeOption
}

export interface QueryFormPayload {
  beneficiary: string | null // 受益人
  buyerTaxId: string | null // 買受人統編
  lcNo: string | null // 信用狀號碼
  draftNo: string | null // 匯票號碼
  appDateStart: string | null // 開狀日期起
  appDateEnd: string | null // 開狀日期訖
  issueDateStart: string | null // 押匯日期起
  issueDateEnd: string | null // 押匯日期訖
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    beneficiary: null, // 受益人
    buyerTaxId: null, // 買受人統編
    lcNo: null, // 信用狀號碼
    draftNo: null, // 匯票號碼
    appDateStart: null, // 開狀日期起
    appDateEnd: null, // 開狀日期訖
    issueDateStart: null, // 押匯日期起
    issueDateEnd: null, // 押匯日期訖
  }
}

export const TRANSACTION_TYPE_ITEMS: readonly TransactionTypeItem[] = [
  { title: '開狀會計分錄', value: 'lcOpen' },
  { title: '修改信用狀會計分錄', value: 'lcAmend' },
  { title: '退國內信用狀保證金會計分錄', value: 'depositRefund' },
  { title: '註銷未用餘額會計分錄', value: 'cancelBalance' },
] as const

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '已到期', value: 'issued' },
  { title: '未到期', value: 'rejected' },
] as const

export const LC_TYPE_ITEMS: readonly LcTypeItem[] = [
  { title: '即期', value: 'sight' },
  { title: '遠期', value: 'usance' },
] as const

export const BENEFICIARY_ITEMS: readonly IssuingBankItem[] = [
  { title: '30414175 中國鋼鐵股份有限公司', value: '30414175' },
  { title: '07838854 中鴻鋼鐵股份有限公司', value: '07838854' },
  { title: '96971313 中鋼鋁業股份有限公司', value: '96971313' },
  { title: '75460005 唐榮鐵工廠股份有限公司', value: '75460005' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  senNo: string // 序號
  lcNo: string // 信用狀號碼
  appDate: string // 開狀日期
  lcAmount: number // 信用狀金額
  lcBalanceAmount: number // 信用狀餘額
  draftNo: string // 匯票號碼
  issuingAmount: number // 押匯金額
  beneficiary: string // 受益人
  expiryDate: string // 有效期限
  status: boolean | null // 狀態
}

export type { ListItem }

export interface ListSummary {
  total: number
  amount: number
}

export interface ListResponse {
  items: ListItem[]
  summary: ListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface ListSearchParams {
  page?: number
  pageSize?: number
}
