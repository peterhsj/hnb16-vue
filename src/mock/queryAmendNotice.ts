import type { LcListResponse, LcTypeOption, ListItem, QueryFormPayload } from '@/types/queryAmendNotice'
import Mock from 'mockjs'

const BANKS = ['台北本行', '信義分行', '松山分行', '南京分行', '中山分行', '板橋分行', '新莊分行', '中和分行', '新店分行', '桃園分行', '台中分行', '高雄分行', '鳳山分行']
const STATUSES = ['待賣方回覆', '賣方未接受', '賣方已接受']
const APPLICANTS = ['台灣製造股份有限公司', '中部鋼鐵股份有限公司', '東方貿易股份有限公司', '信義科技股份有限公司', '南京工業股份有限公司', '北部物流股份有限公司', '桃園機械股份有限公司', '新竹半導體股份有限公司']
const BENEFICIARIES = ['南部食品股份有限公司', '西部紡織股份有限公司', '松山電子股份有限公司', '嘉義農產股份有限公司', '台南化工股份有限公司', '中壢包裝股份有限公司', '新莊五金股份有限公司', '彰化紙業股份有限公司']

const rawItems = Mock.mock({
  'list|15': [{
    'seqNo|+1': 1,
    'noticeNoIdx|0-99999': 1,
    'lcNoIdx|860-874': 860,
    'lcTypeIdx|0-1': 0,
    'applicantIdx|0-7': 0,
    'bankIdx|0-12': 0,
    'issueDateMonth|1-6': 3,
    'issueDateDay|1-28': 10,
    'statusIdx|0-2': 0,
    'beneficiaryIdx|0-7': 0,
  }],
}).list as any[]

const mockItems: ListItem[] = rawItems.map(r => {
  const month = String(r.issueDateMonth).padStart(2, '0')
  const day = String(r.issueDateDay).padStart(2, '0')
  const issueDate = `2025/${month}/${day}`
  const amendNoticeNo = `AMD2025${month}${day}${String(r.noticeNoIdx).padStart(3, '0')}`
  const lcNo = `09970004916100${r.lcNoIdx}`

  return {
    seqNo: r.seqNo,
    amendNoticeNo,
    lcNo,
    lcType: (r.lcTypeIdx === 0 ? 'sight' : 'usance') as LcTypeOption,
    issueDate,
    applicant: APPLICANTS[r.applicantIdx % APPLICANTS.length] ?? '',
    beneficiary: BENEFICIARIES[r.beneficiaryIdx % BENEFICIARIES.length] ?? '',
    issuingBank: BANKS[r.bankIdx % BANKS.length] ?? '',
    status: STATUSES[r.statusIdx % STATUSES.length] ?? '待賣方回覆',
  }
})

function filterItems (query: Partial<QueryFormPayload>): ListItem[] {
  let items = [...mockItems]

  if (query.queryMode === 'lcNo' && query.lcNo?.trim()) {
    return items.filter(item => item.lcNo.includes(query.lcNo!.trim()))
  }

  if (query.queryMode === 'lcAppNo' && query.lcAppNo?.trim()) {
    return items.filter(item => item.amendNoticeNo.includes(query.lcAppNo!.trim()))
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
        pendingOperator: '待賣方回覆',
        rejected: '賣方未接受',
        issued: '賣方已接受',
      }
      const labelSet = new Set(query.lcStatus.map(s => statusMap[s]))
      items = items.filter(item => labelSet.has(item.status))
    }

    if (query.lcType?.length) {
      items = items.filter(item => query.lcType!.includes(item.lcType))
    }

    if (query.issueDateStart?.trim()) {
      const start = new Date(query.issueDateStart.trim())
      items = items.filter(item => !item.issueDate || new Date(item.issueDate) >= start)
    }

    if (query.issueDateEnd?.trim()) {
      const end = new Date(query.issueDateEnd.trim())
      items = items.filter(item => !item.issueDate || new Date(item.issueDate) <= end)
    }
  }

  return items
}

// 查詢信用狀修改通知書清冊
Mock.mock('/api/queryAmendNotice/list', 'post', (options: any): LcListResponse => {
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
      amount: 0,
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
