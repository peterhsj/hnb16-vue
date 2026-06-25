// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface QueryFormPayload {
  issueDateStart: string  // 開狀起始日期
  issueDateEnd: string    // 開狀結束日期
  draftDateStart: string  // 押匯起始日期
  draftDateEnd: string    // 押匯結束日期
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    issueDateStart: '',   // 開狀起始日期
    issueDateEnd: '',     // 開狀結束日期
    draftDateStart: '',   // 押匯起始日期
    draftDateEnd: '',     // 押匯結束日期
  }
}

// 保留供向下相容（如有其他檔案引用）
export interface IssuingBankItem {
  readonly title: string
  readonly value: string
}

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
  branchCode: string // 分行代號
  branchName: string // 分行名稱
  cdsidCount: number // CDSID 開狀筆數
  cdsidAmount: number // CDSID 開狀金額
  counterCount: number // 臨櫃開狀筆數
  counterAmount: number // 臨櫃開狀金額
  onlineCount: number // 網銀開狀筆數
  onlineAmount: number // 網銀開狀金額
  discountCount: number // 押匯筆數
  discountAmount: number // 押匯金額
}

export type { ListItem }

export interface ListSummary {
  total: number
  amount?: number
}

export interface ListResponse {
  items: ListItem[]
  summary: ListSummary
}

export interface ListSearchParams {}
