// ── 列表項目 ──────────────────────────────────────────────────────────────────
export interface AmendAcceptItem {
  seqNo: number
  isAccepted: boolean | null
  amendNoticeNo: string
  lcNo: string
  lcType: string
  issueDate: string
  applicant: string
  beneficiary: string
  notifyBank: string
}

// ── 分頁選項 ──────────────────────────────────────────────────────────────────
export interface AmendAcceptPageOptions {
  page: number
  itemsPerPage: number
  sortBy: {
    key: string
    order?: 'asc' | 'desc'
  }[]
}
