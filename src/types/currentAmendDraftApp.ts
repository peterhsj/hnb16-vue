// ── currentAmendDraftApp (押匯沖正 EC) ────────────────────────────────────
export interface ListItem {
  seqNo: number
  draftNo: string | null
  applicant: string
  applicantTaxId: string
  lcNo: string
  lcAmount: number
  expiryDate: string
  issuingDate: string
  issuingAmount: number
  beneficiary: string
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
