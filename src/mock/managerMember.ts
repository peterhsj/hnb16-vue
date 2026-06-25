import type { ListItem, ListResponse } from '@/types/managerMember'
import Mock from 'mockjs'

const USER_ACCOUNTS = ['user1', '0066(David)', '0HN0581FN1(企金稽核1)', 'user4', 'supervisor(分行管理員)']
const BRANCH_NAMES = ['大稻埕分行', '城內分行', '總行國外營業部', '儲蓄分行', '總行營業部']
const BRANCH_CODES = ['0081005', '0081016', '0081027', '0081038', '0081049']
const USER_ROLES = ['總行主管', '總行經辦', '分行管理員']

const mockItems: ListItem[] = Mock.mock({
  'list|5': [{
    'id|+1': 1,
    'userAccount': () => Mock.Random.pick(USER_ACCOUNTS),
    'branchName': () => Mock.Random.pick(BRANCH_NAMES),
    'branchCode': () => Mock.Random.pick(BRANCH_CODES),
    'userRole': () => Mock.Random.pick(USER_ROLES),
  }],
}).list.map((item: any) => {
  return {
    userAccount: item.userAccount,
    branchName: item.branchName,
    branchCode: item.branchCode,
    userRole: item.userRole,
  }
})

// 查詢會員清冊
Mock.mock('/api/managerMember/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')
  const { page = 1, pageSize = 10 } = body

  // const filtered = filterItems(query as Partial<QueryFormPayload>)
  const total = mockItems.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = mockItems.slice(start, start + pageSize)

  return {
    items: pageItems,
    summary: {
      total,
    },
    page: safePage,
    pageSize,
    totalPages,
  }
})
