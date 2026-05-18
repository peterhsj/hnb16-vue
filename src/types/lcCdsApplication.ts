export type LcTypeOption = 'sight' | 'usance'

export type ElectronicNoteOption = 'csc' | 'custom'

export type PartialShipmentOption = 'allowed' | 'not_allowed' | ''

export interface NoticeBankItem {
  readonly title: string
  readonly value: string
}

export interface LcCdsApplicationPayload {
  noticeBank: string | null
  lcType: LcTypeOption | null
  currency: string
  amount: string
  expiryDate: string
  beneEmail: string
  benePhone: string
  applicantName: string
  applicantTaxId: string
  applicantAddress: string
  goodsDescription: string
  electronicNote: ElectronicNoteOption | null
  customElectronicNote: string
  deliverPaymentRequest: boolean
  deliverInvoice: boolean
  deliverOther: boolean
  deliverOtherDetail: string
  partialShipment: PartialShipmentOption
  lastDeliveryDate: string
  otherSpecialTerms: string
}

export const DEFAULT_CUSTOM_ELECTRONIC_NOTE = `1.賣方所提供鋼品之一部或全部，可能產自中國鋼鐵股份有限公司或中龍鋼鐵股份有限公司(下稱中龍公司)，視實際出貨狀況而定。如產自中龍公司，賣方就其鋼品品質，負賣方責任，至如約定價格，各交易條件及優惠措施均不受影響。
2.匯票及匯票付款申請書使用中鋼格式，由受益人單獨簽章或使用數位憑證有效。
3.貨物可以分批交貨。
4.貨物明細以發票為準。
5.發票金額大於匯票金額及發票內容備註「受託代銷」字樣可以接受。
6.本信用狀適用 eUCP2.0 版。
7.允許受益人以匯票、匯票付款申請書及發票電子檔(包含電子發票證明聯等)方式押匯，另「受益人完整提示通知」得附加於匯票付款申請書之最後。
8.押匯電子文件透過網址：HTTPS://CDSLC.UXCDS.COM/CDSLC/ 提示。`

export function createInitialLcCdsForm (): LcCdsApplicationPayload {
  return {
    noticeBank: null,
    lcType: null,
    currency: 'TWD',
    amount: '',
    expiryDate: '',
    beneEmail: '',
    benePhone: '',
    applicantName: '林大華',
    applicantTaxId: '12345678',
    applicantAddress: '台北市中正區羅斯福路一段120號',
    goodsDescription: '鋼捲2捆',
    electronicNote: null,
    customElectronicNote: DEFAULT_CUSTOM_ELECTRONIC_NOTE,
    deliverPaymentRequest: false,
    deliverInvoice: false,
    deliverOther: false,
    deliverOtherDetail: '~請填寫其他應檢附之單據~',
    partialShipment: 'allowed',
    lastDeliveryDate: '',
    otherSpecialTerms: '',
  }
}

export const NOTICE_BANK_ITEMS: readonly NoticeBankItem[] = [
  { title: '華南銀行彰化分行', value: 'changhua' },
  { title: '華南銀行桃園分行', value: 'taoyuan' },
  { title: '華南銀行南港分行', value: 'nangang' },
  { title: '華南銀行台北分行', value: 'taipei' },
] as const

export const CURRENCY_OPTIONS = [{ title: '新台幣', value: 'TWD' }] as const

export interface LcAppData {
  type: string
  appNo: string
  beneType: string
}
