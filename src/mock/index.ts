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

// 設定 mock 配置
Mock.setup({
  timeout: '200-600', // 模擬網路延遲
})
