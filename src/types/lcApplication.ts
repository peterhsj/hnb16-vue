/** 開狀申請書 Payload */

// ── 共用 ──────────────────────────────────────────────────────────────────
export type LcTypeOption = 'sight' | 'usance'

// ── CDS ───────────────────────────────────────────────────────────────────
export type LcElectronicNoteOption = 'csc' | 'custom'
export type LcCdsDeliverKind = 'payment' | 'acceptance'

// ── FPC ───────────────────────────────────────────────────────────────────
export type LcPaymentKind = 'sight' | 'fixed'
export type LcFixedExpiryBasis = 'draft_invoice' | 'unified_invoice' | 'named'
export type LcInvoiceDocKind = 'invoice' | 'unified'

// ── Other ─────────────────────────────────────────────────────────────────
export type LcPaymentMain = 'sight' | 'fixed'
export type LcPaymentExpBasis = 'draft' | 'invoice' | 'other'
export type LcDraftFormat = 'bank' | 'beneficiary'
export type LcInvoiceKind = 'invoice' | 'unified'
export type LcPartialShipment = '' | 'allowed' | 'not_allowed'
export type LcDiscountInterest = 'buyer' | 'seller'
export type LcFeeBearer = 'buyer' | 'seller'
export type LcStampSingle = 'allowed' | 'not_allowed'

export interface LcApplicationPayload {
  // ── 共用 ────────────────────────────────────────────────────────────────
  noticeBank: string | null
  payingBank: string | null
  lcType: LcTypeOption | null
  currency: string
  amount: string
  expiryDate: string
  applicantName: string
  applicantTaxId: string
  applicantAddress: string
  contactName: string
  contactPhone: string
  beneCorp: string | null
  benePhone: string
  beneEmail: string
  department: string | null
  customerNo: string
  lastDeliveryDate: string
  otherSpecialTerms: string
  partialShipment: LcPartialShipment

  // ── CDS ─────────────────────────────────────────────────────────────────
  goodsDescription: string
  electronicNote: LcElectronicNoteOption | null
  customElectronicNote: string
  cdsDeliverKind: LcCdsDeliverKind | null
  deliverInvoice: boolean
  deliverOther: boolean
  deliverOtherDetail: string
  cdsUsanceInterest: LcFeeBearer | null
  cdsAcceptanceFee: LcFeeBearer | null

  // ── FPC ─────────────────────────────────────────────────────────────────
  paymentKind: LcPaymentKind | null
  fixedExpiryBasis: LcFixedExpiryBasis | null
  fixedDaysWithin: string
  namedDueDate: string
  invoiceDocKind: LcInvoiceDocKind | null
  otherDocumentsNote: string
  productDescriptionNote: string
  usanceInterestBuyer: boolean
  draftStartDate: string
  invoiceStartDate: string
  rateBaseChecked: boolean
  rateBaseSpread: string
  rateFixedChecked: boolean
  rateFixedPercent: string

  // ── Other ────────────────────────────────────────────────────────────────
  managerName: string
  managerTitle: string
  beneAddress: string
  paymentMain: LcPaymentMain | null
  paymentExpBasis: LcPaymentExpBasis | null
  paymentExpOtherText: string
  payDaysAfter: string
  invoiceKind: LcInvoiceKind | null
  otherDocumentsDetail: string
  productPurchaseNote: string
  draftFormat: LcDraftFormat | null
  discountInterest: LcDiscountInterest | null
  draftLimitStartDate: string
  feeBearer: LcFeeBearer | null
  stampSingleParty: LcStampSingle | null
  ratePaymentDayOfMonth: string
}

export function createInitialLcApplicationForm (): LcApplicationPayload {
  return {
    // ── 共用 ──────────────────────────────────────────────────────────────
    noticeBank: null, // 通知銀行
    payingBank: null, // 付款人銀行
    lcType: null, // 信用狀類型
    currency: 'TWD', // 幣別
    amount: '', // 金額
    expiryDate: '', // 到期日
    applicantName: '', // 申請人名稱
    applicantTaxId: '', // 申請人稅號
    applicantAddress: '', // 申請人地址
    contactName: '', // 聯絡人姓名
    contactPhone: '', // 聯絡人電話
    beneCorp: null, // 受益人公司
    benePhone: '', // 受益人電話
    beneEmail: '', // 受益人電子郵件
    department: null, // 部門
    customerNo: '', // 客戶編號
    lastDeliveryDate: '', // 最後交貨日期
    otherSpecialTerms: '', // 其他特別條款
    partialShipment: 'allowed', // 部分裝運

    // ── CDS ───────────────────────────────────────────────────────────────
    goodsDescription: '', // 貨物描述
    electronicNote: null, // 電子票據
    customElectronicNote: DEFAULT_CUSTOM_ELECTRONIC_NOTE, // 自訂電子票據
    cdsDeliverKind: null, // 匯票申請書種類（付款/承兌）
    deliverInvoice: false, // 提供發票
    deliverOther: false, // 提供其他文件
    deliverOtherDetail: '', // 其他文件細節
    cdsUsanceInterest: 'buyer', // 遠期信用狀利息負擔（預設買方）
    cdsAcceptanceFee: 'buyer', // 承兌手續費負擔（預設買方）

    // ── FPC ───────────────────────────────────────────────────────────────
    paymentKind: null, // 付款種類
    fixedExpiryBasis: null, // 固定到期基準
    fixedDaysWithin: '', // 固定天數範圍
    namedDueDate: '', // 指定到期日
    invoiceDocKind: null, // 發票文件種類
    otherDocumentsNote: '', // 其他文件備註
    productDescriptionNote: '', // 產品描述備註
    usanceInterestBuyer: false, // 遠期利息由買方承擔
    draftStartDate: '', // 匯票起始日期
    invoiceStartDate: '', // 發票起始日期
    rateBaseChecked: false, // 利率基準是否勾選
    rateBaseSpread: '', // 利率基準差額
    rateFixedChecked: false, // 固定利率是否勾選
    rateFixedPercent: '', // 固定利率百分比

    // ── Other ─────────────────────────────────────────────────────────────
    managerName: '', // 經理姓名
    managerTitle: '', // 經理職稱
    beneAddress: '', // 受益人地址
    paymentMain: null, // 主要付款方式
    paymentExpBasis: null, // 付款到期基準
    paymentExpOtherText: '', // 付款到期其他文字
    payDaysAfter: '', // 付款後天數
    invoiceKind: null, // 發票種類
    otherDocumentsDetail: '', // 其他文件細節
    productPurchaseNote: '', // 產品購買備註
    draftFormat: null, // 匯票格式
    discountInterest: null, // 貼現利息
    draftLimitStartDate: '', // 匯票限制起始日期
    feeBearer: null, // 手續費承擔方
    stampSingleParty: null, // 單方蓋章
    ratePaymentDayOfMonth: '', // 每月付款日
  }
}

// ── 開狀申請書 Props（列表用）──────────────────────────────────────────────
export interface LcAppData {
  editType: string
  appNo: string
  beneType: string
}

export interface SelectItem {
  readonly title: string
  readonly value: string
}

export interface FpcBeneOption extends SelectItem {
  readonly taxId: string
  readonly corpName: string
  readonly managerName: string
  readonly managerTitle: string
  readonly address: string
}

export interface NoticeBankItem {
  readonly title: string
  readonly value: string
}

export const NOTICE_BANK_ITEMS: readonly NoticeBankItem[] = [
  { title: '華南銀行彰化分行', value: 'changhua' },
  { title: '華南銀行桃園分行', value: 'taoyuan' },
  { title: '華南銀行南港分行', value: 'nangang' },
  { title: '華南銀行台北分行', value: 'taipei' },
] as const

export const PAYING_BANK_ITEMS: readonly NoticeBankItem[] = [
  { title: '華南銀行 高雄分行', value: 'kaohsiung' },
  { title: '華南銀行 台北分行', value: 'taipei' },
  { title: '華南銀行 彰化分行', value: 'changhua' },
  { title: '華南銀行 桃園分行', value: 'taoyuan' },
  { title: '華南銀行 南港分行', value: 'nangang' },
] as const

export const DEFAULT_CUSTOM_ELECTRONIC_NOTE = `1.賣方所提供鋼品之一部或全部，可能產自中國鋼鐵股份有限公司或中龍鋼鐵股份有限公司(下稱中龍公司)，視實際出貨狀況而定。如產自中龍公司，賣方就其鋼品品質，負賣方責任，至如約定價格，各交易條件及優惠措施均不受影響。
2.匯票及匯票付款申請書使用中鋼格式，由受益人單獨簽章或使用數位憑證有效。
3.貨物可以分批交貨。
4.貨物明細以發票為準。
5.發票金額大於匯票金額及發票內容備註「受託代銷」字樣可以接受。
6.本信用狀適用 eUCP2.0 版。
7.允許受益人以匯票、匯票付款申請書及發票電子檔(包含電子發票證明聯等)方式押匯，另「受益人完整提示通知」得附加於匯票付款申請書之最後。
8.押匯電子文件透過網址：HTTPS://CDSLC.UXCDS.COM/CDSLC/ 提示。`

export const CURRENCY_OPTIONS = [{ title: '新台幣', value: 'TWD' }] as const

export const FPC_BENE_ITEMS: readonly FpcBeneOption[] = [
  {
    title: '75708007 台灣塑膠工業股份有限公司',
    value: '75708007',
    taxId: '75708007',
    corpName: '台灣塑膠工業股份有限公司',
    managerName: '洪OO',
    managerTitle: '董事長',
    address: '彰化縣彰O市中O里OO路3段OO號',
  },
  {
    title: '20201258 泰西股份有限公司',
    value: '20201258',
    taxId: '20201258',
    corpName: '泰西股份有限公司',
    managerName: '',
    managerTitle: '',
    address: '',
  },
] as const

export const CDS_BENE_ITEMS: readonly FpcBeneOption[] = [
  {
    title: '75708008 中國鋼鐵股份有限公司',
    value: '75708008',
    taxId: '75708008',
    corpName: '中國鋼鐵股份有限公司',
    managerName: '',
    managerTitle: '',
    address: '高雄市小港區中鋼路1段OO號',
  },
] as const

export const FPC_DEPT_ITEMS: readonly SelectItem[] = [
  { title: 'W工務部', value: 'W' },
] as const
