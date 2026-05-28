import type { ListItem, ListResponse, ListSearchParams } from '@/types/sentTrfStatus'
import Mock from 'mockjs'

const mockListItems: ListItem[] = [
  {
    seqNo: 1,
    draftNo: 'D202501001',
    beneficiary: '中鸿龋鐵股份有限公司',
  },
  {
    seqNo: 2,
    draftNo: 'D202501002',
    beneficiary: '中鸿龋鐵股份有限公司',
  },
  {
    seqNo: 3,
    draftNo: 'D202501003',
    beneficiary: '網際測試股份有限公司',
  },
  {
    seqNo: 4,
    draftNo: 'D202501004',
    beneficiary: '網際測試股份有限公司',
  },
  {
    seqNo: 5,
    draftNo: 'D202501005',
    beneficiary: '台灣科技股份有限公司',
  },
]

function filterItems (params: ListSearchParams): ListItem[] {
  const { lcNo, beneficiaryTaxId } = params

  let items = [...mockListItems]

  if (lcNo?.trim()) {
    // 依信用狀號碼過濾（示意）
    items = items.filter(item => item.draftNo.includes(lcNo.trim()))
  }

  if (beneficiaryTaxId?.trim()) {
    // 示意：以受益人統編過濾（mock 無統編欄位，以受益人名稱替代）
    items = items.filter(item => item.beneficiary.includes(beneficiaryTaxId.trim()))
  }

  return items
}

// 查詢傳送已轉帳狀態清冊
Mock.mock('/api/sentTrfStatus/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, itemsPerPage = 10, ...query } = body as ListSearchParams

  const filtered = filterItems(query)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * itemsPerPage

  return {
    items: filtered.slice(start, start + itemsPerPage),
    summary: {
      total,
      amount: 1_580_000,
    },
    page: safePage,
    itemsPerPage,
    totalPages,
  }
})
