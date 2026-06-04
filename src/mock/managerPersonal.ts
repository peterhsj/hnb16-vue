import type { ListItem, ListResponse } from '@/types/managerPersonal'
import Mock from 'mockjs'

const BRANCHES = ['台北分行']
const GROUPS = ['1']

function generateMockItems (count = 10): ListItem[] {
  const items: ListItem[] = []

  for (let i = 1; i <= count; i++) {
    const Random = Mock.Random

    items.push({
      senNo: `SEN${String(i).padStart(5, '0')}`,
      branch: Random.pick(BRANCHES),
      isApp: Random.boolean(),
      isNotify: Random.boolean(),
      reviewGroup: Random.pick(GROUPS),
    })
  }

  return items
}

const mockLcItems: ListItem[] = generateMockItems(1)

Mock.mock('/api/managerPersonal/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')

  return {
    items: mockLcItems,
    summary: { total: mockLcItems.length, amount: 0 },
    page: 1,
    pageSize: mockLcItems.length,
    totalPages: 1,
  }
})
