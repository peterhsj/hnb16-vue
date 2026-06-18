// 匯票資訊
export interface DraftInfo {
  draftId: number // 匯票資料庫主鍵 ID
  draftNo?: string // 匯票號碼
  status?: number // 匯票狀態碼
  importDate?: string // 匯票匯入日期（yyyy/MM/dd）
  downloadFlag?: number // 是否已下載旗標
  negoDate?: string // 押匯日期（yyyy/MM/dd），優先取 NegoDate，若為 null 則取 shipmentDate
  shipmentDate?: string // 裝船日期（yyyy/MM/dd）
  amount?: number // 匯票金額
  amountInChinese?: string // 金額中文大寫
  itemName?: string // 貨品名稱，若無則為空字串
  itemQuantity?: number // 貨品數量（可為 null）
  itemSubtotal?: number // 貨品小計（可為 null）
  applicantAddr?: string // 申請人地址，若無則為空字串
  depositAccount?: string // 存款帳號
  negoReason?: string // 押匯原因，值同 itemName

}
// 信用狀資訊
export interface LcInfo {
  lcNo: string // 信用狀號碼
  lcDateOfIssue?: string // 信用狀開狀日期（yyyy/MM/dd）
  dateOfIssue?: string // 開狀日（yyyy/MM/dd），值同 lcDateOfIssue
  dateOfExpiry?: string // 信用狀到期日（yyyy/MM/dd）
  lcImportDate?: string // 信用狀匯入日期（yyyy/MM/dd）
  lcAmount?: number // 信用狀金額
  lcType?: string // 信用狀類型
  availableAmount?: number // 信用狀可用金額
  applicantReceiptNo?: string // 申請人統一編號
  shipmentNoLaterThen?: string // 最遲裝船日（yyyy/MM/dd）
  dueDays?: number // 到期天數 = lc.dueDays + negoDraft.adjustUsance（可為 null）
}
// 銀行資訊
export interface BankInfo {
  issuingBank?: string // 開狀銀行代碼
  issuingBankId?: string // 開狀銀行代碼，值同 issuingBank
  issuingBankName?: string // 開狀銀行名稱 + 分行名稱
  advisingBank?: string // 押匯銀行代碼
  advisingBankName?: string // 付款銀行名稱 + 分行名稱
  notifyingBank?: string // 通知銀行代碼
  notifyingBankName?: string // 通知銀行名稱 + 分行名稱
}
// 受益人資訊
export interface BeneficiaryInfo {
  beneficiaryId: number // 受益人資料庫 ID
  beneficiaryName?: string // 受益人名稱
  beneficiaryReceiptNo?: string // 受益人統一編號
  beneficiaryAddr?: string // 受益人地址

}
// 押匯組織（Seller）
export interface SellerInfo {
  companyId: number // 押匯組織公司 ID
  companyName?: string // 押匯組織公司名稱
  receiptNo?: string // 押匯組織統一編號
  companyAddr?: string // 押匯組織地址
}
// 印鑑資訊
export interface SealInfo {
  frontSign?: string // 正面印鑑資訊
  backSign?: string // 背面印鑑資訊
}
