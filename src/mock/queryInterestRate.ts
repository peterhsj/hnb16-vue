import type { LcListResponse, ListItem, QueryFormPayload } from '@/types/queryInterestRate'
import Mock from 'mockjs'

const BANKS = ['台北本行', '信義分行', '松山分行', '南京分行', '中山分行', '板橋分行', '新莊分行', '中和分行', '新店分行', '桃園分行', '中壢分行', '新竹分行', '台中分行', '彰化分行', '嘉義分行', '台南分行', '高雄分行', '鳳山分行']
const BENEFICIARIES = ['南部食品股份有限公司', '西部紡織股份有限公司', '松山電子股份有限公司', '嘉義農產股份有限公司', '台南化工股份有限公司', '中壢包裝股份有限公司', '新莊五金股份有限公司', '彰化紙業股份有限公司']
const BENEFICIARY_TAX_IDS = ['11223344', '22334455', '33445566', '44556677', '55667788', '66778899', '77889900', '88990011']
const APPLICANT_TAX_IDS = ['12345678', '23456789', '34567890', '45678901', '56789012', '67890123', '78901234', '89012345']
const STATUSES = ['待經辦審核', '待主管審核', '已開立', '已拒絕']
const STATUS_KEYS = ['pendingOperator', 'pendingManager', 'issued', 'rejected']
const SOURCES = ['線上', '臨櫃']

const rawItems = Mock.mock({
  'list|20': [{
    'seqNo|+1': 1,
    'lcNoIdx|860-879': 860,
    'draftNoSuffix|1000-9999': 1000,
    'bankIdx|0-17': 0,
    'beneficiaryIdx|0-7': 0,
    'issueDateDay|1-28': 10,
    'issueDateMonth|1-6': 3,
    'validOffsetDays|180-365': 180,
    'lcAmount|200-8000': 200,
    'availableRatio|10-90': 60,
    'draftAmountRatio|10-80': 40,
    'statusIdx|0-3': 0,
    'sourceIdx|0-1': 0,
    'confirmOffsetDays|1-30': 5,
    'agreementNoSuffix|1000-9999': 1000,
  }],
}).list as any[]

const mockItems: (ListItem & { _bankName: string, _beneficiaryTaxId: string, _applicantTaxId: string, _statusKey: string })[] = rawItems.map(r => {
  const month = String(r.issueDateMonth).padStart(2, '0')
  const day = String(r.issueDateDay).padStart(2, '0')
  const issueDate = `2025/${month}/${day}`

  const issueMs = new Date(`2025/${month}/${day}`).getTime()
  const validMs = issueMs + r.validOffsetDays * 24 * 60 * 60 * 1000
  const validDateObj = new Date(validMs)
  const validDate = `${validDateObj.getFullYear()}/${String(validDateObj.getMonth() + 1).padStart(2, '0')}/${String(validDateObj.getDate()).padStart(2, '0')}`

  const confirmMs = issueMs + r.confirmOffsetDays * 24 * 60 * 60 * 1000
  const confirmDateObj = new Date(confirmMs)
  const confirmationDate = `2025/${String(confirmDateObj.getMonth() + 1).padStart(2, '0')}/${String(confirmDateObj.getDate()).padStart(2, '0')}`

  const lcNo = `09970004916100${r.lcNoIdx}`
  const lcAmount = r.lcAmount * 1000
  const availableAmount = Math.round(lcAmount * r.availableRatio / 100)
  const draftAmount = Math.round(lcAmount * r.draftAmountRatio / 100)
  const bankName = BANKS[r.bankIdx % BANKS.length] ?? ''

  return {
    seqNo: r.seqNo,
    interestRateAgreement: `IR${r.agreementNoSuffix}`,
    lcNo,
    draftNo: `DR${r.draftNoSuffix}`,
    draftAmount,
    issuingBank: bankName,
    issueDate,
    lcAmount,
    availableAmount,
    beneficiary: BENEFICIARIES[r.beneficiaryIdx % BENEFICIARIES.length] ?? '',
    validDate,
    status: STATUSES[r.statusIdx % STATUSES.length] ?? '',
    confirmationDate,
    source: SOURCES[r.sourceIdx % SOURCES.length] ?? '',
    _bankName: bankName,
    _beneficiaryTaxId: BENEFICIARY_TAX_IDS[r.beneficiaryIdx % BENEFICIARY_TAX_IDS.length] ?? '',
    _applicantTaxId: APPLICANT_TAX_IDS[r.beneficiaryIdx % APPLICANT_TAX_IDS.length] ?? '',
    _statusKey: STATUS_KEYS[r.statusIdx % STATUS_KEYS.length] ?? '',
  }
})

function filterItems (query: Partial<QueryFormPayload>): ListItem[] {
  let items = [...mockItems] as typeof mockItems

  if (query.queryMode === 'lcNo' && query.lcNo?.trim()) {
    return mockItems
      .filter(item => item.lcNo.includes(query.lcNo!.trim()))
      .map(({ _bankName: _b, _beneficiaryTaxId: _bt, _applicantTaxId: _at, _statusKey: _sk, ...rest }) => rest as ListItem)
  }

  if (query.applicantTaxId?.trim()) {
    items = items.filter(item => item._applicantTaxId.includes(query.applicantTaxId!.trim()))
  }

  if (query.beneficiaryTaxId?.trim()) {
    items = items.filter(item => item._beneficiaryTaxId.includes(query.beneficiaryTaxId!.trim()))
  }

  if (query.issuingBank?.trim()) {
    items = items.filter(item => item._bankName === query.issuingBank!.trim())
  }

  if (query.lcStatus?.length) {
    items = items.filter(item => query.lcStatus!.includes(item._statusKey as any))
  }

  if (query.issueDateStart?.trim()) {
    const start = new Date(query.issueDateStart.trim())
    items = items.filter(item => new Date(item.issueDate) >= start)
  }

  if (query.issueDateEnd?.trim()) {
    const end = new Date(query.issueDateEnd.trim())
    end.setHours(23, 59, 59, 999)
    items = items.filter(item => new Date(item.issueDate) <= end)
  }

  return items.map(({ _bankName: _b, _beneficiaryTaxId: _bt, _applicantTaxId: _at, _statusKey: _sk, ...rest }) => rest as ListItem)
}

// 查詢利率約定改貸清冊
Mock.mock('/api/queryInterestRate/list', 'post', (options: any): LcListResponse => {
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
