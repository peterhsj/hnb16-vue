// ── 表單資料 ──────────────────────────────────────────────────────────────────
export interface FormPayload {
  hasPromissoryNote: boolean // 是否檢附本票
  accountNo: string // 本票帳號
  stampFile: File | null // 本票印鑑檔案
}

export function createInitialForm (): FormPayload {
  return {
    hasPromissoryNote: false,
    accountNo: '',
    stampFile: null,
  }
}

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  senNo: string // 序號
  companyName: string // 公司名稱
  taxId: string // 統一編號
  hasPromissoryNote: boolean // 檢附本票
  promissoryNoteAccount: string // 本票帳號
  promissoryNoteSeal: string // 本票印鑑
}

export type { ListItem }

export interface ListSummary {
  total: number
  amount: number
}

export interface ListResponse {
  items: ListItem[]
  summary: ListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface ListSearchParams {
  page?: number
  pageSize?: number
}
