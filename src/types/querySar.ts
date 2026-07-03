// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface IssuingBankItem {
  readonly title: string
  readonly value: string
}

export interface QueryFormPayload {
  issueDateStart: string // 申請日期起（格式 YYYY/MM/DD）
  issueDateEnd: string // 申請日期迄（格式 YYYY/MM/DD）
  operationType: string | null // 作業類型
  transactionSeqNo: string // 交易序號
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    issueDateStart: '', // 申請日期起（格式 YYYY/MM/DD）
    issueDateEnd: '', // 申請日期迄（格式 YYYY/MM/DD）
    operationType: null, // 作業類型
    transactionSeqNo: '', // 交易序號
  }
}

export const OPERATION_ITEMS: readonly IssuingBankItem[] = [
  { title: '開狀審核', value: '開狀審核' },
  { title: '修狀審核', value: '修狀審核' },
  { title: '押匯審核', value: '押匯審核' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
export interface ListItem {
  transactionDate: string // 交易日期
  transactionSeqNo: string // 交易序號
  operationType: string // 作業類型
  approvalTime: string // 核准時間
  errorCode: string // 異常代碼
  errorMessage: string // 異常訊息
}

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
