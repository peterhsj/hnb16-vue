// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type QueryMode = 'lcNo' | 'criteria' | 'lcAppNo' | ''

export type LcStatusOption = 'pendingOperator' | 'pendingManager' | 'issued' | 'rejected'

export type LcStatusLabel = '待經辦審核' | '待主管審核' | '已開立' | '已拒絕'

export interface LcStatusItem {
  readonly title: string
  readonly value: LcStatusOption
}

export interface IssuingBankItem {
  readonly title: string
  readonly value: string
}

export type LcTypeOption = 'sight' | 'usance'

export interface LcTypeItem {
  readonly title: string
  readonly value: LcTypeOption
}

export interface QueryFormPayload {
  queryMode: QueryMode
  lcNo: string
  lcAppNo: string
  applicantTaxId: string    // 申請人統編
  beneficiaryTaxId: string  // 受益人統編
  issuingBank: string       // 開狀銀行
  lcStatus: LcStatusOption[]  // 信用狀狀態（可複選）
  lcType: LcTypeOption[]       // 信用狀別（可複選）
  issueDateStart: string
  issueDateEnd: string
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    queryMode: '',           // 查詢模式：lcNo 依信用狀號碼、criteria 依條件
    lcAppNo: '',             // 開狀申請書號碼
    lcNo: '',                // 信用狀號碼
    applicantTaxId: '',      // 申請人統編
    beneficiaryTaxId: '',    // 受益人統編
    issuingBank: '',         // 開狀銀行
    lcStatus: [],            // 信用狀狀態（可複選）
    lcType: [],              // 信用狀別（可複選）
    issueDateStart: '',      // 開狀日期起（格式 YYYY/MM/DD）
    issueDateEnd: '',        // 開狀日期迄（格式 YYYY/MM/DD）
  }
}

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '待經辦審核', value: 'pendingOperator' },
  { title: '待主管審核', value: 'pendingManager' },
  { title: '已開立', value: 'issued' },
  { title: '已拒絕', value: 'rejected' },
] as const

export const LC_TYPE_ITEMS: readonly LcTypeItem[] = [
  { title: '即期', value: 'sight' },
  { title: '遠期', value: 'usance' },
] as const

export const ISSUING_BANK_ITEMS: readonly IssuingBankItem[] = [
  { title: '台北本行', value: '台北本行' },
  { title: '信義分行', value: '信義分行' },
  { title: '松山分行', value: '松山分行' },
  { title: '南京分行', value: '南京分行' },
  { title: '中山分行', value: '中山分行' },
  { title: '板橋分行', value: '板橋分行' },
  { title: '新莊分行', value: '新莊分行' },
  { title: '中和分行', value: '中和分行' },
  { title: '新店分行', value: '新店分行' },
  { title: '桃園分行', value: '桃園分行' },
  { title: '中壢分行', value: '中壢分行' },
  { title: '新竹分行', value: '新竹分行' },
  { title: '台中分行', value: '台中分行' },
  { title: '彰化分行', value: '彰化分行' },
  { title: '嘉義分行', value: '嘉義分行' },
  { title: '台南分行', value: '台南分行' },
  { title: '高雄分行', value: '高雄分行' },
  { title: '鳳山分行', value: '鳳山分行' },
] as const

// ── 清冊資料 ──────────────────────────────────────────────────────────────────
interface ListItem {
  seqNo: number           // 編號
  appNo: string         // 開狀申請書號碼
  lcNo: string            // 信用狀號碼
  lcType: LcTypeOption    // 信用狀別
  applicant: string       // 申請人
  issuingBank: string     // 通知銀行
  applicationDate: string // 申請日期
  issueDate: string       // 開狀日期
  totalAmount: number     // 金額
  beneficiary: string     // 受益人
  status: string          // 狀態
  pendingApprover: string // 待審核人員
  lcFeeReceipt: boolean // 開狀手續費收據
  depositReceipt: boolean // 保證金收款證明
  cashPaySlip: boolean // 現金繳費單
  acceptanceFeeReceipt: boolean // 承兌手續費收據
  transferVoucher: boolean // 轉帳支出傳票
  eBankFeeReceipt: boolean // 電子帳簿開狀手續費收據
}

export type { ListItem }

export interface LcListSummary {
  total: number
  amount: number
}

export interface LcListResponse {
  items: ListItem[]
  summary: LcListSummary
  page: number
  pageSize: number
  totalPages: number
}

export interface LcListSearchParams {
  page?: number
  pageSize?: number
}

// ── 押匯申請書 Props ──────────────────────────────────────────────────────────
export interface LcData {
  appNo: string
}

// ── 押匯申請書表單 Payload ────────────────────────────────────────────────────
export interface LcPayload {
  negotiationAmount: string  // 押匯/承兌金額
  draftIssueDate: string     // 匯票發票日
}

export function createInitialLcForm (): LcPayload {
  return {
    negotiationAmount: '',
    draftIssueDate: '',
  }
}
