import type { ListItem, ListResponse } from '@/types/setBeneficiary'
import Mock from 'mockjs'

const COMPANYS = ['中國鋼鐵股份有限公司', '中鴻鋼鐵股份有限公司', '中鋼鋁業股份有限公司', '唐榮鐵工廠股份有限公司']
const COMPANYIDS = ['30414175', '07838854', '96971313', '75460005']
const TITLES = ['董事長', '總經理', '副總經理', '協理', '經理', '專員']
const NAMES = ['王大明', '李小華', '張三豐', '陳美麗', '林志玲', '劉德華']
const REVIEW_STATUS = [true, false]
const DEPARTMENTS = ['1.塑膠部，2.台麗郎部，4.電石部，5.化學部，6.塑膠原料部，7.塑膠製品部', '1.鋁業事業部，貿易事業部', '1.財務部']
const ADDRESS = ['台北市信義區松仁路100號', '台中市西屯區台灣大道三段200號', '高雄市前鎮區中華五路789號', '新竹市東區光復路一段50號', '桃園市桃園區中正路300號', '台南市東區大學路一段150號', '嘉義市西區忠孝路200號', '屏東市自由路100號']
const PHONE = ['02-1234-5678', '04-5678-1234', '07-9876-5432', '03-2468-1357', '03-1357-2468', '06-2468-1357', '05-9876-5432', '08-1234-5678']
const EMAIL = ['example1@example.com', 'example2@example.com', 'example3@example.com', 'example4@example.com', 'example5@example.com']

// 動態生成 mock 數據
function generateMockItems (count = 10): ListItem[] {
  const items: ListItem[] = []

  for (let i = 1; i <= count; i++) {
    const Random = Mock.Random

    items.push({
      senNo: String(i),
      companyTaxId: Random.pick(COMPANYIDS),
      companyName: Random.pick(COMPANYS),
      responsiblePersonName: Random.pick(NAMES),
      responsiblePersonTitle: Random.pick(TITLES),
      registeredAddress: Random.pick(ADDRESS),
      contactPhone: Random.pick(PHONE),
      email: Random.pick(EMAIL),
      beneficiaryDepartment: Random.pick(DEPARTMENTS),
      reviewStatus: Random.pick(REVIEW_STATUS),
    })
  }

  return items
}

const mockLcItems: ListItem[] = generateMockItems(5)

Mock.mock('/api/setBeneficiary/list', 'post', (options: any): ListResponse => {
  const body = JSON.parse(options.body ?? '{}')

  return {
    items: mockLcItems,
    summary: { total: mockLcItems.length, amount: 0 },
    page: 1,
    pageSize: mockLcItems.length,
    totalPages: 1,
  }
})
