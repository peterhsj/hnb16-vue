// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface QueryFormPayload {
  transactionType: string | null // 交易類型
  transactionDateStart: string // 交易起始日期
  transactionDateEnd: string // 交易結束日期
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    transactionType: null, // 交易類型
    transactionDateStart: '', // 交易起始日期
    transactionDateEnd: '', // 交易結束日期
  }
}

// 保留供向下相容（如有其他檔案引用）
export interface TransactionTypeItem {
  readonly title: string
  readonly value: string
}

export const TRANSACTION_TYPE_ITEMS: readonly TransactionTypeItem[] = [
  { title: '全部', value: '全部' },
  { title: '押匯申請', value: '押匯申請' },
  { title: '開狀回應', value: '開狀回應' },
  { title: '修狀回應', value: '修狀回應' },
  { title: '刪狀回應', value: '刪狀回應' },
  { title: '匯主資料回應', value: '匯主資料回應' },
  { title: '押匯發票回應', value: '押匯發票回應' },
  { title: '押匯明細回應', value: '押匯明細回應' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  appNo: string // 申請書號碼
  lcNo: string // 信用狀號碼
  lcSource: string // 資料流向
  transactionType: string // 交易類別
  sendStatus: string // 傳送狀態
  resendCount: number // 重送次數
  sendTime: string // 傳送時間
  sendBranchCode: string // 傳送分行代碼
  confirmStatus: boolean // 確認狀態
  createTime: string // 建立時間
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
