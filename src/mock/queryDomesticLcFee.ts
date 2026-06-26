import type { ListItem, ListResponse } from '@/types/queryDomesticLcFee.ts'
import Mock from 'mockjs'

const SEND_STATUS = ['CDS', '網銀', '臨櫃']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  lcSource: SEND_STATUS[i % SEND_STATUS.length]!,
  count: Mock.Random.integer(0, 1000),
  totalFee: Mock.Random.integer(0, 100_000_000),
}))

// 查詢台塑網通訊傳輸排程檢視
Mock.mock('/api/queryDomesticLcFee/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
  }
})
