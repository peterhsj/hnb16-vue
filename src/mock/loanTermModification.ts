import type { ListItem, ListResponse } from '@/types/loanTermModification'
import Mock from 'mockjs'

const beneficiaries = [
  '中國鋼鐵股份有限公司',
  '中龍鋼鐵股份有限公司',
  '東和鋼鐵企業股份有限公司',
  '燁輝企業股份有限公司',
  '豐興鋼鐵股份有限公司',
]

const rateAgreements = [
  '固定利率 2.5%',
  '浮動利率 TAIBOR+0.5%',
  '固定利率 3.0%',
  '浮動利率 TAIBOR+0.8%',
  '固定利率 2.8%',
]

const sources = ['臨櫃', 'CDS']

const mockItems: ListItem[] = Array.from({ length: 15 }, (_, i) => ({
  lcNo: `09970004916500${String(1000 + i).padStart(4, '0')}`,
  issueDate: `2025/${String((i % 9) + 1).padStart(2, '0')}/${String((i % 28) + 1).padStart(2, '0')}`,
  draftNo: i % 4 === 3 ? null : `D${String(2_025_001 + i).padStart(7, '0')}`,
  issuingAmount: (i + 1) * 120_000 + 30_000,
  beneficiary: beneficiaries[i % beneficiaries.length]!,
  amendAmount: (i + 1) * 80_000 + 20_000,
  rateAgreement: rateAgreements[i % rateAgreements.length]!,
  source: sources[i % sources.length]!,
}))

// 查詢利率約定改貸沖正(EC)清冊
Mock.mock('/api/loanTermModification/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, itemsPerPage = 10 } = body

  const total = mockItems.length
  const amount = mockItems.reduce((sum, item) => sum + item.issuingAmount, 0)
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * itemsPerPage

  return {
    data: mockItems.slice(start, start + itemsPerPage),
    total,
    amount,
  }
})
