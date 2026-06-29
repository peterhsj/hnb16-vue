// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export interface QueryFormPayload {
  importType: string | null // 受益人類型
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    importType: null, // 受益人類型
  }
}
export interface EditFormPayload {
  serNo: number // 編號
  compId: string // 公司統編
  compName: string // 公司名稱
  managerName: string // 負責人姓名
  managerTitle: string // 負責人職稱
  address: string // 登記地址
  phone: string // 連絡電話
  email: string // 電子信箱
  beneficiaryDepartment: string // 受益人事業部
  confirmStatus: boolean // 審核狀態
}

export function createInitialEditForm (): EditFormPayload {
  return {
    serNo: 0,
    compId: '',
    compName: '',
    managerName: '',
    managerTitle: '',
    address: '',
    phone: '',
    email: '',
    beneficiaryDepartment: '',
    confirmStatus: false,
  }
}

// 保留供向下相容（如有其他檔案引用）
export interface TransactionTypeItem {
  readonly title: string
  readonly value: string
}

export const TRANSACTION_TYPE_ITEMS: readonly TransactionTypeItem[] = [
  { title: '全部', value: '全部' },
  { title: '押匯申請', value: '押匯申請' },
  { title: '開狀回應', value: '開狀回應' },
  { title: '修狀回應', value: '修狀回應' },
  { title: '刪狀回應', value: '刪狀回應' },
  { title: '匯主資料回應', value: '匯主資料回應' },
  { title: '押匯發票回應', value: '押匯發票回應' },
  { title: '押匯明細回應', value: '押匯明細回應' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  serNo: number // 編號
  compId: string // 公司統編
  compName: string // 公司名稱
  managerName: string // 負責人姓名
  managerTitle: string // 負責人職稱
  address: string // 登記地址
  phone: string // 連絡電話
  email: string // 電子信箱
  beneficiaryDepartment: string // 受益人事業部
  confirmStatus: boolean // 審核狀態
}

export type { ListItem }

export interface ListSummary {
  total: number
  amount?: number
}

export interface ListResponse {
  items: ListItem[]
  summary: ListSummary
}

export interface ListSearchParams {}
