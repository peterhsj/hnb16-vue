// ── amendLcApp (開狀沖正 EC) ──────────────────────────────────────────────
export type LcTypeOption = 'sight' | 'usance'

export interface AmendLcItem {
  seqNo: number
  amendNoticeNo: string | null
  lcNo: string
  lcType: LcTypeOption
  applicant: string
  notifyBank: string
  applicationDate: string
  issueDate: string
  totalAmount: number
  beneficiary: string
  isAccepted?: boolean
}

export interface AmendLcListPayload {
  page: number
  itemsPerPage: number
}

export interface AmendLcAppListResponse {
  data: AmendLcItem[]
  total: number
  amount: number
}
