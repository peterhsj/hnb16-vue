// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface QueryFormPayload {
  transactionYear: string | null // 交易年份
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    transactionYear: null, // 交易年份
  }
}

// 保留供向下相容（如有其他檔案引用）
export interface YearItem {
  readonly title: string
  readonly value: string
}

export const YEAR_ITEMS: readonly YearItem[] = [
  { title: '114', value: '114' },
  { title: '113', value: '113' },
  { title: '112', value: '112' },
  { title: '111', value: '111' },
  { title: '110', value: '110' },
  { title: '109', value: '109' },
  { title: '108', value: '108' },
  { title: '107', value: '107' },
] as const

export interface MonthItem {
  readonly title: string
  readonly value: string
}

export const MONTH_ITEMS: readonly MonthItem[] = [
  { title: '01', value: '01' },
  { title: '02', value: '02' },
  { title: '03', value: '03' },
  { title: '04', value: '04' },
  { title: '05', value: '05' },
  { title: '06', value: '06' },
  { title: '07', value: '07' },
  { title: '08', value: '08' },
  { title: '09', value: '09' },
  { title: '10', value: '10' },
  { title: '11', value: '11' },
  { title: '12', value: '12' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
export interface ListItem {
  companyName: string // 公司名稱
  taxId: string // 統一編號
}

export interface ListSummary {
  total: number
  amount?: number
}

export interface ListResponse {
  items: ListItem[]
  summary: ListSummary
}

export interface ListSearchParams {}
