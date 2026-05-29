// ── 受益人清冊相關型別定義 ──────────────────────────────────────────
export interface BeneListItem {
  beneficiary: string // 受益人名稱
  beneficiaryId: string // 受益人 ID
  count: number // 筆數
}

export interface BeneListResponse {
  data: BeneListItem[]
  total: number
  amount: number
}

// ── reviewDraftApp (押匯申請待審核) ──────────────────────────────────────────
export interface ListItem {
  seqNo: number // 編號
  draftNo: string | null // 匯票號碼
  applicant: string // 申請人
  lcNo: string // 信用狀號碼
  lastAmount: number // 信用狀餘額
  expiryDate: string // 有效期限
  notifyBank: string // 信用狀比對結果
  issuingDate: string // 押匯日期
  draftAmount: number // 押匯金額
  beneficiary: string // 受益人
  pendingApprover: string // 尚待核准人員
  status: string // 狀態
}

export interface ListPayload {
  page: number
  itemsPerPage: number
}

export interface ListResponse {
  data: ListItem[]
  total: number
  amount: number
}

export type FormPayload = {
  beneficiaryId: string // 受益人 ID
}
