// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface IssuingBankItem {
  readonly title: string
  readonly value: string
}

export interface QueryFormPayload {
  issuingBank: string   // 開狀銀行
  issueDateStart: string // 申請日期起（格式 YYYY/MM/DD）
  issueDateEnd: string   // 申請日期迄（格式 YYYY/MM/DD）
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    issuingBank: '',     // 開狀銀行
    issueDateStart: '',  // 申請日期起（格式 YYYY/MM/DD）
    issueDateEnd: '',    // 申請日期迄（格式 YYYY/MM/DD）
  }
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
  seqNo: number
  beneficiaryTaxId: string    // 受益人統編
  beneficiaryName: string     // 受益人名稱
  draftDate: string           // 押匯日期
  draftNo: string             // 匯票號碼
  draftAmount: number         // 押匯金額
  lcNo: string                // 信用狀號碼
  lcBalance: number           // 信用狀餘額
  approvalTime: string        // 核准時間
  authorizationReason: string // 授權原因
  approverAccount: string     // 授權主管帳號
  approverName: string        // 授權主管姓名
  approverReview: string      // 授權主管覆核
  remark: string              // 備註
  issuingBank: string         // 開狀銀行（查詢用）
}

export type { ListItem }

export interface LcListSummary {
  total: number
  amount: number
}

export interface LcListResponse {
  items: ListItem[]
  summary: LcListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface LcListSearchParams {
  page?: number
  pageSize?: number
}
