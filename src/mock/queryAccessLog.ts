import type { ListItem, ListResponse, QueryFormPayload } from '@/types/queryAccessLog'
import Mock from 'mockjs'

const NAMES = ['林大華', '王小明', '張大同', '李小美', '陳大華', '林小華', '黃大明', '吳小美']
const ROLES = ['經辦', '主管', '總行']
const OPERATION_ITEMS = ['登入', '登出']
const OPERATION_RESULTS = ['成功', '失敗']
const OPERATION_MESSAGES = ['Login', 'Logout']

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
  const issueMonth = String(r.issueDateMonth).padStart(2, '0')
  const issueDay = String(r.issueDateDay).padStart(2, '0')
  const issueDate = `2025/${issueMonth}/${issueDay} 12:00:00`
  const account = `HN${r.lcNoIdx}`

  return {
    account,
    name: NAMES[r.lcNoIdx % NAMES.length],
    role: ROLES[r.lcNoIdx % ROLES.length],
    time: issueDate,
    operationItem: OPERATION_ITEMS[r.lcNoIdx % OPERATION_ITEMS.length],
    operationResult: OPERATION_RESULTS[r.lcNoIdx % OPERATION_RESULTS.length],
    operationMessage: OPERATION_MESSAGES[r.lcNoIdx % OPERATION_MESSAGES.length],
  }
})

// function filterItems (query: Partial<QueryFormPayload>): ListItem[] {
//   let items = [...mockItems]

//   if (query.queryMode === 'lcNo' && query.lcNo?.trim()) {
//     return items.filter(item => item.lcNo.includes(query.lcNo!.trim()))
//   }

//   if (query.queryMode === 'criteria') {
//     if (query.applicantTaxId?.trim()) {
//       items = items.filter(item => item.applicant.includes(query.applicantTaxId!.trim()))
//     }

//     if (query.beneficiaryTaxId?.trim()) {
//       items = items.filter(item => item.beneficiary.includes(query.beneficiaryTaxId!.trim()))
//     }

//     if (query.issuingBank?.trim()) {
//       items = items.filter(item => item.issuingBank === query.issuingBank!.trim())
//     }

//     if (query.lcStatus?.length) {
//       const statusMap: Record<string, string> = {
//         active: '未到期',
//         expired: '已到期',
//         cancelled: '已註銷',
//       }
//       const labelSet = new Set(query.lcStatus.map(s => statusMap[s]))
//       items = items.filter(item => labelSet.has(item.status))
//     }

//     if (query.lcType) {
//       items = items.filter(item => item.lcType === query.lcType)
//     }

//     if (query.issueDateStart?.trim()) {
//       const start = new Date(query.issueDateStart.trim())
//       items = items.filter(item => !item.issueDate || new Date(item.issueDate) >= start)
//     }

//     if (query.issueDateEnd?.trim()) {
//       const end = new Date(query.issueDateEnd.trim())
//       items = items.filter(item => !item.issueDate || new Date(item.issueDate) <= end)
//     }
//   }

//   return items
// }

// 查詢信用狀清冊
Mock.mock('/api/queryAccessLog/list', 'post', (options: any): ListResponse => {
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
