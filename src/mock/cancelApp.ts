import type { CancelAppItem } from '@/types/cancelApp'
import Mock from 'mockjs'

const cancelAppItems: CancelAppItem[] = [
  { lcNo: 'CDSD116000001', issuingBank: '華南銀行台北分行', issueDate: '2026/01/05', totalAmount: 5000000, availableBalance: 4500000, beneficiaryTaxId: '12345678', status: '未到期' },
  { lcNo: 'CDSD116000002', issuingBank: '華南銀行中正分行', issueDate: '2026/01/08', totalAmount: 3200000, availableBalance: 3200000, beneficiaryTaxId: '23456789', status: '未到期' },
  { lcNo: 'CDSD116000003', issuingBank: '華南銀行信義分行', issueDate: '2026/01/12', totalAmount: 8500000, availableBalance: 7000000, beneficiaryTaxId: '34567890', status: '未到期' },
  { lcNo: 'CDSD116000004', issuingBank: '華南銀行松山分行', issueDate: '2026/01/15', totalAmount: 1200000, availableBalance: 1200000, beneficiaryTaxId: '45678901', status: '已到期' },
  { lcNo: 'CDSD116000005', issuingBank: '華南銀行內湖分行', issueDate: '2026/01/18', totalAmount: 6700000, availableBalance: 5000000, beneficiaryTaxId: '56789012', status: '未到期' },
  { lcNo: 'CDSD116000006', issuingBank: '華南銀行南港分行', issueDate: '2026/01/22', totalAmount: 2300000, availableBalance: 2300000, beneficiaryTaxId: '67890123', status: '未到期' },
  { lcNo: 'CDSD116000007', issuingBank: '華南銀行新竹分行', issueDate: '2026/01/25', totalAmount: 9100000, availableBalance: 8800000, beneficiaryTaxId: '78901234', status: '已到期' },
  { lcNo: 'CDSD116000008', issuingBank: '華南銀行台中分行', issueDate: '2026/01/28', totalAmount: 4400000, availableBalance: 4000000, beneficiaryTaxId: '89012345', status: '未到期' },
  { lcNo: 'CDSD116000009', issuingBank: '華南銀行高雄分行', issueDate: '2026/02/02', totalAmount: 7200000, availableBalance: 6500000, beneficiaryTaxId: '90123456', status: '未到期' },
  { lcNo: 'CDSD116000010', issuingBank: '華南銀行板橋分行', issueDate: '2026/02/05', totalAmount: 1800000, availableBalance: 1800000, beneficiaryTaxId: '01234567', status: '已到期' },
  { lcNo: 'CDSD116000011', issuingBank: '華南銀行三重分行', issueDate: '2026/02/08', totalAmount: 3600000, availableBalance: 3200000, beneficiaryTaxId: '11234567', status: '未到期' },
  { lcNo: 'CDSD116000012', issuingBank: '華南銀行桃園分行', issueDate: '2026/02/11', totalAmount: 5500000, availableBalance: 5500000, beneficiaryTaxId: '22345678', status: '未到期' },
  { lcNo: 'CDSD116000013', issuingBank: '華南銀行中壢分行', issueDate: '2026/02/14', totalAmount: 8000000, availableBalance: 7200000, beneficiaryTaxId: '33456789', status: '已到期' },
  { lcNo: 'CDSD116000014', issuingBank: '華南銀行新莊分行', issueDate: '2026/02/17', totalAmount: 2700000, availableBalance: 2700000, beneficiaryTaxId: '44567890', status: '未到期' },
  { lcNo: 'CDSD116000015', issuingBank: '華南銀行土城分行', issueDate: '2026/02/20', totalAmount: 6100000, availableBalance: 5800000, beneficiaryTaxId: '55678901', status: '未到期' },
]

Mock.mock('/api/cancelApp/lcList', 'post', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { page = 1, pageSize = 10, lcNo, beneficiaryTaxId, lcStatus } = body

  let filtered = [...cancelAppItems]

  if (lcNo) {
    filtered = filtered.filter(item => item.lcNo.includes(lcNo))
  }
  if (beneficiaryTaxId) {
    filtered = filtered.filter(item => item.beneficiaryTaxId.includes(beneficiaryTaxId))
  }
  if (lcStatus) {
    const label = lcStatus === 'expired' ? '已到期' : '未到期'
    filtered = filtered.filter(item => item.status === label)
  }

  const total = filtered.length
  const amount = filtered.reduce((sum, item) => sum + item.availableBalance, 0)
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return {
    items,
    summary: { total, amount },
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
})
