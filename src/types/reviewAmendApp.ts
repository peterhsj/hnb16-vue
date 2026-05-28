// ── reviewAmendApp (修改申請書待審核) ──────────────────────────────────────────

export interface ListItem {
  seqNo: number // 編號
  amendAppNo: string | null // 修改申請書號碼
  issueDate: string // 申請日期
  applicant: string // * 申請人
  amount: number // * 原金額
  notifyBank: string // * 通知銀行
  beneficiary: string // 受益人
  expiryDate: string // * 有效期限
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
