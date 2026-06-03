import type { ListItem, ListResponse } from '@/types/rePromptDraft'
import Mock from 'mockjs'

const STATUSES = ['待經辦審核', '待主管審核', '已核准', '已拒絕']
const APPLICANTS = ['台灣製造股份有限公司', '中部鋼鐵股份有限公司', '東方貿易股份有限公司', '信義科技股份有限公司', '南京工業股份有限公司', '北部物流股份有限公司', '桃園機械股份有限公司', '新竹半導體股份有限公司']

// 動態生成 mock 數據
function generateMockItems (count = 10): ListItem[] {
  const items: ListItem[] = []

  for (let i = 1; i <= count; i++) {
    const Random = Mock.Random
    const lcBalanceAmount = Random.integer(100_000, 1_000_000)
    const issuingAmount = Random.integer(50_000, lcBalanceAmount)

    items.push({
      senNo: String(i),
      isAccepted: null, // Random.boolean(),
      draftNo: `P114${String(Random.integer(100_000, 999_999))}`,
      applicantName: Random.pick(APPLICANTS),
      buyerTaxId: String(Random.integer(10_000_000, 99_999_999)),
      lcNo: `${Random.integer(100_000_000_000_000, 999_999_999_999_999)}`,
      lcBalanceAmount,
      lcExpiryDate: Random.date('yyyy/MM/dd'),
      issueDate: Random.date('yyyy/MM/dd'),
      issuingAmount,
      status: Random.pick(STATUSES),
    })
  }

  return items
}

const mockLcItems: ListItem[] = generateMockItems(15)

Mock.mock('/api/rePromptDraft/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')

  const totalDebit = mockLcItems.reduce((s, r) => s + (r.issuingAmount ?? 0), 0)

  return {
    items: mockLcItems,
    summary: { total: mockLcItems.length, amount: totalDebit },
    page: 1,
    pageSize: mockLcItems.length,
    totalPages: 1,
  }
})
