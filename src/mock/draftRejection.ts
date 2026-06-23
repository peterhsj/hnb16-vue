import type { ListItem, ListResponse, QueryFormPayload } from '@/types/draftRejection'
import Mock from 'mockjs'

const REASONS = ['其他', '簽章不符', '匯票日期早於信用狀付款日', '發票金額與匯票金額不符', '分批交貨', '匯票金額大於信用狀可用餘額', '逾信用狀有效期限', '押匯日期大於起始日期']

const rawItems = Mock.mock({
  'list|15': [{
    'lcNoIdx|860-874': 860,
    'lcTypeIdx|0-1': 0,
    'applicantIdx|0-7': 0,
    'bankIdx|0-12': 0,
    'issueDateDay|1-28': 10,
    'issueDateMonth|1-6': 3,
    'validOffsetDays|180-365': 180,
    'amount|100-5000': 100,
    'beneficiaryIdx|0-7': 0,
    'beneficiaryGroupIdx|0-3': 0,
    'balanceRatio|30-100': 80,
    'statusIdx|0-2': 0,
    'sourceIdx|0-1': 0,
  }],
}).list as any[]

const mockItems: ListItem[] = rawItems.map(r => {
  // const issueMonth = String(r.issueDateMonth).padStart(2, '0')
  // const issueDay = String(r.issueDateDay).padStart(2, '0')
  // const issueDate = `2025/${issueMonth}/${issueDay} 12:00:00`
  const code = `000${r.lcNoIdx}`

  return {
    code,
    reason: REASONS[r.lcNoIdx % REASONS.length],
  }
})

// 查詢信用狀清冊
Mock.mock('/api/draftRejection/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, pageSize = 10, ...query } = body

  // const filtered = filterItems(query as Partial<QueryFormPayload>)
  const total = mockItems.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = mockItems.slice(start, start + pageSize)

  return {
    items: pageItems,
    summary: {
      total,
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
