import type { ListItem, ListResponse, ListSearchParams } from '@/types/expiredLc'
import Mock from 'mockjs'

const mockListItems: ListItem[] = [
  {
    lcNo: '099700049161000860',
    issuingBank: '高雄分行',
    issueDate: '2024/06/05',
    totalAmount: 282_125,
    availableAmount: 282_125,
    beneficiaryTaxId: '30414175',
    status: '已到期',
  },
  {
    lcNo: '099700049161000861',
    issuingBank: '高雄分行',
    issueDate: '2024/07/10',
    totalAmount: 500_000,
    availableAmount: 500_000,
    beneficiaryTaxId: '30414175',
    status: '已到期',
  },
  {
    lcNo: '099700049161000862',
    issuingBank: '台北分行',
    issueDate: '2024/05/01',
    totalAmount: 1_200_000,
    availableAmount: 800_000,
    beneficiaryTaxId: '12345678',
    status: '已到期',
  },
  {
    lcNo: '099700049161000863',
    issuingBank: '台中分行',
    issueDate: '2024/08/15',
    totalAmount: 350_000,
    availableAmount: 350_000,
    beneficiaryTaxId: '87654321',
    status: '未到期',
  },
  {
    lcNo: '099700049161000864',
    issuingBank: '台南分行',
    issueDate: '2025/01/20',
    totalAmount: 900_000,
    availableAmount: 450_000,
    beneficiaryTaxId: '11223344',
    status: '未到期',
  },
]

function filterItems (params: ListSearchParams): ListItem[] {
  const { lcNo, beneficiaryTaxId, lcStatus, issueDateStart, issueDateEnd } = params

  let items = [...mockListItems]

  if (lcNo?.trim()) {
    items = items.filter(item => item.lcNo.includes(lcNo.trim()))
  }

  if (beneficiaryTaxId?.trim()) {
    items = items.filter(item => item.beneficiaryTaxId.includes(beneficiaryTaxId.trim()))
  }

  if (lcStatus === 'expired') {
    items = items.filter(item => item.status === '已到期')
  } else if (lcStatus === 'active') {
    items = items.filter(item => item.status === '未到期')
  }

  if (issueDateStart) {
    items = items.filter(item => item.issueDate >= issueDateStart)
  }

  if (issueDateEnd) {
    items = items.filter(item => item.issueDate <= issueDateEnd)
  }

  return items
}

// 查詢 CDS 過期案件主動註銷清冊
Mock.mock('/api/expiredLc/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, itemsPerPage = 10, ...query } = body as ListSearchParams & { page: number, itemsPerPage: number }

  const filtered = filterItems(query)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * itemsPerPage

  return {
    items: filtered.slice(start, start + itemsPerPage),
    summary: {
      total,
      amount: filtered.reduce((sum, item) => sum + item.totalAmount, 0),
    },
    page: safePage,
    itemsPerPage,
    totalPages,
  }
})
