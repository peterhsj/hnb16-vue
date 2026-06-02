import type { LcListResponse, ListItem, QueryFormPayload } from '@/types/queryMarLc'
import Mock from 'mockjs'

const BANKS = ['台北本行', '信義分行', '松山分行', '南京分行', '中山分行', '板橋分行', '新莊分行', '中和分行', '新店分行', '桃園分行', '中壢分行', '新竹分行', '台中分行', '彰化分行', '嘉義分行', '台南分行', '高雄分行', '鳳山分行']
const BORROWER_NAMES = ['台灣製造股份有限公司', '中部鋼鐵股份有限公司', '東方貿易股份有限公司', '信義科技股份有限公司', '南京工業股份有限公司', '北部物流股份有限公司', '桃園機械股份有限公司', '新竹半導體股份有限公司']
const BORROWER_TAX_IDS = ['12345678', '23456789', '34567890', '45678901', '56789012', '67890123', '78901234', '89012345']
const AUTH_REASONS = ['核准開狀']
const APPROVER_ACCOUNTS = ['A001', 'A002', 'A003', 'B001', 'B002']
const APPROVER_NAMES = ['王大明', '李小華', '張志遠', '陳雅婷', '林建宏']
const APPROVER_REVIEWS = ['王建民', '', '', '陳杰憲', '']
const REMARKS = ['', '', '', '補收費用', '已確認']

const rawItems = Mock.mock({
  'list|10': [{
    'seqNo|+1': 1,
    'lcNoIdx|860-879': 860,
    'lcTypeIdx|0-1': 0,
    'borrowerIdx|0-7': 0,
    'bankIdx|0-17': 0,
    'approvalDateDay|1-28': 10,
    'approvalDateMonth|1-6': 3,
    'approvalHour|8-17': 9,
    'approvalMin|0-59': 30,
    'amount|100-5000': 100,
    'authReasonIdx|0-4': 0,
    'approverIdx|0-4': 0,
    'remarkIdx|0-4': 0,
    'reviewIdx|0-1': 0,
  }],
}).list as any[]

const mockItems: ListItem[] = rawItems.map(r => {
  const month = String(r.approvalDateMonth).padStart(2, '0')
  const day = String(r.approvalDateDay).padStart(2, '0')
  const hour = String(r.approvalHour).padStart(2, '0')
  const min = String(r.approvalMin).padStart(2, '0')
  const approvalTime = `2025/${month}/${day} ${hour}:${min}`

  const lcNo = `09970004916100${r.lcNoIdx}`
  const lcAmount = r.amount * 1000

  return {
    seqNo: r.seqNo,
    borrowerTaxId: BORROWER_TAX_IDS[r.borrowerIdx % BORROWER_TAX_IDS.length] ?? '',
    borrowerName: BORROWER_NAMES[r.borrowerIdx % BORROWER_NAMES.length] ?? '',
    lcNo,
    lcType: r.lcTypeIdx === 0 ? '即期' : '遠期',
    lcAmount,
    approvalTime,
    authorizationReason: AUTH_REASONS[r.authReasonIdx % AUTH_REASONS.length] ?? '',
    approverAccount: APPROVER_ACCOUNTS[r.approverIdx % APPROVER_ACCOUNTS.length] ?? '',
    approverName: APPROVER_NAMES[r.approverIdx % APPROVER_NAMES.length] ?? '',
    approverReview: APPROVER_REVIEWS[r.reviewIdx % APPROVER_REVIEWS.length] ?? '',
    remark: REMARKS[r.remarkIdx % REMARKS.length] ?? '',
    issuingBank: BANKS[r.bankIdx % BANKS.length] ?? '',
  }
})

function filterItems (query: Partial<QueryFormPayload>): ListItem[] {
  const items = [...mockItems]

  // if (query.issuingBank?.trim()) {
  //   items = items.filter(item => item.issuingBank === query.issuingBank!.trim())
  // }

  // if (query.issueDateStart?.trim()) {
  //   const start = new Date(query.issueDateStart.trim())
  //   items = items.filter(item => new Date(item.approvalTime) >= start)
  // }

  // if (query.issueDateEnd?.trim()) {
  //   const end = new Date(query.issueDateEnd.trim())
  //   end.setHours(23, 59, 59, 999)
  //   items = items.filter(item => new Date(item.approvalTime) <= end)
  // }

  return items
}

// 查詢主管核准開狀紀錄清冊
Mock.mock('/api/queryMarLc/list', 'post', (options: any): LcListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, pageSize = 10, ...query } = body

  const filtered = filterItems(query as Partial<QueryFormPayload>)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  return {
    items: pageItems,
    summary: {
      total,
      amount: filtered.reduce((sum, item) => sum + item.lcAmount, 0),
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
