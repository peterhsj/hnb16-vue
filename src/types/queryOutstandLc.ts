// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface QueryFormPayload {
  applicantName: string  // 申請人名稱
  applicantTaxId: string // 申請人統編
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    applicantName: '',   // 申請人名稱
    applicantTaxId: '',  // 申請人統編
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
  lcNo: string              // 信用狀號碼
  issueDate: string         // 開狀日期
  expiryDate: string        // 有效日期
  lcAmount: number          // 開狀金額
  lcBalance: number         // 信用狀餘額
  unreturnedDeposit: number // 未退還保證金
}

export type { ListItem }

export interface LcListSummary {
  total: number
  amount: number
}

export interface LcListResponse {
  items: ListItem[]
  summary: LcListSummary
}

export interface LcListSearchParams {}
