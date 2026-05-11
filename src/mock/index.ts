// 引入 mock 模塊
import Mock from 'mockjs'

// 引入各個模組的 mock API
import './auth' // '登入/登出'
import './info' // '訊息匣'
// import './todoList' // '待辦事項統計'
// import './documentComplete' // '押匯文件齊全'
// import './notification' // '押匯'
// import './scheduleBooking' // '預約押匯'
// import './reminderNotification' // '押匯重新提示' '銀行押匯放行' '銀行押匯拒絕'
// import './bankRelease' // '銀行押匯放行'
// import './bankRejection' // '銀行押匯拒絕'
// import './lcInfo' // 'L/C 基本資料查詢列表'
// import './draftBasicInfo' // '匯票基本資料查詢列表'
// import './negotiationDoc' // '押匯文件列表'
// import './category' // '類別維護'
// import './userRole' // '角色維護'
// import './banks' // '銀行及分行資料'
// import './applicant' // '買受人統編資料'
// import './organizationInfo' // '會員資料查詢列表'
// import './userProfile' // '會員資料查詢列表'
// import './maintainBankInfoList' // '銀行資料查詢列表'
// import './draftInfo' // '匯票資料'
// import './draftList' // '匯票列表'
// import './importLcBasicInfo' // '匯入L/C基本資料'
// import './importLcExpandedInfo' // '匯入L/C完整資料'
// import './importSignature' // '匯入匯票印章'
// import './importInvoiceSignature' // '匯入發票印章'

// 設定 mock 配置
Mock.setup({
  timeout: '200-600', // 模擬網路延遲
})
