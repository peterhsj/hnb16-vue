export interface FormPayload {
  userName: string // 用戶名稱
  userPassword: string // 用戶密碼
  email: string // 電子信箱
  phone: string // 聯絡電話
  userAccount: string // 用戶帳號
  branchCode: string[] // 分行代碼
  userRole: string // 用戶角色
  userRole2: string // 用戶角色2
}

export function createInitialQueryForm (): FormPayload {
  return {
    userName: '',
    userRole: '',
    userRole2: '',
    userPassword: '',
    userAccount: '',
    branchCode: [],
    email: '',
    phone: '',
  }
}

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  userAccount: string // 用戶帳號
  branchName: string // 分行名稱
  branchCode: string // 分行代碼
  userRole: string // 用戶角色
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
