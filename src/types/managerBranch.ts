export interface FormPayload {
  branchId: string // 分行 ID
  branchName: string // 分行名稱
  branchCode: string // 分行代碼
  address: string // 地址
  phone: string // 電話
  contactPerson: string // 聯絡人
}

export function createInitialQueryForm (): FormPayload {
  return {
    branchId: '',
    branchName: '',
    branchCode: '008',
    address: '',
    phone: '',
    contactPerson: '',
  }
}

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  branchId: string // 分行 ID
  branchName: string // 分行名稱
  branchCode: string // 分行代碼
  address: string // 地址
  phone: string // 電話
  contactPerson: string // 聯絡人
}

export type { ListItem }

export interface ListSummary {
  total: number
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

// ── 押匯申請書 Props ──────────────────────────────────────────────────────────
export interface LcData {
  appNo: string
}

// ── 押匯申請書表單 Payload ────────────────────────────────────────────────────
export interface LcPayload {
  negotiationAmount: string // 押匯/承兌金額
  draftIssueDate: string // 匯票發票日
}

export function createInitialLcForm (): LcPayload {
  return {
    negotiationAmount: '',
    draftIssueDate: '',
  }
}
