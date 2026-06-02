import type { LcListResponse, ListItem, QueryFormPayload } from '@/types/queryOutstandLc'
import Mock from 'mockjs'

const APPLICANT_NAMES = ['網優股份有限公司', '台灣製造股份有限公司', '中部鋼鐵股份有限公司', '東方貿易股份有限公司', '信義科技股份有限公司', '南京工業股份有限公司', '北部物流股份有限公司', '桃園機械股份有限公司']
const APPLICANT_TAX_IDS = ['12345678', '23456789', '34567890', '45678901', '56789012', '67890123', '78901234', '89012345']

const rawItems = Mock.mock({
  'list|20': [{
    'seqNo|+1': 1,
    'lcNoIdx|860-879': 860,
    'applicantIdx|0-7': 0,
    'issueDateDay|1-28': 10,
    'issueDateMonth|1-6': 3,
    'validOffsetDays|180-365': 180,
    'amount|200-8000': 200,
    'balanceRatio|10-90': 60,
    'depositRatio|0-30': 10,
  }],
}).list as any[]

const mockItems: ListItem[] = rawItems.map(r => {
  const month = String(r.issueDateMonth).padStart(2, '0')
  const day = String(r.issueDateDay).padStart(2, '0')
  const issueDate = `2025/${month}/${day}`

  const issueMs = new Date(`2025/${month}/${day}`).getTime()
  const expiryMs = issueMs + r.validOffsetDays * 24 * 60 * 60 * 1000
  const expiryDateObj = new Date(expiryMs)
  const expiryDate = `${expiryDateObj.getFullYear()}/${String(expiryDateObj.getMonth() + 1).padStart(2, '0')}/${String(expiryDateObj.getDate()).padStart(2, '0')}`

  const lcNo = `09970004916100${r.lcNoIdx}`
  const lcAmount = r.amount * 1000
  const lcBalance = Math.round(lcAmount * r.balanceRatio / 100)
  const unreturnedDeposit = Math.round(lcAmount * r.depositRatio / 100)

  return {
    lcNo,
    issueDate,
    expiryDate,
    lcAmount,
    lcBalance,
    unreturnedDeposit,
    _applicantName: APPLICANT_NAMES[r.applicantIdx % APPLICANT_NAMES.length] ?? '',
    _applicantTaxId: APPLICANT_TAX_IDS[r.applicantIdx % APPLICANT_TAX_IDS.length] ?? '',
  } as any
})

function filterItems (query: Partial<QueryFormPayload>): ListItem[] {
  let items = [...mockItems] as any[]

  if (query.applicantName?.trim()) {
    items = items.filter(item => item._applicantName.includes(query.applicantName!.trim()))
  }

  if (query.applicantTaxId?.trim()) {
    items = items.filter(item => item._applicantTaxId.includes(query.applicantTaxId!.trim()))
  }

  return items.map(({ _applicantName: _a, _applicantTaxId: _t, ...rest }) => rest as ListItem)
}

// 查詢未結案信用狀額度與保證金清冊
Mock.mock('/api/queryOutstandLc/list', 'post', (options: any): LcListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { ...query } = body

  const items = filterItems(query as Partial<QueryFormPayload>)

  return {
    items: mockItems,
    summary: {
      total: items.length,
      amount: items.reduce((sum, item) => sum + item.lcAmount, 0),
    },
  }
})
