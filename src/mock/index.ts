// 引入 mock 模塊
import Mock from 'mockjs'

// 引入各個模組的 mock API
import './auth' // '登入/登出'
import './info' // '訊息匣'
import './amendAccept' // '修改信用狀接受註記'
import './lcApp' // '開狀申請書'
import './amendApp' // '修改申請書可用信用狀清冊'
import './draftApp' // '押匯申請可用信用狀清冊'
import './cancelApp' // '註銷申請/切結書清冊'
import './amendLcApp' // '開狀沖正(EC)清冊'
import './currentAmendApp' // '修狀沖正(EC)清冊'
import './currentCancelApp' // '註銷信用狀沖正(EC)清冊'
import './currentAmendDraftApp' // '押匯沖正(EC)清冊'
import './loanTermModification' // '利率約定改貸沖正(EC)清冊'
import './chargeAmendLc' // '補收開狀手續費沖正(EC)清冊'
import './lcAdjustment' // '開狀申請當日調整帳務清冊'
import './amendAdjustment' // '修狀沖正(EC)當日調整帳務清冊'
import './cancelAdjustment' // '註銷申請當日調整帳務清冊'
import './draftAdjustment' // '押匯申請當日調整帳務清冊'
import './sentTrfStatus' // '傳送已轉帳狀態清冊'
import './expiredLc' // 'CDS 過期案件主動註銷清冊'
import './reviewLcApp' // '開狀申請書待審核清冊'

// 設定 mock 配置
Mock.setup({
  timeout: '200-600', // 模擬網路延遲
})
