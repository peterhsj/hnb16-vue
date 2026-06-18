import Mock from 'mockjs'

/**
 * 發票資料查詢列表 - Mock API
 */

// 獲取列表
Mock.mock('/api/invoice/list', 'post', () => {
  // 動態生成指定數量的數據
  interface draftListItem {
    id: string
    invoiceNo: string // 發票號碼
    amount?: number // 發票金額
    date?: string // 發票日期
    contractNo?: string // 合約編號
    billOfLadingNo?: string // 提單編號
  }
  const date = new Date(2026, 1, Math.floor(Math.random() * 28) + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const formattedDate = `${year}/${month}/${day}`

  // 生成 1-5 筆隨機的 draftList
  const draftCount = Mock.Random.integer(10, 20)
  // const dataList = Array.from({ length: draftCount }, () => ({
  //   invoiceNo: `${Mock.Random.integer(100_000, 999_999)}`,
  //   amount: Mock.Random.integer(1_000_000, 99_999_999),
  // }))

  const listData: draftListItem[] = Array.from({ length: draftCount }, () => ({
    id: Mock.Random.guid(),
    invoiceNo: `UY${Mock.Random.integer(10_000_000, 99_999_999)}`,
    amount: Mock.Random.integer(1_000_000, 99_999_999),
    date: formattedDate,
    contractNo: `con_${Mock.Random.integer(100_000, 999_999)}`,
    billOfLadingNo: `BOL_${Mock.Random.integer(100_000, 999_999)}`,
  }))

  return {
    code: 200,
    message: '成功',
    data: listData,
  }
})

export default {}
