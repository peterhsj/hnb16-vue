import type { LcTypeOption } from '@/types/common'

// ── amendLcApp (開狀沖正 EC) ──────────────────────────────────────────────

export interface ListItem {
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

export interface ListPayload {
  page: number
  itemsPerPage: number
}

export interface ListResponse {
  data: ListItem[]
  total: number
  amount: number
}
