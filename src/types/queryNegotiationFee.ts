// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface QueryFormPayload {
  draftDateStart: string  // 押匯起始日期
  draftDateEnd: string    // 押匯結束日期
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
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
export interface ListItem {
  issueDate: string // 押匯/承兌日期
  issuingBank: string // 開狀行
  applicant: string // 申請人
  draftBank: string // 押匯行
  beneficiary: string // 受益人
  lcNumber: string // 信用狀號碼
  draftAmount: number // 押匯金額
  accountNumber: string // 入帳帳號
  draftFee: number // 押匯手續費
  draftFeeDiscountReason: string // 押匯手續費優惠原因
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
