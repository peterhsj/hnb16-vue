import type { ListItem, ListResponse } from '@/types/managerBeneficiary'
import Mock from 'mockjs'

const COMP_IDS = ['75708007', '85214783', '96325898']
const COMP_NAMES = ['台灣塑膠工業股份有限公司', '台灣石油工業股份有限公司', '台灣化學工業股份有限公司']
const MANAGER_NAMES = ['李志村', '王美玲', '陳建宏']
const MANAGER_TITLES = ['經理', '副理', '主任']
const ADDRESS = ['高雄市中山三路39號', '台北市信義路100號', '台中市中港路200號']
const PHONE = ['07-1234567', '02-2345678', '04-3456789']
const EMAIL = ['example1@example.com', 'example2@example.com', 'example3@example.com']
const BENEFICIARY_DEPARTMENTS = ['事業部A', '事業部B', '事業部C']
const CONFIRM_STATUS = [true, false]

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  serNo: i + 1,
  compId: COMP_IDS[i % COMP_IDS.length]!,
  compName: COMP_NAMES[i % COMP_NAMES.length]!,
  managerName: MANAGER_NAMES[i % MANAGER_NAMES.length]!,
  managerTitle: MANAGER_TITLES[i % MANAGER_TITLES.length]!,
  address: ADDRESS[i % ADDRESS.length]!,
  phone: PHONE[i % PHONE.length]!,
  email: EMAIL[i % EMAIL.length]!,
  beneficiaryDepartment: BENEFICIARY_DEPARTMENTS[i % BENEFICIARY_DEPARTMENTS.length]!,
  confirmStatus: CONFIRM_STATUS[i % CONFIRM_STATUS.length]!,
}))

// 查詢台塑網通訊傳輸排程檢視
Mock.mock('/api/managerBeneficiary/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
  }
})
