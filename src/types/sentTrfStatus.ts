// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type SentTrfStatusQueryMode = 'lcNo' | 'criteria' | ''

export interface QueryFormPayload {
  queryMode: SentTrfStatusQueryMode
  lcNo: string // 信用狀號碼
  beneficiaryTaxId: string // 受益人統編
  draftDateStart: string // 押匯日期起（格式 YYYY/MM/DD）
  draftDateEnd: string // 押匯日期訖（格式 YYYY/MM/DD）
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    queryMode: '', // 查詢模式：lcNo 依信用狀號碼、criteria 依條件
    lcNo: '', // 信用狀號碼
    beneficiaryTaxId: '', // 受益人統編
    draftDateStart: '', // 押匯日期起
    draftDateEnd: '', // 押匯日期訖
  }
}

export interface DraftData {
  draftNo: string
}

// ── 清單項目 ──────────────────────────────────────────────────────────────────
export interface ListItem {
  seqNo: number // 編號
  draftNo: string // 匯票號碼
  beneficiary: string // 受益人
}

export interface ListSummary {
  total: number // 總筆數
  amount: number // 總金額
}

export interface ListResponse {
  items: ListItem[]
  summary: ListSummary
  page: number
  itemsPerPage: number
  totalPages: number
}

export interface ListSearchParams {
  page?: number
  itemsPerPage?: number
  lcNo?: string
  beneficiaryTaxId?: string
  draftDateStart?: string
  draftDateEnd?: string
}
