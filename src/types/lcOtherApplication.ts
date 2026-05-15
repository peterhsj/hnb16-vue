/** 其他客戶「填寫開狀申請書」（對應原型 LcApp.html #lcforOtherAppList） */

export interface SelectItem {
  readonly title: string
  readonly value: string
}

export interface OtherBeneOption extends SelectItem {
  readonly taxId: string
  readonly corpName: string
}

export type OtherPaymentMain = 'sight' | 'fixed'

export type OtherPaymentExpBasis = 'draft' | 'invoice' | 'other'

export type OtherInvoiceKind = 'invoice' | 'unified'

export type OtherDraftFormat = 'bank' | 'beneficiary'

export type OtherPartialShipment = 'allowed' | 'not_allowed'

export type OtherDiscountInterest = 'buyer' | 'seller'

export type OtherFeeBearer = 'buyer' | 'seller'

export type OtherStampSingle = 'allowed' | 'not_allowed'

export interface LcOtherApplicationPayload {
  applicantName: string
  applicantTaxId: string
  currency: string
  amount: string
  expiryDate: string
  noticeBank: string | null
  beneCorp: string | null
  managerName: string
  managerTitle: string
  beneAddress: string
  benePhone: string
  beneEmail: string
  paymentMain: OtherPaymentMain | null
  paymentExpBasis: OtherPaymentExpBasis | null
  paymentExpOtherText: string
  payDaysAfter: string
  invoiceKind: OtherInvoiceKind | null
  otherDocumentsDetail: string
  productPurchaseNote: string
  draftFormat: OtherDraftFormat | null
  partialShipment: OtherPartialShipment
  discountInterest: OtherDiscountInterest | null
  lastDeliveryDate: string
  draftLimitStartDate: string
  feeBearer: OtherFeeBearer | null
  stampSingleParty: OtherStampSingle | null
  otherSpecialTerms: string
  ratePaymentDayOfMonth: string
}

export const OTHER_NOTICE_BANK_ITEMS: readonly SelectItem[] = [
  { title: '125 彰化分行', value: '125' },
  { title: '221 桃園分行', value: '221' },
  { title: '023 南港分行', value: '023' },
  { title: '001 台北分行', value: '001' },
] as const

export const OTHER_BENE_ITEMS: readonly OtherBeneOption[] = [
  {
    title: '75708007 台灣塑膠工業股份有限公司',
    value: '75708007',
    taxId: '75708007',
    corpName: '台灣塑膠工業股份有限公司',
  },
  {
    title: '20201258 泰西股份有限公司',
    value: '20201258',
    taxId: '20201258',
    corpName: '泰西股份有限公司',
  },
] as const

export const OTHER_CURRENCY_OPTIONS = [{ title: '新台幣', value: 'TWD' }] as const

export function createInitialLcOtherForm (): LcOtherApplicationPayload {
  return {
    applicantName: '',
    applicantTaxId: '',
    currency: 'TWD',
    amount: '',
    expiryDate: '',
    noticeBank: null,
    beneCorp: null,
    managerName: '',
    managerTitle: '',
    beneAddress: '',
    benePhone: '',
    beneEmail: '',
    paymentMain: null,
    paymentExpBasis: null,
    paymentExpOtherText: '',
    payDaysAfter: '',
    invoiceKind: null,
    otherDocumentsDetail: '',
    productPurchaseNote: '',
    draftFormat: null,
    partialShipment: 'allowed',
    discountInterest: null,
    lastDeliveryDate: '',
    draftLimitStartDate: '',
    feeBearer: null,
    stampSingleParty: null,
    otherSpecialTerms: '',
    ratePaymentDayOfMonth: '',
  }
}
