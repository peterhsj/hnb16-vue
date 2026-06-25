import type { ListItem, ListResponse, QueryFormPayload } from '@/types/queryBlcAmount'
import Mock from 'mockjs'

const BRANCH_CODES = ['707', '800', '120', '123', '523', '852', '963', '852']
const BRANCH_NAMES = ['台北分行', '高雄分行', '台中分行', '台南分行', '新竹分行', '桃園分行', '嘉義分行', '屏東分行']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  branchCode: BRANCH_CODES[i % BRANCH_CODES.length]!,
  branchName: BRANCH_NAMES[i % BRANCH_NAMES.length]!,
  cdsidCount: Mock.Random.integer(0, 10),
  cdsidAmount: Mock.Random.integer(0, 1_000_000),
  counterCount: Mock.Random.integer(0, 10),
  counterAmount: Mock.Random.integer(0, 1_000_000),
  onlineCount: Mock.Random.integer(0, 10),
  onlineAmount: Mock.Random.integer(0, 1_000_000),
  discountCount: Mock.Random.integer(0, 10),
  discountAmount: Mock.Random.integer(0, 1_000_000),
}))

// 查詢未結案信用狀額度與保證金清冊
Mock.mock('/api/queryBlcAmount/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')

  const { ...query } = body

  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
      amount: mockItems.reduce((sum, item) => sum + item.cdsidAmount + item.counterAmount + item.onlineAmount + item.discountAmount, 0),
    },
  }
})
