import type { LcListResponse, LcTypeOption, ListItem, QueryFormPayload } from '@/types/queryLcApp'
import Mock from 'mockjs'

const BANKS = ['台北本行', '信義分行', '松山分行', '南京分行', '中山分行', '板橋分行', '新莊分行', '中和分行', '新店分行', '桃園分行', '台中分行', '高雄分行', '鳳山分行']
const STATUSES = ['待經辦審核', '待主管審核', '已開立', '已拒絕']
const APPLICANTS = ['台灣製造股份有限公司', '中部鋼鐵股份有限公司', '東方貿易股份有限公司', '信義科技股份有限公司', '南京工業股份有限公司', '北部物流股份有限公司', '桃園機械股份有限公司', '新竹半導體股份有限公司']
const BENEFICIARIES = ['南部食品股份有限公司', '西部紡織股份有限公司', '松山電子股份有限公司', '嘉義農產股份有限公司', '台南化工股份有限公司', '中壢包裝股份有限公司', '新莊五金股份有限公司', '彰化紙業股份有限公司']
const APPROVERS = ['高雄分行經辦一', '高雄分行主管一', '台北本行經辦二', '台中分行主管一', '桃園分行經辦三', '信義分行主管二']

const rawItems = Mock.mock({
  'list|15': [{
    'seqNo|+1': 1,
    'appNoIdx|0-99999': 1,
    'lcNoIdx|860-874': 860,
    'lcTypeIdx|0-1': 0,
    'applicantIdx|0-7': 0,
    'bankIdx|0-12': 0,
    'appDateDay|1-28': 10,
    'appDateMonth|1-6': 3,
    'issueDateOffset|1-7': 3,
    'totalAmount|1-2000': 1000,
    'beneficiaryIdx|0-7': 0,
    'statusIdx|0-3': 0,
    'approverIdx|0-5': 0,
    'lcFeeReceipt|1': true,
    'depositReceipt|1': true,
    'cashPaySlip|1': true,
    'acceptanceFeeReceipt|1': true,
    'transferVoucher|1': true,
    'eBankFeeReceipt|1': true,
  }],
}).list as any[]

const mockItems: ListItem[] = rawItems.map(r => {
  const appMonth = String(r.appDateMonth).padStart(2, '0')
  const appDay = String(r.appDateDay).padStart(2, '0')
  const applicationDate = `2025/${appMonth}/${appDay}`
  const issueDay = String(Math.min(r.appDateDay + r.issueDateOffset, 28)).padStart(2, '0')
  const issueDate = `2025/${appMonth}/${issueDay}`
  const appNo = `APP2025${appMonth}${appDay}${String(r.appNoIdx).padStart(3, '0')}`
  const lcNo = r.statusIdx < 2 ? '' : `09970004916100${r.lcNoIdx}`
  const status = STATUSES[r.statusIdx % STATUSES.length] ?? '待經辦審核'
  const pendingApprover = status === '已開立' || status === '已拒絕' ? '' : APPROVERS[r.approverIdx % APPROVERS.length] ?? ''

  return {
    seqNo: r.seqNo,
    appNo,
    lcNo,
    lcType: (r.lcTypeIdx === 0 ? 'sight' : 'usance') as LcTypeOption,
    applicant: APPLICANTS[r.applicantIdx % APPLICANTS.length] ?? '',
    issuingBank: BANKS[r.bankIdx % BANKS.length] ?? '',
    applicationDate,
    issueDate: lcNo ? issueDate : '',
    totalAmount: r.totalAmount * 1000,
    beneficiary: BENEFICIARIES[r.beneficiaryIdx % BENEFICIARIES.length] ?? '',
    status,
    pendingApprover,
    lcFeeReceipt: r.lcFeeReceipt,
    depositReceipt: r.depositReceipt,
    cashPaySlip: r.cashPaySlip,
    acceptanceFeeReceipt: r.acceptanceFeeReceipt,
    transferVoucher: r.transferVoucher,
    eBankFeeReceipt: r.eBankFeeReceipt,
  }
})

function filterItems (query: Partial<QueryFormPayload>): ListItem[] {
  let items = [...mockItems]

  if (query.queryMode === 'lcNo' && query.lcNo?.trim()) {
    return items.filter(item => item.lcNo.includes(query.lcNo!.trim()))
  }

  if (query.queryMode === 'lcAppNo' && query.lcAppNo?.trim()) {
    return items.filter(item => item.appNo.includes(query.lcAppNo!.trim()))
  }

  if (query.queryMode === 'criteria') {
    if (query.applicantTaxId?.trim()) {
      items = items.filter(item => item.applicant.includes(query.applicantTaxId!.trim()))
    }

    if (query.beneficiaryTaxId?.trim()) {
      items = items.filter(item => item.beneficiary.includes(query.beneficiaryTaxId!.trim()))
    }

    if (query.issuingBank?.trim()) {
      items = items.filter(item => item.issuingBank === query.issuingBank!.trim())
    }

    if (query.lcStatus?.length) {
      const statusMap: Record<string, string> = {
        pendingOperator: '待經辦審核',
        pendingManager: '待主管審核',
        issued: '已開立',
        rejected: '已拒絕',
      }
      const labelSet = new Set(query.lcStatus.map(s => statusMap[s]))
      items = items.filter(item => labelSet.has(item.status))
    }

    if (query.lcType?.length) {
      items = items.filter(item => query.lcType!.includes(item.lcType))
    }

    if (query.issueDateStart?.trim()) {
      const start = new Date(query.issueDateStart.trim())
      items = items.filter(item => !item.applicationDate || new Date(item.applicationDate) >= start)
    }

    if (query.issueDateEnd?.trim()) {
      const end = new Date(query.issueDateEnd.trim())
      items = items.filter(item => !item.applicationDate || new Date(item.applicationDate) <= end)
    }
  }

  return items
}

// 查詢開狀申請書清冊
Mock.mock('/api/queryLcApp/list', 'post', (options: any): LcListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, pageSize = 10, ...query } = body

  const filtered = filterItems(query as Partial<QueryFormPayload>)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize),
    summary: {
      total,
      amount: filtered.reduce((sum, item) => sum + item.totalAmount, 0),
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
