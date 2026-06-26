import type { ListItem, ListResponse } from '@/types/queryFpcCtsv'
import Mock from 'mockjs'

const SEND_STATUS = ['待傳送', '傳送成功', '傳送失敗']
const CONFIRM_STATUS = [true, false]
const TRANSACTION_TYPES = ['押匯申請', '開狀回應']
const LC_SOURCES = ['台塑網 → 華銀', '華銀 → 台塑網']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  appNo: Mock.Random.integer(0, 1_000_000_000).toString(),
  lcNo: Mock.Random.integer(0, 1_000_000_000).toString(),
  lcSource: LC_SOURCES[i % LC_SOURCES.length]!,
  transactionType: TRANSACTION_TYPES[i % TRANSACTION_TYPES.length]!,
  sendStatus: SEND_STATUS[(i + 1) % SEND_STATUS.length]!,
  resendCount: Mock.Random.integer(0, 10),
  sendTime: Mock.Random.date('yyyy/MM/dd HH:mm:ss'),
  sendBranchCode: Mock.Random.integer(0, 100_000).toString(),
  confirmStatus: CONFIRM_STATUS[i % CONFIRM_STATUS.length]!,
  createTime: Mock.Random.date('yyyy/MM/dd HH:mm:ss'),
}))

// 查詢台塑網通訊傳輸排程檢視
Mock.mock('/api/queryFpcCtsv/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
  }
})
