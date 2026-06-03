import type { ListItem, ListResponse } from '@/types/setCustomerBranch'
import Mock from 'mockjs'

const BRANCHES = ['7007 台北分行', '7008 台中分行', '7009 高雄分行', '7010 新竹分行', '7011 桃園分行', '7012 台南分行', '7013 嘉義分行', '7014 屏東分行']
const APPLICANTS = ['30414175 中國鋼鐵股份有限公司', '07838854 中鴻鋼鐵股份有限公司', '96971313 中鋼鋁業股份有限公司', '75460005 唐榮鐵工廠股份有限公司']
const CHANGE_TYPES = ['變更憑證序號']

// 動態生成 mock 數據
function generateMockItems (count = 10): ListItem[] {
  const items: ListItem[] = []

  for (let i = 1; i <= count; i++) {
    const Random = Mock.Random
    const originalBranch = Random.pick(BRANCHES)
    let newBranch = Random.pick(BRANCHES)
    // 確保新分行不等於原分行
    while (newBranch === originalBranch) {
      newBranch = Random.pick(BRANCHES)
    }

    items.push({
      senNo: String(i),
      companyName: Random.pick(APPLICANTS),
      certificateNo: '4F6025B396703387944A6345D30 4F6025B396703387944A6345D30 1211DF465465SD54564V153154F 465465VC5645V4544V318C7V778',
      originalBranch,
      newBranch,
      changeType: Random.pick(CHANGE_TYPES),
    })
  }

  return items
}

const mockLcItems: ListItem[] = generateMockItems(5)

Mock.mock('/api/setCustomerBranch/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')

  return {
    items: mockLcItems,
    summary: { total: mockLcItems.length, amount: 0 },
    page: 1,
    pageSize: mockLcItems.length,
    totalPages: 1,
  }
})
