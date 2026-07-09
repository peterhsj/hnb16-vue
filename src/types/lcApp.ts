import type { BranchOption } from '@/api/branchApi'
import type { SelectItem } from '@/types/common'

// 受益人團體類別（對應後端 HNB.Api.Models.Enums.BeneficiaryGroupCategory）
export enum BeneficiaryGroupCategory {
  CDS = 1, // CDS
  FPG = 2, // 台塑
  CHI = 3, // 奇美
  Others = 4, // 其他
}

// 用於 v-select items 的選項
export const beneficiaryCategoryOptions: { title: string, value: BeneficiaryGroupCategory | '' }[] = [
  { title: '= 請選擇 =', value: '' },
  { title: 'CDS 客戶 (中鋼、中鴻、中鋁、華新麗華、東和鋼鐵)', value: BeneficiaryGroupCategory.CDS },
  { title: '台塑 e 化平台客戶 (台塑集團)', value: BeneficiaryGroupCategory.FPG },
  { title: '奇美 e 化平台客戶', value: BeneficiaryGroupCategory.CHI },
  { title: '其他客戶', value: BeneficiaryGroupCategory.Others },
]

export const LC_STATUS_ITEMS: readonly SelectItem[] = [
  { title: '待審核', value: 'pending' },
  { title: '已核准', value: 'approved' },
  { title: '已完成', value: 'completed' },
  { title: '已拒絕', value: 'rejected' },
]

export const LC_TYPE_ITEMS: readonly SelectItem[] = [
  { title: '國內信用狀', value: 'domestic' },
  { title: '擔保信用狀', value: 'standby' },
]

export interface LcCdsFormData {
  openBank: BranchOption
  paymentBank: BranchOption
  notifyBank: BranchOption
  lcType: string
  currency: string
  amount: string
  expireDate: string
  beneName: string
  beneAddrDisplay: string
  beneEmail: string
  benePhone: string
  applicant: string
  applicantInNo: string
  applicantAddr: string
  goodsName: string
  specialClause: string
  selfClause: string
  checkDoc1: boolean
  checkDoc2: boolean
  checkDoc3: boolean
  otherDocs: string
  deliveryAllowed: string
  lastDeliveryDate: string
  otherInstructions: string
}

export interface LcCheckDocument {
  checked: boolean
  text: string
}

export interface LcCreditSummary {
  creditLine: string
  creditBalance: string
  fxCreditLine: string
  fxCreditBalance: string
  collateralCondition: string
  creditExpiry: string
  depositRatio: string
  acceptanceFee: string
  openingFee: string
  loanAccountNo: string
}

export interface LcAppDetailDto {
  // 頁首
  bankName: string
  branchName: string
  date: string

  // 信用狀基本
  lcNo: string
  issueDate: string
  notifyBankNo: string

  // 申請人
  applicantName: string
  contactName: string
  contactPhone: string

  // 通知銀行 / 金額
  notifyBank: string
  currency: string
  amountText: string

  // 受益人
  beneficiaryName: string
  beneficiaryTaxId: string
  beneficiaryRepresentative: string
  beneficiaryTitle: string
  beneficiaryAddress: string
  beneficiaryPhone: string
  beneficiaryDept: string
  beneficiaryCustomerNo: string
  beneficiaryEmail: string
  expiry: string

  // 匯票條件
  payerBank: string
  paymentTerm: string

  // 應檢附單據
  documents: LcCheckDocument[]
  goodsDescription: string

  // 特別指示
  specialInstructionTitle: string
  specialInstructions: string[]

  // 利率 / 手續費條款
  rateTerm: string
  calculationMethod: string
  feeTerm: string

  // 申請人印鑑
  applicantStampLabel: string
  qrText: string
  qrImageUrl: string

  // 授信資料
  creditSummary: LcCreditSummary
}

export interface LcDetailVersion {
  versionNo: number
  isCurrent: boolean
}

export interface LcDetailDto {
  // 頁首
  lcType: string // 即期 / 遠期
  bankName: string
  branchName: string
  address: string
  date: string // ROC 格式，如 中華民國 114 年 5 月 10 日

  // 信用狀基本
  lcNo: string
  notifyBankNo: string
  applicantName: string
  notifyBank: string
  currency: string // 新台幣 / USD …
  amountText: string // 伍仟萬元整
  expiry: string // 民國114年6月10日

  // 受益人
  beneficiaryName: string
  beneficiaryRepresentative: string
  beneficiaryTitle: string
  beneficiaryAddress: string

  // 匯票條件
  paymentTerm: string // 見票即付。 / 遠期 N 天 …
  payerBank: string

  // 應檢附單據
  documents: LcCheckDocument[]
  goodsDescription: string

  // 特別指示（純文字，後端回傳換行符號）
  specialInstructions: string

  // 版本清單
  versions: LcDetailVersion[]

  // 修改通知書號碼清單
  amendNoticeNos: string[]
}

export interface AmendAppDetailAmendItem {
  label: string
  original: string
  amended: string
}

export interface AmendAppDetailDto {
  // 修改基本資訊
  amendSeq: number // 第幾次修改
  amendDate: string // 修改日期（ROC 格式，如 民國 114 年 3 月 25 日）
  lcNo: string
  amount: string // 原金額文字
  notifyBank: string
  notifyBankNo: string

  // 受益人
  beneficiaryName: string
  beneficiaryAddress: string
  expiry: string // 有效期限至（ROC 格式）
  email: string

  // 申請修改事項（逐列原規定 vs 修改）
  amendItems: AmendAppDetailAmendItem[]

  // 申請人
  applicantName: string
  applicantAddress: string
  applicantPhone: string
  applicantDate: string // ROC 格式

  // 印鑑 / QR
  stampImageUrl?: string
}

export interface AmendNoticeAmendItem {
  label: string
  original: string
  amended: string
}

export interface CreditComparVersionItem {
  label: string
  before: string
  after: string
}

export interface CreditComparDto {
  beforeVersion: number // 調整前版本號
  afterVersion: number // 調整後版本號
  items: CreditComparVersionItem[]
}

export interface CreditCheckTransfer {
  account1: string
  checkNo1: string
  amount1: number | null
  account2: string
  checkNo2: string
  amount2: number | null
}

export interface CreditSavingsTransfer {
  account: string
  withdrawal1: number | null
  withdrawal2: number | null
}

export interface CreditTransferOut {
  accountingSubject: string
  writeOffSeq: string
  amount: number | null
  summary: string
}

export interface CreditPaymentInfo {
  hasAuth: boolean // 有授權扣帳 / 無授權扣帳
  cash: number | null
  checkTransfer: CreditCheckTransfer
  savingsTransfer: CreditSavingsTransfer
  transferOut: CreditTransferOut
  totalCollected: number | null
}

export interface CreditRiskCondition {
  category1: string
  ratio1: number | null
  category2: string
  ratio2: number | null
  category3: string
  ratio3: number | null
  category4: string
  ratio4: number | null
}

export interface CreditVersionItem {
  versionNo: number
}

export interface CreditDto {
  // 定價指標
  pricingType: 1 | 2 | 3 | 4 // 1=基準利率加碼 2=固定利率 3=貨幣市場 4=其他
  // 定價指標 type 1
  markupRate: number | null
  totalRate: number | null
  adjustMonths: number | null
  // 定價指標 type 2
  fixedRate: number | null
  // 定價指標 type 3
  moneyMarketPeriod: string
  moneyMarketMarkup: string
  moneyMarketRate: number | null
  moneyMarketTotalRate: number | null
  moneyMarketAdjustMonths: number | null

  loanAccountNo: string
  lcAmount: number | null
  issueLoanNo: string
  acceptanceLoanNo: string
  lcCreditLimit: number | null
  creditLimitExpiry: string
  lcBalance: number | null
  loanManagerId: string
  reviewSupervisorIdA: string
  reviewSupervisorIdB: string
  issueFee: number | null
  issueStampTax: boolean
  acceptanceFee: number | null
  acceptanceStampTax: boolean
  depositRatio: number | null
  depositAmount: number | null
  batchCaseNo: string
  creditGuaranteeNoticeNo: string

  paymentInfo: CreditPaymentInfo
  collateralCondition: string
  loanCaseNo: string
  riskCondition: CreditRiskCondition
  amlCompleted: boolean

  currentVersion: number
  versions: CreditVersionItem[]
}

export interface AmendNoticeDto {
  // 修改基本資訊
  amendSeq: number // 第幾次修改
  amendDate: string // 修改日期（ROC 格式，如 民國 114 年 3 月 25 日）
  bankName: string // e.g. 網際商業銀行 南門分行
  lcNo: string
  amount: string // 金額文字
  notifyBank: string
  notifyBankNo: string

  // 受益人 / 申請人
  beneficiaryName: string
  expiry: string // 有效期限至
  beneficiaryAddress: string
  applicantName: string // 信用狀申請人

  // 修改事項 (原規定情形 vs 修改情形)
  amendItems: AmendNoticeAmendItem[]

  // 相關信用狀號碼（可點擊查看 LC 明細）
  relatedLcNos: string[]
}
