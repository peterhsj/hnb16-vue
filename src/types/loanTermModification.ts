// ── loanTermModification (利率約定改貸沖正 EC) ────────────────────────────

export interface ListItem {
  lcNo: string
  issueDate: string
  draftNo: string | null
  issuingAmount: number
  beneficiary: string
  amendAmount: number
  rateAgreement: string
  source: string
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
