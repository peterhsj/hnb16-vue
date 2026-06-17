import type { LcListResponse, ListItem, QueryFormPayload } from '@/types/queryDraft'
import Mock from 'mockjs'

const APPLICANTS = ['台灣製造股份有限公司', '中部鋼鐵股份有限公司', '東方貿易股份有限公司', '信義科技股份有限公司', '南京工業股份有限公司', '北部物流股份有限公司', '桃園機械股份有限公司', '新竹半導體股份有限公司']
const BENEFICIARIES = ['南部食品股份有限公司', '西部紡織股份有限公司', '松山電子股份有限公司', '嘉義農產股份有限公司', '台南化工股份有限公司', '中壢包裝股份有限公司', '新莊五金股份有限公司', '彰化紙業股份有限公司']
const STATUSES = ['已開立', '已拒絕']
const APPROVERS = ['台北本行經辦一', '信義分行主管一', '台中分行經辦二', '高雄分行主管二', '桃園分行經辦三']
const COMPARISON_RESULTS = ['紙本', '']

const rawItems = Mock.mock({
  'list|15': [{
    'seqNo|+1': 1,
    'draftNoIdx|0-99999': 1,
    'lcNoIdx|860-874': 860,
    'applicantIdx|0-7': 0,
    'beneficiaryIdx|0-7': 0,
    'issueDateDay|1-28': 10,
    'issueDateMonth|1-6': 3,
    'validOffsetDays|180-365': 180,
    'releaseDateOffset|1-10': 3,
    'balanceRatio|30-100': 80,
    'issuingAmount|100-5000': 100,
    'statusIdx|0-3': 0,
    'approverIdx|0-4': 0,
    'comparisonIdx|0-2': 0,
    'documentDelivery|1': true,
    'remittanceAttachment|1': true,
    'cashPaySlip|1': true,
    'draftFeeReceipt|1': true,
    'acceptanceFeeReceipt|1': true,
    'transferVoucher|1': true,
    'supplementaryLcFeeReceipt|1': true,
    'supplementaryCashPaySlip|1': true,
    'supplementaryTransferVoucher|1': true,
  }],
}).list as any[]

const mockItems: ListItem[] = rawItems.map(r => {
  const issueMonth = String(r.issueDateMonth).padStart(2, '0')
  const issueDay = String(r.issueDateDay).padStart(2, '0')
  const draftIssueDate = `2025/${issueMonth}/${issueDay}`

  const releaseDay = String(Math.min(r.issueDateDay + r.releaseDateOffset, 28)).padStart(2, '0')
  const draftReleaseDate = `2025/${issueMonth}/${releaseDay}`

  const validMs = new Date(`2025/${issueMonth}/${issueDay}`).getTime() + r.validOffsetDays * 24 * 60 * 60 * 1000
  const validDateObj = new Date(validMs)
  const validDate = `${validDateObj.getFullYear()}/${String(validDateObj.getMonth() + 1).padStart(2, '0')}/${String(validDateObj.getDate()).padStart(2, '0')}`

  const lcNo = `09970004916100${r.lcNoIdx}`
  const draftNo = `DFT2025${issueMonth}${issueDay}${String(r.draftNoIdx).padStart(5, '0')}`
  const issuingAmount = r.issuingAmount * 1000
  const availableBalance = Math.round(issuingAmount * r.balanceRatio / 100)
  const status = STATUSES[r.statusIdx % STATUSES.length] ?? '待審核'
  const pendingApprover = status === '已放行' || status === '已拒絕' ? '' : APPROVERS[r.approverIdx % APPROVERS.length] ?? ''

  return {
    seqNo: r.seqNo,
    draftNo,
    applicant: APPLICANTS[r.applicantIdx % APPLICANTS.length] ?? '',
    lcNo,
    availableBalance,
    validDate,
    lcComparisonResult: COMPARISON_RESULTS[r.comparisonIdx % COMPARISON_RESULTS.length] ?? '符合',
    draftIssueDate,
    draftReleaseDate: status === '已放行' ? draftReleaseDate : '',
    issuingAmount,
    beneficiary: BENEFICIARIES[r.beneficiaryIdx % BENEFICIARIES.length] ?? '',
    status,
    pendingApprover,
    documentDelivery: r.documentDelivery,
    remittanceAttachment: r.remittanceAttachment,
    cashPaySlip: r.cashPaySlip,
    draftFeeReceipt: r.draftFeeReceipt,
    acceptanceFeeReceipt: r.acceptanceFeeReceipt,
    transferVoucher: r.transferVoucher,
    supplementaryLcFeeReceipt: r.supplementaryLcFeeReceipt,
    supplementaryCashPaySlip: r.supplementaryCashPaySlip,
    supplementaryTransferVoucher: r.supplementaryTransferVoucher,
  }
})

function filterItems (query: Partial<QueryFormPayload>): ListItem[] {
  let items = [...mockItems]

  if (query.queryMode === 'draft') {
    // 今日匯票：以 draftIssueDate 為今日（mock 固定為 2025 年資料，取第一筆日期）
    if (query.beneficiaryTaxId?.trim()) {
      items = items.filter(item => item.beneficiary.includes(query.beneficiaryTaxId!.trim()))
    }

    if (query.lcStatus?.length) {
      const statusMap: Record<string, string> = {
        pending: '待審核',
        released: '已放行',
        rejected: '已拒絕',
        processing: '處理中',
      }
      const labelSet = new Set(query.lcStatus.map(s => statusMap[s]))
      items = items.filter(item => labelSet.has(item.status))
    }

    return items
  }

  if (query.queryMode === 'lcNo' && query.lcNo?.trim()) {
    return items.filter(item => item.lcNo.includes(query.lcNo!.trim()))
  }

  if (query.queryMode === 'criteria') {
    if (query.beneficiaryTaxId?.trim()) {
      items = items.filter(item => item.beneficiary.includes(query.beneficiaryTaxId!.trim()))
    }

    if (query.issuingBank?.trim()) {
      items = items.filter(item => item.lcNo.startsWith(query.issuingBank!.trim()))
    }

    if (query.lcStatus?.length) {
      const statusMap: Record<string, string> = {
        pending: '待審核',
        released: '已放行',
        rejected: '已拒絕',
        processing: '處理中',
      }
      const labelSet = new Set(query.lcStatus.map(s => statusMap[s]))
      items = items.filter(item => labelSet.has(item.status))
    }

    if (query.lcType) {
      items = items.filter(item => item.lcNo.length > 0) // lcType 目前 ListItem 無此欄位，保留擴充用
    }

    if (query.issueDateStart?.trim()) {
      const start = new Date(query.issueDateStart.trim())
      items = items.filter(item => !item.draftIssueDate || new Date(item.draftIssueDate) >= start)
    }

    if (query.issueDateEnd?.trim()) {
      const end = new Date(query.issueDateEnd.trim())
      items = items.filter(item => !item.draftIssueDate || new Date(item.draftIssueDate) <= end)
    }
  }

  return items
}

// 查詢押匯清冊
Mock.mock('/api/queryDraft/list', 'post', (options: any): LcListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, pageSize = 10, ...query } = body

  const filtered = filterItems(query as Partial<QueryFormPayload>)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)
  const positiveItems = pageItems.filter(item => item.availableBalance > 0)

  return {
    items: pageItems,
    summary: {
      total,
      amount: filtered.reduce((sum, item) => sum + item.issuingAmount, 0),
      positiveItems: positiveItems.length,
      positiveAmount: positiveItems.reduce((sum, item) => sum + item.availableBalance, 0),
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
