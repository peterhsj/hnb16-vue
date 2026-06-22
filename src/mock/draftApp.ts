import type { DraftLcListItem, DraftLcListResponse, DraftQueryFormPayload } from '@/types/draftApp'
import Mock from 'mockjs'

const mockLcItems: DraftLcListItem[] = [
  {
    lcNo: '099700049161000860',
    issuingBank: '高雄分行',
    issueDate: '2025/06/05',
    totalAmount: 282_125,
    availableBalance: 282_125,
    beneficiary: '中鸿龋鐵股份有限公司',
    beneficiaryTaxId: '30414175',
    status: '未到期',
    isAccepted: true,
  },
  {
    lcNo: '099700049161000861',
    issuingBank: '高雄分行',
    issueDate: '2025/06/05',
    totalAmount: 500_000,
    availableBalance: 500_000,
    beneficiary: '中鸿龋鐵股份有限公司',
    beneficiaryTaxId: '30414175',
    status: '未到期',
    isAccepted: true,
  },
  {
    lcNo: '099700049161000862',
    issuingBank: '台北分行',
    issueDate: '2025/05/01',
    totalAmount: 1_200_000,
    availableBalance: 800_000,
    beneficiary: '網際測試股份有限公司',
    beneficiaryTaxId: '12345678',
    status: '已到期',
    isAccepted: false,
  },
]

function filterItems (query: DraftQueryFormPayload): DraftLcListItem[] {
  if (query.queryMode === 'lcNo' && query.lcNo.trim()) {
    const keyword = query.lcNo.trim()
    return mockLcItems.filter(item => item.lcNo.includes(keyword))
  }

  if (query.queryMode === 'criteria') {
    let items = [...mockLcItems]

    if (query.beneficiaryTaxId.trim()) {
      const taxId = query.beneficiaryTaxId.trim()
      items = items.filter(item => item.beneficiaryTaxId.includes(taxId))
    }

    if (query.lcStatus === 'expired') {
      items = items.filter(item => item.status === '已到期')
    } else if (query.lcStatus === 'active') {
      items = items.filter(item => item.status === '未到期')
    }

    return items
  }

  return [...mockLcItems]
}

// 查詢押匯申請可用之信用狀清冊
Mock.mock('/api/draftApp/lcList', 'post', (options: any): DraftLcListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, pageSize = 10, ...query } = body

  const filtered = filterItems(query as DraftQueryFormPayload)
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
