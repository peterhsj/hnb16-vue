import type { LcTypeOption } from '@/types/common'

// ── currentCancelApp (註銷信用狀沖正 EC) ──────────────────────────────────

export interface ListItem {
  seqNo: number
  cancelAppNo: string | null
  lcNo: string
  lcType: LcTypeOption
  issueDate: string
  applicant: string
  notifyBank: string
  beneficiary: string
  expiryDate: string
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
