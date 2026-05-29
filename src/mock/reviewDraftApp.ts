import type { BeneListItem, BeneListResponse, ListItem, ListResponse } from '@/types/reviewDraftApp'
import Mock from 'mockjs'

const mockListItems: ListItem[] = [
  {
    seqNo: 1,
    draftNo: 'D202501001',
    applicant: '台灣科技股份有限公司',
    lcNo: '099700049161000860',
    lastAmount: 500_000,
    expiryDate: '2026/01/15',
    notifyBank: '臨櫃',
    issuingDate: '2025/01/10',
    draftAmount: 320_000,
    beneficiary: '中鸿龋鐵股份有限公司',
    pendingApprover: '高雄分行經辦一，高雄分行主管一',
    status: '待經辦審核',
  },
  {
    seqNo: 2,
    draftNo: 'D202501002',
    applicant: '網際測試股份有限公司',
    lcNo: '099700049161000861',
    lastAmount: 1_200_000,
    expiryDate: '2026/02/20',
    notifyBank: '紙本',
    issuingDate: '2025/02/15',
    draftAmount: 800_000,
    beneficiary: '全台物流股份有限公司',
    pendingApprover: '高雄分行經辦一，高雄分行主管一，7007經辦',
    status: '待經辦審核',
  },
  {
    seqNo: 3,
    draftNo: null,
    applicant: '南部貿易股份有限公司',
    lcNo: '099700049161000862',
    lastAmount: 750_000,
    expiryDate: '2026/03/10',
    notifyBank: '臨櫃',
    issuingDate: '2025/03/08',
    draftAmount: 750_000,
    beneficiary: '北部供應股份有限公司',
    pendingApprover: '7007經辦，7007主管',
    status: '待經辦審核',
  },
  {
    seqNo: 4,
    draftNo: 'D202501004',
    applicant: '中部工業股份有限公司',
    lcNo: '099700049161000863',
    lastAmount: 2_000_000,
    expiryDate: '2026/04/08',
    notifyBank: '臨櫃',
    issuingDate: '2025/04/01',
    draftAmount: 1_500_000,
    beneficiary: '東部製造股份有限公司',
    pendingApprover: '高雄分行經辦一，高雄分行主管一，7007經辦，7007主管',
    status: '待經辦審核',
  },
  {
    seqNo: 5,
    draftNo: 'D202501005',
    applicant: '西部農業股份有限公司',
    lcNo: '099700049161000864',
    lastAmount: 300_000,
    expiryDate: '2026/05/18',
    notifyBank: '紙本',
    issuingDate: '2025/05/12',
    draftAmount: 200_000,
    beneficiary: '南部食品股份有限公司',
    pendingApprover: '高雄分行經辦一',
    status: '待經辦審核',
  },
]

// 查詢押匯申請待審核清冊
Mock.mock('/api/reviewDraftApp/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, itemsPerPage = 10 } = body

  const total = mockListItems.length
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * itemsPerPage
  const paged = mockListItems.slice(start, start + itemsPerPage)

  return {
    data: paged,
    total,
    amount: paged.reduce((sum, item) => sum + item.draftAmount, 0),
  }
})

// ── 受益人清冊 ────────────────────────────────────────────────────────────────
const mockBeneItems: BeneListItem[] = [
  { beneficiary: '中鸿龋鐵股份有限公司', beneficiaryId: '30414175', count: 3 },
  { beneficiary: '全台物流股份有限公司', beneficiaryId: '12345678', count: 2 },
  { beneficiary: '北部供應股份有限公司', beneficiaryId: '87654321', count: 1 },
  { beneficiary: '東部製造股份有限公司', beneficiaryId: '11223344', count: 4 },
  { beneficiary: '南部食品股份有限公司', beneficiaryId: '55667788', count: 2 },
]

Mock.mock('/api/reviewDraftApp/beneList', 'post', (options: any): BeneListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, itemsPerPage = 10 } = body

  const total = mockBeneItems.length
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * itemsPerPage
  const paged = mockBeneItems.slice(start, start + itemsPerPage)

  return {
    data: paged,
    total,
    amount: paged.reduce((sum, item) => sum + item.count, 0),
  }
})
