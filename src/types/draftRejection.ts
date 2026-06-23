// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type QueryMode = 'lcNo' | 'criteria' | ''

export type LcStatusOption = 'active' | 'expired' | 'cancelled'

export type LcStatusLabel = '未到期' | '已到期' | '已註銷'

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

export interface FormPayload {
  code: string // 代碼
  reason: string // 拒絕原因
}

export function createInitialQueryForm (): FormPayload {
  return {
    code: '',
    reason: '',
  }
}

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '未到期', value: 'active' },
  { title: '已到期', value: 'expired' },
  { title: '已註銷', value: 'cancelled' },
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
  code?: string // 代碼
  reason?: string // 拒絕原因
}

export type { ListItem }

export interface ListSummary {
  total: number
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

// ── 押匯申請書 Props ──────────────────────────────────────────────────────────
export interface LcData {
  appNo: string
}

// ── 押匯申請書表單 Payload ────────────────────────────────────────────────────
export interface LcPayload {
  negotiationAmount: string // 押匯/承兌金額
  draftIssueDate: string // 匯票發票日
}

export function createInitialLcForm (): LcPayload {
  return {
    negotiationAmount: '',
    draftIssueDate: '',
  }
}
