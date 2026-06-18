import type { BankInfo, BeneficiaryInfo, DraftInfo, LcInfo, SealInfo, SellerInfo } from '@/types/draftDetail'
import Mock from 'mockjs'

/**
 * 匯票資料 - Mock API
 */

// 獲取列表
Mock.mock('/api/draftDetail/list', 'post', () => {
  // 動態生成指定數量的數據

  const date = new Date(2026, 1, Math.floor(Math.random() * 28) + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const formattedDate = `${year}/${month}/${day}`
  const draftInfo: DraftInfo = {
    draftId: 2548,
    draftNo: '699315', // 匯票號碼
    status: 1, // 匯票狀態碼
    importDate: formattedDate, // 匯票匯入日期（yyyy/MM/dd）
    downloadFlag: 0, // 是否已下載旗標
    negoDate: formattedDate, // 押匯日期（yyyy/MM/dd），優先取 NegoDate，若為 null 則取 shipmentDate
    shipmentDate: formattedDate, // 裝船日期（yyyy/MM/dd）
    amount: 17_306_932, // 匯票金額
    amountInChinese: '壹仟柒佰參拾萬零陸仟玖佰參拾貳', // 金額中文大寫
    itemName: '貨品名稱-鋼捲一批', // 貨品名稱，若無則為空字串
    itemQuantity: 999_770, // 貨品數量（可為 null）
    itemSubtotal: 17_306_932, // 貨品小計（可為 null）
    applicantAddr: '臺中市大肚區新興里新興街48號', // 申請人地址，若無則為空字串
    depositAccount: '1234567890', // 存款帳號
    negoReason: '押匯原因', // 押匯原因，值同 itemName
  }
  const lcInfo: LcInfo = {
    lcNo: 'E1145160-S028-1555', // 信用狀號碼
    lcDateOfIssue: formattedDate, // 信用狀開狀日期（yyyy/MM/dd）
    dateOfIssue: formattedDate, // 開狀日（yyyy/MM/dd），值同 lcDateOfIssue
    dateOfExpiry: formattedDate, // 信用狀到期日（yyyy/MM/dd）
    lcImportDate: formattedDate, // 信用狀匯入日期（yyyy/MM/dd）
    lcAmount: 17_306_932, // 信用狀金額
    lcType: '即期', // 信用狀類型 即期 / 遠期
    availableAmount: 17_430_000, // 信用狀可用金額
    applicantReceiptNo: '12345678', // 申請人統一編號
    shipmentNoLaterThen: formattedDate, // 最遲裝船日（yyyy/MM/dd）
    dueDays: 60, // 到期天數 = lc.dueDays + negoDraft.adjustUsance（可為 null）
  }
  const bankInfo: BankInfo = {
    issuingBank: '123', // 開狀銀行代碼
    issuingBankId: '123', // 開狀銀行代碼，值同 issuingBank
    issuingBankName: '合作金庫商業銀行長安分行', // 開狀銀行名稱 + 分行名稱
    advisingBank: '456', // 押匯銀行代碼
    advisingBankName: '合作金庫商業銀行長安分行', // 付款銀行名稱 + 分行名稱
    notifyingBank: '789', // 通知銀行代碼
    notifyingBankName: '合作金庫商業銀行長安分行', // 通知銀行名稱 + 分行名稱
  }
  const beneficiaryInfo: BeneficiaryInfo = {
    beneficiaryId: 9876, // 受益人資料庫 ID
    beneficiaryName: '東和鋼鐵企業股份有限公司', // 受益人名稱
    beneficiaryReceiptNo: '87654321', // 受益人統一編號
    beneficiaryAddr: '台北市中山區104長安東路一段9號6樓', // 受益人地址
  }
  const sellerInfo: SellerInfo = {
    companyId: 123, // 押匯組織公司 ID
    companyName: '泰昌鋼鐵工廠股份有限公司', // 押匯組織公司名稱
    receiptNo: '87654321', // 押匯組織統一編號
    companyAddr: '臺中市大肚區新興里新興街48號', // 押匯組織地址
  }
  const sealInfo: SealInfo = {
    frontSign: '正面印鑑資訊', // 正面印鑑資訊
    backSign: '背面印鑑資訊', // 背面印鑑資訊
  }

  return {
    code: 200,
    message: '成功',
    data: {
      draftInfo,
      lcInfo,
      bankInfo,
      beneficiaryInfo,
      sellerInfo,
      sealInfo,
    },
  }
})

export default {}
