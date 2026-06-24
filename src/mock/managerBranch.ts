import type { ListItem, ListResponse } from '@/types/managerBranch'
import Mock from 'mockjs'

const BRANCH_NAMES = ['大稻埕分行', '城內分行', '總行國外營業部', '儲蓄分行', '總行營業部']
const BRANCH_CODES = ['0081005', '0081016', '0081027', '0081038', '0081049']
const ADDRESSES = ['台北市大同區重慶南路一段38號', '台北市中正區重慶南路一段38號', '台北市信義區重慶南路一段38號', '台北市松山區重慶南路一段38號', '台北市南港區重慶南路一段38號']
const PHONES = ['02-12345678', '02-23456789', '02-34567890', '02-45678901', '02-56789012']
const CONTACT_PERSONS = ['張三豐', '李四端', '王五人', '趙六甲', '孫七七', '無']

const mockItems: ListItem[] = Mock.mock({
  'list|5': [{
    'id|+1': 1,
    'branchName': () => Mock.Random.pick(BRANCH_NAMES),
    'branchCode': () => Mock.Random.pick(BRANCH_CODES),
    'address': () => Mock.Random.pick(ADDRESSES),
    'phone': () => Mock.Random.pick(PHONES),
    'contactPerson': () => Mock.Random.pick(CONTACT_PERSONS),
  }],
}).list.map((item: any) => {
  return {
    branchId: `br-${item.id}`,
    branchName: item.branchName,
    branchCode: item.branchCode,
    address: item.address ,
    phone: item.phone,
    contactPerson: item.contactPerson,
  }
})

// 查詢分行清冊
Mock.mock('/api/managerBranch/list', 'post', (options: any): ListResponse => {
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
