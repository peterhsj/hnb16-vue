import type { LcListResponse, ListItem } from '@/types/queryAccount'
import Mock from 'mockjs'

const JOURNAL_MAP: Record<string, ListItem[]> = {
  lcOpen: [
    { seqNo: 1, lcNo: '099700030161000861', subject: '29601001存入保證金', subAccount: '信用狀', debit: null, credit: 500_000 },
    { seqNo: 2, lcNo: '099700030161000861', subject: '29601001存入保證金', subAccount: '信用狀', debit: null, credit: 3000 },
    { seqNo: 3, lcNo: '099700030161000861', subject: '29601001存入保證金', subAccount: '信用狀', debit: 503_000, credit: null },
  ],
  lcAmend: [
    { seqNo: 1, lcNo: '099700030161000862', subject: '4200300140國內信用狀手續費收入', subAccount: '信用狀開狀手續費-商金', debit: null, credit: 1500 },
    { seqNo: 2, lcNo: '099700030161000862', subject: '4200300140國內信用狀手續費收入', subAccount: '信用狀開狀手續費-商金', debit: 1500, credit: null },
  ],
  depositRefund: [
    { seqNo: 1, lcNo: '099700030161000863', subject: '60001臨時欠存', subAccount: '', debit: 500_000, credit: null },
    { seqNo: 2, lcNo: '099700030161000863', subject: '60001臨時欠存', subAccount: '', debit: null, credit: 500_000 },
  ],
  cancelBalance: [
    { seqNo: 1, lcNo: '099700030161000864', subject: '81011010應收信用狀款', subAccount: '連線轉檔專用', debit: 1_000_000, credit: null },
    { seqNo: 2, lcNo: '099700030161000864', subject: '81011010應收信用狀款', subAccount: '連線轉檔專用', debit: null, credit: 1_000_000 },
  ],
}

Mock.mock('/api/queryAccount/list', 'post', (options: any): LcListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const items: ListItem[][] = Object.values(JOURNAL_MAP) as ListItem[][]

  const totalDebit = items.flat().reduce((s, r) => s + (r.debit ?? 0), 0)

  return {
    items,
    summary: { total: items.flat().length, amount: totalDebit },
    page: 1,
    pageSize: items.length,
    totalPages: 1,
  }
})
