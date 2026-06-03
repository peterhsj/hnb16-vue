import type { ListItem, ListResponse } from '@/types/setGroup'
import Mock from 'mockjs'

const BRANCHES = ['台北分行', '台中分行', '高雄分行', '新竹分行', '桃園分行', '台南分行', '嘉義分行', '屏東分行']
const APPLICANTS = ['台灣製造股份有限公司', '中部鋼鐵股份有限公司', '東方貿易股份有限公司', '信義科技股份有限公司', '南京工業股份有限公司', '北部物流股份有限公司', '桃園機械股份有限公司', '新竹半導體股份有限公司']

// 動態生成 mock 數據
function generateMockItems (count = 10): ListItem[] {
  const items: ListItem[] = []

  for (let i = 1; i <= count; i++) {
    const Random = Mock.Random

    items.push({
      senNo: String(i),
      customerName: Random.pick(APPLICANTS),
      taxId: `${Random.integer(100_000_000, 999_999_999)}`,
      branch: Random.pick(BRANCHES),
      reviewGroup: `Group ${Random.integer(1, 5)}`,
      totalAmount: Random.integer(100_000, 1_000_000),
    })
  }

  return items
}

const mockLcItems: ListItem[] = generateMockItems(15)

Mock.mock('/api/setGroup/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')

  return {
    items: mockLcItems,
    summary: { total: mockLcItems.length, amount: 0 },
    page: 1,
    pageSize: mockLcItems.length,
    totalPages: 1,
  }
})
