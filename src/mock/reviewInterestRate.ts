import type { LcListItem, LcListResponse, QueryFormPayload } from '@/types/reviewInterestRate'
import Mock from 'mockjs'

const mockLcItems: LcListItem[] = [
  {
    lcNo: '099700049161000860',
    issueDate: '2025/06/05',
    totalAmount: 282_125,
    draftNo: 'D202501001',
    draftAmount: 200_000,
    beneficiary: '中鸿龋鐵股份有限公司',
    expiryDate: '2026/06/05',
    status: '待經辦輸入',
    confirmationDate: '',
  },
  {
    lcNo: '099700049161000861',
    issueDate: '2025/06/05',
    totalAmount: 500_000,
    draftNo: 'D202501002',
    draftAmount: 350_000,
    beneficiary: '中鸿龋鐵股份有限公司',
    expiryDate: '2026/06/05',
    status: '待經辦輸入',
    confirmationDate: '2025/07/10',
  },
  {
    lcNo: '099700049161000862',
    issueDate: '2025/05/01',
    totalAmount: 1_200_000,
    draftNo: null,
    draftAmount: 0,
    beneficiary: '網際測試股份有限公司',
    expiryDate: '2026/05/01',
    status: '待經辦輸入',
    confirmationDate: '',
  },
  {
    lcNo: '099700049161000863',
    issueDate: '2025/08/15',
    totalAmount: 350_000,
    draftNo: 'D202501003',
    draftAmount: 300_000,
    beneficiary: '台灣科技股份有限公司',
    expiryDate: '2026/08/15',
    status: '待經辦輸入',
    confirmationDate: '2025/09/01',
  },
  {
    lcNo: '099700049161000864',
    issueDate: '2025/01/20',
    totalAmount: 900_000,
    draftNo: 'D202501004',
    draftAmount: 450_000,
    beneficiary: '南部食品股份有限公司',
    expiryDate: '2026/01/20',
    status: '待經辦輸入',
    confirmationDate: '',
  },
]

function filterItems (query: Partial<QueryFormPayload>): LcListItem[] {
  if (query.queryMode === 'lcNo' && query.lcNo?.trim()) {
    const keyword = query.lcNo.trim()
    return mockLcItems.filter(item => item.lcNo.includes(keyword))
  }

  if (query.queryMode === 'criteria') {
    let items = [...mockLcItems]

    if (query.beneficiaryTaxId?.trim()) {
      const taxId = query.beneficiaryTaxId.trim()
      items = items.filter(item => item.beneficiary.includes(taxId))
    }

    return items
  }

  return [...mockLcItems]
}

// 查詢利率約定改貸待審核清冊
Mock.mock('/api/reviewInterestRate/list', 'post', (options: any): LcListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, pageSize = 10, ...query } = body

  const filtered = filterItems(query as Partial<QueryFormPayload>)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize),
    summary: {
      total,
      amount: filtered.reduce((sum, item) => sum + item.totalAmount, 0),
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
