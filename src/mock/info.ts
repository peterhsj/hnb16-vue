import Mock from 'mockjs'

/**
 * 訊息匣 - Mock API
 */

// 訊息項目型別
interface InfoItem {
  lcNo: string
  title: string
  content: string
  date: string
  status: boolean
}

// 開狀訊息列表
const lcAppItems: InfoItem[] = [
  { lcNo: 'LC2024001', title: '開狀通知', content: '116年1月10日客戶多樂股份有限公司完成開立國內信用狀1筆(LC2024001)', date: '2026/01/10', status: false },
  { lcNo: 'LC2024002', title: '開狀申請審核通知', content: '受益人中國鋼鐵股份有限公司於民國116年1月12日已被核准押匯申請1筆(信用狀號碼：LC2024002，匯票號碼：TA24110503)', date: '2026/01/12', status: false },
  { lcNo: 'LC2024003', title: '開狀通知', content: '116年1月15日客戶大同股份有限公司完成開立國內信用狀1筆(LC2024003)', date: '2026/01/15', status: false },
  { lcNo: 'LC2024004', title: '開狀申請審核通知', content: '受益人宏基股份有限公司於民國116年1月20日已被核准押匯申請1筆(信用狀號碼：LC2024004，匯票號碼：TA24110510)', date: '2026/01/20', status: false },
  { lcNo: 'LC2024005', title: '開狀通知', content: '116年1月25日客戶联合貧易股份有限公司完成開立國內信用狀1筆(LC2024005)', date: '2026/01/25', status: false },
  { lcNo: 'LC2024006', title: '開狀申請審核通知', content: '受益人台灣電子股份有限公司於民國116年2月1日已被核准押匯申請1筆(信用狀號碼：LC2024006，匯票號碼：TA24110520)', date: '2026/02/01', status: true },
  { lcNo: 'LC2024007', title: '開狀通知', content: '116年2月5日客戶鴴海集團股份有限公司完成開立國內信用狀1筆(LC2024007)', date: '2026/02/05', status: true },
  { lcNo: 'LC2024008', title: '開狀通知', content: '116年1月10日客戶多樂股份有限公司完成開立國內信用狀1筆(LC2024008)', date: '2026/01/10', status: false },
  { lcNo: 'LC2024009', title: '開狀申請審核通知', content: '受益人中國鋼鐵股份有限公司於民國116年1月12日已被核准押匯申請1筆(信用狀號碼：LC2024009，匯票號碼：TA24110503)', date: '2026/01/12', status: false },
  { lcNo: 'LC2024010', title: '開狀通知', content: '116年1月15日客戶大同股份有限公司完成開立國內信用狀1筆(LC2024010)', date: '2026/01/15', status: false },
  { lcNo: 'LC2024011', title: '開狀申請審核通知', content: '受益人宏基股份有限公司於民國116年1月20日已被核准押匯申請1筆(信用狀號碼：LC2024011，匯票號碼：TA24110510)', date: '2026/01/20', status: false },
  { lcNo: 'LC2024012', title: '開狀通知', content: '116年1月25日客戶联合貧易股份有限公司完成開立國內信用狀1筆(LC2024012)', date: '2026/01/25', status: false },
  { lcNo: 'LC2024013', title: '開狀申請審核通知', content: '受益人台灣電子股份有限公司於民國116年2月1日已被核准押匯申請1筆(信用狀號碼：LC2024013，匯票號碼：TA24110520)', date: '2026/02/01', status: true },
  { lcNo: 'LC2024014', title: '開狀通知', content: '116年2月5日客戶鴴海集團股份有限公司完成開立國內信用狀1筆(LC2024014)', date: '2026/02/05', status: true },
]

// 查詢開狀訊息列表
Mock.mock('/api/info/lcApp', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: lcAppItems,
  }
})

// 標記為已讀
Mock.mock(/\/api\/info\/lcApp\/read/, 'patch', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { lcNos } = body as { lcNos: string[] }

  for (const item of lcAppItems) {
    if (lcNos.includes(item.lcNo)) {
      item.status = true
    }
  }

  return {
    code: 200,
    message: 'success',
    data: null,
  }
})

// 刪除訊息
Mock.mock(/\/api\/info\/lcApp\/delete/, 'delete', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { lcNos } = body as { lcNos: string[] }

  const before = lcAppItems.length
  for (let i = lcAppItems.length - 1; i >= 0; i--) {
    if (lcNos.includes(lcAppItems[i]!.lcNo)) {
      lcAppItems.splice(i, 1)
    }
  }

  return {
    code: 200,
    message: 'success',
    data: { deleted: before - lcAppItems.length },
  }
})

// ─────────────────────────────────────────────
// 修狀訊息列表
// ─────────────────────────────────────────────

interface AmendItem {
  amendNo: string
  title: string
  content: string
  date: string
  status: boolean
}

const amendAppItems: AmendItem[] = [
  { amendNo: 'AM2025001', title: '修狀通知', content: '116年1月5日客戶多樂股份有限公司完成修改國內信用狀1筆(CDSD116000001)', date: '2026/01/05', status: false },
  { amendNo: 'AM2025002', title: '修狀審核通知', content: '受益人中國鋼鐵股份有限公司於民國116年1月8日已被核准押匯申請1筆(信用狀號碼：CDSD116000002，匯票號碼：TA26010501)', date: '2026/01/08', status: false },
  { amendNo: 'AM2025003', title: '修狀通知', content: '116年1月12日客戶大同股份有限公司提出國內信用狀修狀申請1筆(CDSD116000003)', date: '2026/01/12', status: false },
  { amendNo: 'AM2025004', title: '修狀審核通知', content: '受益人宏基股份有限公司於民國116年1月15日已被核准押匯申請1筆(信用狀號碼：CDSD116000004，匯票號碼：TA26011502)', date: '2026/01/15', status: false },
  { amendNo: 'AM2025005', title: '修狀通知', content: '116年1月18日客戶联合貿易股份有限公司完成修改國內信用狀1筆(CDSD116000005)', date: '2026/01/18', status: false },
  { amendNo: 'AM2025006', title: '修狀通知', content: '116年1月22日客戶台灣電子股份有限公司提出國內信用狀修狀申請1筆(CDSD116000006)', date: '2026/01/22', status: true },
  { amendNo: 'AM2025007', title: '修狀審核通知', content: '受益人鴻海集團股份有限公司於民國116年1月25日已被核准押匯申請1筆(信用狀號碼：CDSD116000007，匯票號碼：TA26012503)', date: '2026/01/25', status: true },
  { amendNo: 'AM2025008', title: '修狀通知', content: '116年1月28日客戶南山人壽股份有限公司完成修改國內信用狀1筆(CDSD116000008)', date: '2026/01/28', status: false },
  { amendNo: 'AM2025009', title: '修狀審核通知', content: '受益人富邦金控股份有限公司於民國116年2月1日已被核准押匯申請1筆(信用狀號碼：CDSD116000009，匯票號碼：TA26020101)', date: '2026/02/01', status: false },
  { amendNo: 'AM2025010', title: '修狀通知', content: '116年2月3日客戶中華電信股份有限公司提出國內信用狀修狀申請1筆(CDSD116000010)', date: '2026/02/03', status: false },
  { amendNo: 'AM2025011', title: '修狀通知', content: '116年2月5日客戶台積電股份有限公司完成修改國內信用狀1筆(CDSD116000011)', date: '2026/02/05', status: false },
  { amendNo: 'AM2025012', title: '修狀審核通知', content: '受益人聯發科技股份有限公司於民國116年2月8日已被核准押匯申請1筆(信用狀號碼：CDSD116000012，匯票號碼：TA26020801)', date: '2026/02/08', status: true },
]

// 查詢修狀訊息列表
Mock.mock('/api/info/amendApp', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: amendAppItems,
  }
})

// 標記修狀為已讀
Mock.mock(/\/api\/info\/amendApp\/read/, 'patch', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { amendNos } = body as { amendNos: string[] }

  for (const item of amendAppItems) {
    if (amendNos.includes(item.amendNo)) {
      item.status = true
    }
  }

  return {
    code: 200,
    message: 'success',
    data: null,
  }
})

// 刪除修狀訊息
Mock.mock(/\/api\/info\/amendApp\/delete/, 'delete', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { amendNos } = body as { amendNos: string[] }

  const before = amendAppItems.length
  for (let i = amendAppItems.length - 1; i >= 0; i--) {
    if (amendNos.includes(amendAppItems[i]!.amendNo)) {
      amendAppItems.splice(i, 1)
    }
  }

  return {
    code: 200,
    message: 'success',
    data: { deleted: before - amendAppItems.length },
  }
})

// ─────────────────────────────────────────────
// 註銷訊息列表
// ─────────────────────────────────────────────

interface CancelItem {
  cancelNo: string
  title: string
  content: string
  date: string
  status: boolean
}

const cancelAppItems: CancelItem[] = [
  { cancelNo: 'CA2025001', title: '註銷申請審核通知', content: '116年1月6日客戶多樂股份有限公司完成國內信用狀註銷1筆(CDSD116000021)', date: '2026/01/06', status: false },
  { cancelNo: 'CA2025002', title: '註銷申請審核通知', content: '受益人中國鋼鐵股份有限公司於民國116年1月9日已被核准押匯申請1筆(信用狀號碼：CDSD116000022，匯票號碼：TA26010601)', date: '2026/01/09', status: false },
  { cancelNo: 'CA2025003', title: '註銷申請審核通知', content: '116年1月13日客戶大同股份有限公司提出國內信用狀註銷申請1筆(CDSD116000023)', date: '2026/01/13', status: false },
  { cancelNo: 'CA2025004', title: '註銷申請審核通知', content: '受益人宏基股份有限公司於民國116年1月16日已被核准押匯申請1筆(信用狀號碼：CDSD116000024，匯票號碼：TA26011601)', date: '2026/01/16', status: false },
  { cancelNo: 'CA2025005', title: '註銷申請審核通知', content: '116年1月20日客戶联合貿易股份有限公司完成國內信用狀註銷1筆(CDSD116000025)', date: '2026/01/20', status: false },
  { cancelNo: 'CA2025006', title: '註銷申請審核通知', content: '116年1月23日客戶台灣電子股份有限公司提出國內信用狀註銷申請1筆(CDSD116000026)', date: '2026/01/23', status: true },
  { cancelNo: 'CA2025007', title: '註銷申請審核通知', content: '受益人鴻海集團股份有限公司於民國116年1月26日已被核准押匯申請1筆(信用狀號碼：CDSD116000027，匯票號碼：TA26012601)', date: '2026/01/26', status: true },
  { cancelNo: 'CA2025008', title: '註銷申請審核通知', content: '116年1月29日客戶南山人壽股份有限公司完成國內信用狀註銷1筆(CDSD116000028)', date: '2026/01/29', status: false },
  { cancelNo: 'CA2025009', title: '註銷申請審核通知', content: '受益人富邦金控股份有限公司於民國116年2月2日已被核准押匯申請1筆(信用狀號碼：CDSD116000029，匯票號碼：TA26020201)', date: '2026/02/02', status: false },
  { cancelNo: 'CA2025010', title: '註銷申請審核通知', content: '116年2月4日客戶中華電信股份有限公司提出國內信用狀註銷申請1筆(CDSD116000030)', date: '2026/02/04', status: false },
]

// 查詢註銷訊息列表
Mock.mock('/api/info/cancelApp', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: cancelAppItems,
  }
})

// 標記註銷為已讀
Mock.mock(/\/api\/info\/cancelApp\/read/, 'patch', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { cancelNos } = body as { cancelNos: string[] }

  for (const item of cancelAppItems) {
    if (cancelNos.includes(item.cancelNo)) {
      item.status = true
    }
  }

  return {
    code: 200,
    message: 'success',
    data: null,
  }
})

// 刪除註銷訊息
Mock.mock(/\/api\/info\/cancelApp\/delete/, 'delete', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { cancelNos } = body as { cancelNos: string[] }

  const before = cancelAppItems.length
  for (let i = cancelAppItems.length - 1; i >= 0; i--) {
    if (cancelNos.includes(cancelAppItems[i]!.cancelNo)) {
      cancelAppItems.splice(i, 1)
    }
  }

  return {
    code: 200,
    message: 'success',
    data: { deleted: before - cancelAppItems.length },
  }
})

// ─────────────────────────────────────────────
// 押匯訊息列表
// ─────────────────────────────────────────────

interface DraftItem {
  draftNo: string
  title: string
  content: string
  date: string
  status: boolean
}

const draftAppItems: DraftItem[] = [
  { draftNo: 'DR2025001', title: '押匯審核通知', content: '116年1月7日客戶多樂股份有限公司完成國內信用狀押匯1筆(LC_TEST_2026010701)', date: '2026/01/07', status: false },
  { draftNo: 'DR2025002', title: '押匯審核通知', content: '受益人中國鋼鐵股份有限公司於民國116年1月10日已被核准押匯申請1筆(信用狀號碼：CDSD116000041，匯票號碼：TA26011001)', date: '2026/01/10', status: false },
  { draftNo: 'DR2025003', title: '押匯審核通知', content: '116年1月14日客戶大同股份有限公司提出國內信用狀押匯申請1筆(CDSD116000042)', date: '2026/01/14', status: false },
  { draftNo: 'DR2025004', title: '押匯審核通知', content: '受益人宏基股份有限公司於民國116年1月17日已被核准押匯申請1筆(信用狀號碼：CDSD116000043，匯票號碼：TA26011701)', date: '2026/01/17', status: false },
  { draftNo: 'DR2025005', title: '押匯審核通知', content: '116年1月21日客戶联合貿易股份有限公司完成國內信用狀押匯1筆(CDSD116000044)', date: '2026/01/21', status: false },
  { draftNo: 'DR2025006', title: '押匯審核通知', content: '116年1月24日客戶台灣電子股份有限公司提出國內信用狀押匯申請1筆(CDSD116000045)', date: '2026/01/24', status: true },
  { draftNo: 'DR2025007', title: '押匯審核通知', content: '受益人鴻海集團股份有限公司於民國116年1月27日已被核准押匯申請1筆(信用狀號碼：CDSD116000046，匯票號碼：TA26012701)', date: '2026/01/27', status: true },
  { draftNo: 'DR2025008', title: '押匯審核通知', content: '116年1月30日客戶南山人壽股份有限公司完成國內信用狀押匯1筆(CDSD116000047)', date: '2026/01/30', status: false },
  { draftNo: 'DR2025009', title: '押匯審核通知', content: '受益人富邦金控股份有限公司於民國116年2月3日已被核准押匯申請1筆(信用狀號碼：CDSD116000048，匯票號碼：TA26020301)', date: '2026/02/03', status: false },
  { draftNo: 'DR2025010', title: '押匯審核通知', content: '116年2月6日客戶中華電信股份有限公司提出國內信用狀押匯申請1筆(CDSD116000049)', date: '2026/02/06', status: false },
]

// 查詢押匯訊息列表
Mock.mock('/api/info/draftApp', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: draftAppItems,
  }
})

// 標記押匯為已讀
Mock.mock(/\/api\/info\/draftApp\/read/, 'patch', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { draftNos } = body as { draftNos: string[] }

  for (const item of draftAppItems) {
    if (draftNos.includes(item.draftNo)) {
      item.status = true
    }
  }

  return {
    code: 200,
    message: 'success',
    data: null,
  }
})

// 刪除押匯訊息
Mock.mock(/\/api\/info\/draftApp\/delete/, 'delete', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { draftNos } = body as { draftNos: string[] }

  const before = draftAppItems.length
  for (let i = draftAppItems.length - 1; i >= 0; i--) {
    if (draftNos.includes(draftAppItems[i]!.draftNo)) {
      draftAppItems.splice(i, 1)
    }
  }

  return {
    code: 200,
    message: 'success',
    data: { deleted: before - draftAppItems.length },
  }
})
