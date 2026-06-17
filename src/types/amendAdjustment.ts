import type { LcTypeOption } from '@/types/common'

// ── currentAmendApp (修狀沖正 EC) ─────────────────────────────────────────
export interface ListItem {
  seqNo: number
  amendAppNo: string
  amendNoticeNo: string | null
  lcNo: string
  lcType: LcTypeOption
  issueDate: string
  applicant: string
  notifyBank: string
  beneficiary: string
  totalAmount: number
}

export interface FormData {
  pricingBenchmark: string | null // 定價指標
  basisRate: string // 加碼年率
  monthlyAdjust: '01' // 每月調整
  yearlyRate: string // 固定年利率
  currentBenchmark: '01' // 貨幣市場基準
  basisDayRate: string // 天期均價利率
  yard: string // 碼
  rate2: string // 第二利率
  isAuth: boolean // 是否有授權扣帳
  cleanChecked: boolean // 是否已確實洗錢防制檢核
  otherReason: string | null // 其他定價指標原因
  loanAccount: string // 放款戶號
  openLoanApprovalNo: string // 開狀放款核號
  acceptanceLoanApprovalNo: string // 承兌放款核號
  loanManagerId: string // 貸放經理人ID
  reviewManagerIdA: string // 徵審主管 ID-A
  reviewManagerIdB: string // 徵審主管 ID-B
  openingFee: string // 開狀手續費
  isStampTaxDeducted: boolean // 開狀手續費是否扣印花稅
  acceptanceFee: string // 承兌手續費
  isAcceptanceFeeStampTaxDeducted: boolean // 承兌手續費是否扣印花稅
  depositMarginRate: string // 存入保證金比率
  guaranteeDeposit: string // 保證金
  batchNumber: string // 批次案號
  noticeNo: string // 信保通知單編號
  cashAmount: string // 現金金額
  checkAccount1: string // 支票存款帳號 1
  checkNumber1: string // 支票號碼 1
  checkAmount1: string // 金額 1
  checkAccount2: string // 支票存款帳號 2
  checkNumber2: string // 支票號碼 2
  checkAmount2: string // 金額 2
  savingsAccount: string // 活期存款帳號
  amount1: string // 第 1 張取款條金額
  amount2: string // 第 2 張取款條金額
  transferAccount: string // 轉出會計科目
  transferSerialNumber: string // 轉出銷帳序號
  transferAmount: string // 轉出科目金額
  transferSummary: string // 轉出科目摘要
  guaranteeCondition: string | null // 擔保條件
  guaranteeConditionRemark: string // 擔保條件備註說明
  riskCategoryOne: string | null // 風險類別一
  riskCategoryTwo: string | null // 風險類別二
  riskCategoryThree: string | null // 風險類別三
  riskCategoryFour: string | null // 風險類別四
  riskCategoryOnePercentage: string // 風險類別一百分比
  riskCategoryTwoPercentage: string // 風險類別二百分比
  riskCategoryThreePercentage: string // 風險類別三百分比
  riskCategoryFourPercentage: string // 風險類別四百分比
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
