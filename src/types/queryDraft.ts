// ── 查詢表單 ──────────────────────────────────────────────────────────────────
export type QueryMode = 'draft' | 'lcNo' | 'criteria' | ''

export type LcStatusOption = 'pending' | 'released' | 'rejected' | 'processing'

export type LcStatusLabel = '待審核' | '已放行' | '已拒絕' | '處理中'

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
  beneficiaryTaxId: string // 受益人統編
  issuingBank: string // 開狀銀行
  lcStatus: LcStatusOption[] // 押匯狀態（可複選）
  lcType: LcTypeOption | '' // 信用狀別
  issueDateStart: string
  issueDateEnd: string
}

export function createInitialQueryForm (): QueryFormPayload {
  return {
    queryMode: '', // 查詢模式：draft 今日匯票、lcNo 依信用狀號碼、criteria 依條件
    lcNo: '', // 信用狀號碼
    beneficiaryTaxId: '', // 受益人統編
    issuingBank: '', // 開狀銀行
    lcStatus: [], // 押匯狀態（可複選）
    lcType: '', // 信用狀別
    issueDateStart: '', // 押匯日期起（格式 YYYY/MM/DD）
    issueDateEnd: '', // 押匯日期迄（格式 YYYY/MM/DD）
  }
}

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '待審核', value: 'pending' },
  { title: '已放行', value: 'released' },
  { title: '已拒絕', value: 'rejected' },
  { title: '處理中', value: 'processing' },
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
  seqNo: number
  draftNo: string // 匯票號碼
  applicant: string // 申請人
  lcNo: string // 信用狀號碼
  availableBalance: number // 信用狀餘額
  validDate: string // 有效期限
  lcComparisonResult: string // 信用狀比對結果
  draftIssueDate: string // 押匯申請日期
  draftReleaseDate: string // 押匯放行日期
  issuingAmount: number // 押匯金額
  beneficiary: string // 受益人
  status: string // 狀態
  pendingApprover: string // 尚待核准人員
  // 押匯行單據
  documentDelivery: boolean // 單據遞送單
  remittanceAttachment: boolean // 匯款交易附件(含轉帳收入傳票)
  cashPaySlip: boolean // 現金繳費單
  draftFeeReceipt: boolean // 押匯手續費收據
  acceptanceFeeReceipt: boolean // 承兌手續費收據
  transferVoucher: boolean // 轉帳支出傳票
  // 開狀行單據
  supplementaryLcFeeReceipt: boolean // 補收開狀手續費收據
  supplementaryCashPaySlip: boolean // 補收現金繳費單
  supplementaryTransferVoucher: boolean // 補收轉帳支出傳票
}

export type { ListItem }

export interface LcListSummary {
  total: number
  amount: number
  positiveItems: number // 可用餘額 > 0 筆數
  positiveAmount: number // 可用餘額 > 0 總金額
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
  negotiationAmount: string // 押匯/承兌金額
  draftIssueDate: string // 匯票發票日
}

export function createInitialLcForm (): LcPayload {
  return {
    negotiationAmount: '',
    draftIssueDate: '',
  }
}
