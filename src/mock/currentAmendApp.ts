import type { LcTypeOption } from '@/types/common'
import type { ListItem, ListResponse } from '@/types/currentAmendApp'
import Mock from 'mockjs'

const applicants = [
  '台灣積體電路製造股份有限公司',
  '聯華電子股份有限公司',
  '鴻海精密工業股份有限公司',
  '台達電子工業股份有限公司',
  '中華電信股份有限公司',
]

const notifyBanks = [
  '臺北分行',
  '高雄分行',
  '台中分行',
  '新竹分行',
  '板橋分行',
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
  amendAppNo: `099700017161${String(861 + i).padStart(6, '0')}-A-02`,
  amendNoticeNo: i % 4 === 3 ? null : `M${String(2_025_001 + i).padStart(7, '0')}`,
  lcNo: `09970004916200${String(1000 + i).padStart(4, '0')}`,
  lcType: (i % 2 === 0 ? 'sight' : 'usance') as LcTypeOption,
  issueDate: `2025/0${(i % 9) + 1}/${String((i % 28) + 1).padStart(2, '0')}`,
  applicant: applicants[i % applicants.length]!,
  notifyBank: notifyBanks[i % notifyBanks.length]!,
  beneficiary: beneficiaries[i % beneficiaries.length]!,
  totalAmount: (i + 1) * 98_000 + 30_000,
}))

// 查詢修狀沖正(EC)清冊
Mock.mock('/api/currentAmendApp/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, itemsPerPage = 10 } = body

  const total = mockItems.length
  const amount = mockItems.reduce((sum, item) => sum + item.totalAmount, 0)
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * itemsPerPage

  return {
    data: mockItems.slice(start, start + itemsPerPage),
    total,
    amount,
  }
})
