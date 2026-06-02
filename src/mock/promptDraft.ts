import type { ListItem, ListResponse } from '@/types/promptDraft'
import Mock from 'mockjs'

const mockLcItems: ListItem[] = [
  {
    lcNo: '099700041161011861',
    buyerName: '鼎力金屬工業股份有限公司',
    draftNo: 'P114000008',
    draftAmount: 282_125,
    invoiceNo: 'UX11150001',
    invoiceAmount: 282_125,
  },
  {
    lcNo: '099700041161011863',
    buyerName: '鼎力金屬工業股份有限公司',
    draftNo: 'P114000008',
    draftAmount: 282_125,
    invoiceNo: 'UX11150001',
    invoiceAmount: 282_125,
  },
]

Mock.mock('/api/promptDraft/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')

  const totalDebit = mockLcItems.reduce((s, r) => s + (r.draftAmount ?? 0), 0)

  return {
    items: mockLcItems,
    summary: { total: mockLcItems.length, amount: totalDebit },
    page: 1,
    pageSize: mockLcItems.length,
    totalPages: 1,
  }
})
