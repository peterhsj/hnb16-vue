/** 台塑 e 化「填寫開狀申請書」（對應原型 LcApp.html #lcAppList） */

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

export type FpcPaymentKind = 'sight' | 'fixed'

export type FpcFixedExpiryBasis = 'draft_invoice' | 'unified_invoice'

export type FpcInvoiceDocKind = 'invoice' | 'unified'

export interface LcFpcApplicationPayload {
  applicantName: string
  applicantTaxId: string
  contactName: string
  contactPhone: string
  amount: string
  expiryDate: string
  noticeBank: string | null
  beneCorp: string | null
  benePhone: string
  beneEmail: string
  department: string | null
  customerNo: string
  paymentKind: FpcPaymentKind | null
  fixedExpiryBasis: FpcFixedExpiryBasis | null
  fixedDaysWithin: string
  useNamedDueDate: boolean
  namedDueDate: string
  invoiceDocKind: FpcInvoiceDocKind | null
  otherDocumentsNote: string
  productDescriptionNote: string
  lastDeliveryDate: string
  otherSpecialTerms: string
  usanceInterestBuyer: boolean
  draftStartDate: string
  invoiceStartDate: string
  rateBaseChecked: boolean
  rateBaseSpread: string
  rateFixedChecked: boolean
  rateFixedPercent: string
}

export const FPC_NOTICE_BANK_ITEMS: readonly SelectItem[] = [
  { title: '125 彰化分行', value: '125' },
  { title: '221 桃園分行', value: '221' },
  { title: '023 南港分行', value: '023' },
  { title: '001 台北分行', value: '001' },
] as const

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

export const FPC_DEPT_ITEMS: readonly SelectItem[] = [
  { title: 'W工務部', value: 'W' },
] as const

export function createInitialLcFpcForm (): LcFpcApplicationPayload {
  return {
    applicantName: '',
    applicantTaxId: '12345678',
    contactName: '',
    contactPhone: '',
    amount: '',
    expiryDate: '',
    noticeBank: null,
    beneCorp: null,
    benePhone: '',
    beneEmail: '',
    department: null,
    customerNo: '',
    paymentKind: null,
    fixedExpiryBasis: null,
    fixedDaysWithin: '',
    useNamedDueDate: false,
    namedDueDate: '',
    invoiceDocKind: null,
    otherDocumentsNote: '',
    productDescriptionNote: '',
    lastDeliveryDate: '',
    otherSpecialTerms: '',
    usanceInterestBuyer: false,
    draftStartDate: '',
    invoiceStartDate: '',
    rateBaseChecked: false,
    rateBaseSpread: '',
    rateFixedChecked: false,
    rateFixedPercent: '',
  }
}
