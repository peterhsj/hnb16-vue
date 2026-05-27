import type { ListItem, ListResponse } from '@/types/chargeAmendLc'
import Mock from 'mockjs'

const beneficiaries = [
  '中國鋼鐵股份有限公司',
  '中龍鋼鐵股份有限公司',
  '東和鋼鐵企業股份有限公司',
  '燁輝企業股份有限公司',
  '豐興鋼鐵股份有限公司',
]

const statuses = ['待處理', '處理中', '已完成']

const mockItems: ListItem[] = Array.from({ length: 15 }, (_, i) => {
  const lcAmount = (i + 1) * 300_000 + 100_000
  const issuingAmount = Math.floor(lcAmount * 0.6)
  return {
    seqNo: i + 1,
    lcNo: `09970004916600${String(1000 + i).padStart(4, '0')}`,
    issueDate: `2025/${String((i % 9) + 1).padStart(2, '0')}/${String((i % 28) + 1).padStart(2, '0')}`,
    lcAmount,
    lastAmount: lcAmount - issuingAmount,
    draftNo: i % 4 === 3 ? null : `D${String(2_025_001 + i).padStart(7, '0')}`,
    issuingAmount,
    chargeAmount: Math.floor(issuingAmount * 0.005),
    beneficiary: beneficiaries[i % beneficiaries.length]!,
    expiryDate: `2026/${String((i % 9) + 1).padStart(2, '0')}/${String((i % 28) + 1).padStart(2, '0')}`,
    status: statuses[i % statuses.length]!,
  }
})

// 查詢補收開狀手續費沖正(EC)清冊
Mock.mock('/api/chargeAmendLc/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, itemsPerPage = 10 } = body

  const total = mockItems.length
  const amount = mockItems.reduce((sum, item) => sum + item.chargeAmount, 0)
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * itemsPerPage

  return {
    data: mockItems.slice(start, start + itemsPerPage),
    total,
    amount,
  }
})
