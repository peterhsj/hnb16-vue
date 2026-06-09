import type { LcTypeOption } from '@/types/common'

// ── currentAmendApp (修狀沖正 EC) ─────────────────────────────────────────
export interface ListItem {
  seqNo: number
  amendAppNo: string | null
  amendNoticeNo: string | null
  lcNo: string
  lcType: LcTypeOption
  issueDate: string
  applicant: string
  notifyBank: string
  beneficiary: string
  totalAmount: number
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
