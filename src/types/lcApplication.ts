/** 統一開狀申請書 Payload（合併 CDS / FPC / 一般） */

// ── 共用 ──────────────────────────────────────────────────────────────────
export type LcTypeOption = 'sight' | 'usance'

// ── CDS ───────────────────────────────────────────────────────────────────
export type LcElectronicNoteOption = 'csc' | 'custom'

// ── FPC ───────────────────────────────────────────────────────────────────
export type LcPaymentKind = 'sight' | 'fixed'
export type LcFixedExpiryBasis = 'draft_invoice' | 'unified_invoice'
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
  deliverPaymentRequest: boolean
  deliverAcceptanceRequest: boolean
  deliverInvoice: boolean
  deliverOther: boolean
  deliverOtherDetail: string

  // ── FPC ─────────────────────────────────────────────────────────────────
  paymentKind: LcPaymentKind | null
  fixedExpiryBasis: LcFixedExpiryBasis | null
  fixedDaysWithin: string
  useNamedDueDate: boolean
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
    noticeBank: null,
    lcType: null,
    currency: 'TWD',
    amount: '',
    expiryDate: '',
    applicantName: '',
    applicantTaxId: '',
    applicantAddress: '',
    contactName: '',
    contactPhone: '',
    beneCorp: null,
    benePhone: '',
    beneEmail: '',
    department: null,
    customerNo: '',
    lastDeliveryDate: '',
    otherSpecialTerms: '',
    partialShipment: 'allowed',

    // ── CDS ───────────────────────────────────────────────────────────────
    goodsDescription: '',
    electronicNote: null,
    customElectronicNote: DEFAULT_CUSTOM_ELECTRONIC_NOTE,
    deliverPaymentRequest: false,
    deliverAcceptanceRequest: false,
    deliverInvoice: false,
    deliverOther: false,
    deliverOtherDetail: '',

    // ── FPC ───────────────────────────────────────────────────────────────
    paymentKind: null,
    fixedExpiryBasis: null,
    fixedDaysWithin: '',
    useNamedDueDate: false,
    namedDueDate: '',
    invoiceDocKind: null,
    otherDocumentsNote: '',
    productDescriptionNote: '',
    usanceInterestBuyer: false,
    draftStartDate: '',
    invoiceStartDate: '',
    rateBaseChecked: false,
    rateBaseSpread: '',
    rateFixedChecked: false,
    rateFixedPercent: '',

    // ── Other ─────────────────────────────────────────────────────────────
    managerName: '',
    managerTitle: '',
    beneAddress: '',
    paymentMain: null,
    paymentExpBasis: null,
    paymentExpOtherText: '',
    payDaysAfter: '',
    invoiceKind: null,
    otherDocumentsDetail: '',
    productPurchaseNote: '',
    draftFormat: null,
    discountInterest: null,
    draftLimitStartDate: '',
    feeBearer: null,
    stampSingleParty: null,
    ratePaymentDayOfMonth: '',
  }
}

// ── 開狀申請書 Props（列表用）──────────────────────────────────────────────
export interface LcAppData {
  type: string
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
    title: '75708007 中國鋼鐵股份有限公司',
    value: '75708007',
    taxId: '75708007',
    corpName: '中國鋼鐵股份有限公司',
    managerName: '',
    managerTitle: '',
    address: '高雄市小港區中鋼路1段OO號',
  },
] as const

export const FPC_DEPT_ITEMS: readonly SelectItem[] = [
  { title: 'W工務部', value: 'W' },
] as const
