import type { ListItem, ListResponse } from '@/types/querySar'
import Mock from 'mockjs'

const TRANSACTION_SEQ_NO = ['0000001', '0000002', '0000003', '0000004', '0000005', '0000006', '0000007', '0000008']
const OPERATION_TYPES = ['開狀申請書', '修狀申請書', '押匯申請書']
const ERROR_CODES = ['rnid999', 'rnid888', '']
const ERROR_MESSAGES = ['', '補收費用', '資料不完整', '資料格式錯誤', '交易序號不存在', '核准時間異常']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  transactionDate: Mock.Random.date('yyyy/MM/dd'),
  transactionSeqNo: TRANSACTION_SEQ_NO[i % TRANSACTION_SEQ_NO.length]!,
  operationType: OPERATION_TYPES[i % OPERATION_TYPES.length]!,
  approvalTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
  errorCode: Mock.Random.pick(ERROR_CODES),
  errorMessage: Mock.Random.pick(ERROR_MESSAGES),
}))

// 查詢主管核准押匯紀錄清冊
Mock.mock('/api/querySar/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
    page: 1,
    pageSize: 10,
    totalPages: 1,
  }
})
