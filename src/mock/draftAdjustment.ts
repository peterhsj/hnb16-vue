import type { ListItem, ListResponse } from '@/types/draftAdjustment'
import Mock from 'mockjs'

const applicants = [
  '台灣積體電路製造股份有限公司',
  '聯華電子股份有限公司',
  '鴻海精密工業股份有限公司',
  '台達電子工業股份有限公司',
  '中華電信股份有限公司',
]

const applicantTaxIds = [
  '22099131',
  '03077208',
  '04541302',
  '23892556',
  '96979933',
]

const beneficiaries = [
  '中國鋼鐵股份有限公司',
  '中龍鋼鐵股份有限公司',
  '東和鋼鐵企業股份有限公司',
  '燁輝企業股份有限公司',
  '豐興鋼鐵股份有限公司',
]

const mockItems: ListItem[] = Array.from({ length: 15 }, (_, i) => ({
  seqNo: i + 1,
  draftNo: i % 4 === 3 ? null : `D${String(2_025_001 + i).padStart(7, '0')}`,
  applicant: applicants[i % applicants.length]!,
  applicantTaxId: applicantTaxIds[i % applicantTaxIds.length]!,
  lcNo: `09970004916400${String(1000 + i).padStart(4, '0')}`,
  lcAmount: (i + 1) * 200_000 + 100_000,
  expiryDate: `2025/${String((i % 9) + 1).padStart(2, '0')}/${String((i % 28) + 1).padStart(2, '0')}`,
  issuingDate: `2025/${String((i % 9) + 1).padStart(2, '0')}/${String((i % 28) + 3).padStart(2, '0')}`,
  issuingAmount: (i + 1) * 75_000 + 20_000,
  beneficiary: beneficiaries[i % beneficiaries.length]!,
}))

// 查詢押匯沖正(EC)清冊
Mock.mock('/api/draftAdjustment/list', 'post', (options: any): ListResponse => {
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
