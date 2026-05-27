// ── chargeAmendLc (補收開狀手續費沖正 EC) ──────────────────────────────────

export interface ListItem {
  seqNo: number
  lcNo: string
  issueDate: string
  lcAmount: number
  lastAmount: number
  draftNo: string | null
  issuingAmount: number
  chargeAmount: number
  beneficiary: string
  expiryDate: string
  status: string
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
