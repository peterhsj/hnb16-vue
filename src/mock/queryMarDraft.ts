import type { LcListResponse, ListItem, QueryFormPayload } from '@/types/queryMarDraft'
import Mock from 'mockjs'

const BANKS = ['台北本行', '信義分行', '松山分行', '南京分行', '中山分行', '板橋分行', '新莊分行', '中和分行', '新店分行', '桃園分行', '中壢分行', '新竹分行', '台中分行', '彰化分行', '嘉義分行', '台南分行', '高雄分行', '鳳山分行']
const BENEFICIARY_NAMES = ['南部食品股份有限公司', '西部紡織股份有限公司', '松山電子股份有限公司', '嘉義農產股份有限公司', '台南化工股份有限公司', '中壢包裝股份有限公司', '新莊五金股份有限公司', '彰化紙業股份有限公司']
const BENEFICIARY_TAX_IDS = ['11223344', '22334455', '33445566', '44556677', '55667788', '66778899', '77889900', '88990011']
const AUTH_REASONS = ['核准押匯', '', '']
const APPROVER_ACCOUNTS = ['A001', 'A002', 'A003', 'B001', 'B002']
const APPROVER_NAMES = ['王大明', '李小華', '張志遠', '陳雅婷', '林建宏']
const APPROVER_REVIEWS = ['王建民', '', '', '陳杰憲', '']
const REMARKS = ['', '', '', '補收費用', '']

const rawItems = Mock.mock({
  'list|20': [{
    'seqNo|+1': 1,
    'lcNoIdx|860-879': 860,
    'beneficiaryIdx|0-7': 0,
    'bankIdx|0-17': 0,
    'draftDateDay|1-28': 10,
    'draftDateMonth|1-6': 3,
    'approvalHour|8-17': 9,
    'approvalMin|0-59': 30,
    'draftAmount|100-5000': 100,
    'lcBalanceRatio|20-90': 60,
    'authReasonIdx|0-4': 0,
    'approverIdx|0-4': 0,
    'remarkIdx|0-4': 0,
    'reviewIdx|0-1': 0,
    'draftNoSuffix|1000-9999': 1000,
  }],
}).list as any[]

const mockItems: ListItem[] = rawItems.map(r => {
  const month = String(r.draftDateMonth).padStart(2, '0')
  const day = String(r.draftDateDay).padStart(2, '0')
  const hour = String(r.approvalHour).padStart(2, '0')
  const min = String(r.approvalMin).padStart(2, '0')
  const draftDate = `2025/${month}/${day}`
  const approvalTime = `2025/${month}/${day} ${hour}:${min}`

  const lcNo = `09970004916100${r.lcNoIdx}`
  const draftAmount = r.draftAmount * 1000
  const lcBalance = Math.round(draftAmount * r.lcBalanceRatio / 100)

  return {
    seqNo: r.seqNo,
    beneficiaryTaxId: BENEFICIARY_TAX_IDS[r.beneficiaryIdx % BENEFICIARY_TAX_IDS.length] ?? '',
    beneficiaryName: BENEFICIARY_NAMES[r.beneficiaryIdx % BENEFICIARY_NAMES.length] ?? '',
    draftDate,
    draftNo: `DR${r.draftNoSuffix}`,
    draftAmount,
    lcNo,
    lcBalance,
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

// 查詢主管核准押匯紀錄清冊
Mock.mock('/api/queryMarDraft/list', 'post', (options: any): LcListResponse => {
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
      amount: filtered.reduce((sum, item) => sum + item.draftAmount, 0),
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
