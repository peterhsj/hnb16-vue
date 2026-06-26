import type { ListItem, ListResponse } from '@/types/queryClientConnect'
import Mock from 'mockjs'

const BRANCHESS = ['台北分行', '台中分行', '高雄分行']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  senId: Mock.Random.id(),
  branchName: BRANCHESS[i % BRANCHESS.length]!,
  account: Mock.Random.string('number', 10),
  role: Mock.Random.pick(['Admin', 'User', 'Guest']),
  ip: Mock.Random.ip(),
  loginTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
}))

// 查詢台塑網通訊傳輸排程檢視
Mock.mock('/api/queryClientConnect/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
  }
})
