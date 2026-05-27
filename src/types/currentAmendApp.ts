// ── currentAmendApp (修狀沖正 EC) ─────────────────────────────────────────
export type LcTypeOption = 'sight' | 'usance'

export interface AmendLcItem {
  seqNo: number
  amendNoticeNo: string | null
  lcNo: string
  lcType: LcTypeOption
  issueDate: string
  applicant: string
  notifyBank: string
  beneficiary: string
  totalAmount: number
}

export interface CurrentAmendListPayload {
  page: number
  itemsPerPage: number
}

export interface CurrentAmendListResponse {
  data: AmendLcItem[]
  total: number
  amount: number
}
