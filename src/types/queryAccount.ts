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
  queryMode: QueryMode
  searchDate: string    // 查詢日期
  issuingBank: string   // 開狀銀行
  transactionType: TransactionTypeOption // 交易分錄類別
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    queryMode: '',       // 查詢模式：accountSummary 科目彙總查詢、journalEntry 交易分錄
    searchDate: '',      // 查詢日期
    issuingBank: '',     // 開狀銀行
    transactionType: '', // 交易分錄類別
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

export const ISSUING_BANK_ITEMS: readonly IssuingBankItem[] = [
  { title: '台北本行', value: '台北本行' },
  { title: '信義分行', value: '信義分行' },
  { title: '松山分行', value: '松山分行' },
  { title: '南京分行', value: '南京分行' },
  { title: '中山分行', value: '中山分行' },
  { title: '板橋分行', value: '板橋分行' },
  { title: '新莊分行', value: '新莊分行' },
  { title: '中和分行', value: '中和分行' },
  { title: '新店分行', value: '新店分行' },
  { title: '桃園分行', value: '桃園分行' },
  { title: '中壢分行', value: '中壢分行' },
  { title: '新竹分行', value: '新竹分行' },
  { title: '台中分行', value: '台中分行' },
  { title: '彰化分行', value: '彰化分行' },
  { title: '嘉義分行', value: '嘉義分行' },
  { title: '台南分行', value: '台南分行' },
  { title: '高雄分行', value: '高雄分行' },
  { title: '鳳山分行', value: '鳳山分行' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  seqNo: number
  lcNo: string        // 信用狀號碼
  subject: string     // 科目
  subAccount: string  // 子目
  debit: number | null  // 借方
  credit: number | null // 貸方
}

export type { ListItem }

export interface LcListSummary {
  total: number
  amount: number
}

export interface LcListResponse {
  items: ListItem[][]  // 依信用狀號碼分組
  summary: LcListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface LcListSearchParams {
  page?: number
  pageSize?: number
}
