import type { ListItem, ListResponse } from '@/types/reviewAmendApp'
import Mock from 'mockjs'

const mockListItems: ListItem[] = [
  {
    seqNo: 1,
    amendAppNo: 'M202501001',
    issueDate: '2025/01/15',
    applicant: '台灣科技股份有限公司',
    amount: 500_000,
    notifyBank: '高雄分行',
    beneficiary: '中鸿龋鐵股份有限公司',
    expiryDate: '2026/01/15',
    pendingApprover: '高雄分行經辦一，高雄分行主管一',
    status: '待經辦審核',
  },
  {
    seqNo: 2,
    amendAppNo: 'M202501002',
    issueDate: '2025/02/20',
    applicant: '網際測試股份有限公司',
    amount: 1_200_000,
    notifyBank: '台北分行',
    beneficiary: '全台物流股份有限公司',
    expiryDate: '2026/02/20',
    pendingApprover: '高雄分行經辦一，高雄分行主管一，7007經辦',
    status: '待經辦審核',
  },
  {
    seqNo: 3,
    amendAppNo: 'M202501003',
    issueDate: '2025/03/10',
    applicant: '南部貿易股份有限公司',
    amount: 750_000,
    notifyBank: '台南分行',
    beneficiary: '北部供應股份有限公司',
    expiryDate: '2026/03/10',
    pendingApprover: '7007經辦，7007主管',
    status: '待經辦審核',
  },
  {
    seqNo: 4,
    amendAppNo: 'M202501004',
    issueDate: '2025/04/08',
    applicant: '中部工業股份有限公司',
    amount: 2_000_000,
    notifyBank: '台中分行',
    beneficiary: '東部製造股份有限公司',
    expiryDate: '2026/04/08',
    pendingApprover: '高雄分行經辦一，高雄分行主管一，7007經辦，7007主管',
    status: '待經辦審核',
  },
  {
    seqNo: 5,
    amendAppNo: null,
    issueDate: '2025/05/18',
    applicant: '西部農業股份有限公司',
    amount: 300_000,
    notifyBank: '高雄分行',
    beneficiary: '南部食品股份有限公司',
    expiryDate: '2026/05/18',
    pendingApprover: '高雄分行經辦一',
    status: '待經辦審核',
  },
]

// 查詢修改申請書待審核清冊
Mock.mock('/api/reviewAmendApp/list', 'post', (options: any): ListResponse => {
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
    amount: paged.reduce((sum, item) => sum + item.amount, 0),
  }
})
