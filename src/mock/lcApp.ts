import type { LcAppItem } from '@/api/lcApp'
import Mock from 'mockjs'

// 分頁 helper
function paginate<T> (items: T[], options: any): { data: T[], total: number } {
  const queryString = options.url.includes('?') ? options.url.split('?')[1] : ''
  const params = new URLSearchParams(queryString)
  const page = Math.max(1, Number.parseInt(params.get('page') || '1'))
  const itemsPerPage = Math.max(1, Number.parseInt(params.get('itemsPerPage') || '20'))
  const start = (page - 1) * itemsPerPage
  return {
    data: items.slice(start, start + itemsPerPage),
    total: items.length,
  }
}

const lcAppItems: LcAppItem[] = [
  { appNo: 'APP2026001', lcNo: 'CDSD116000001', lcType: '即期', applicant: '多樂股份有限公司', notifyBank: '臺北分行', applyDate: '2026/01/10', amount: 1_500_000, beneficiary: '中國鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026002', lcNo: 'CDSD116000002', lcType: '遠期', applicant: '大同股份有限公司', notifyBank: '台中分行', applyDate: '2026/01/12', amount: 3_200_000, beneficiary: '中鴻鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026003', lcNo: 'CDSD116000003', lcType: '即期', applicant: '聯合貿易股份有限公司', notifyBank: '高雄分行', applyDate: '2026/01/15', amount: 800_000, beneficiary: '中鋼鋁業股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026004', lcNo: 'CDSD116000004', lcType: '遠期', applicant: '宏碁股份有限公司', notifyBank: '新竹分行', applyDate: '2026/01/18', amount: 5_000_000, beneficiary: '唐榮鐵工廠股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026005', lcNo: 'CDSD116000005', lcType: '即期', applicant: '台灣電子股份有限公司', notifyBank: '臺北分行', applyDate: '2026/01/20', amount: 2_100_000, beneficiary: '中國鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026006', lcNo: 'CDSD116000006', lcType: '遠期', applicant: '鴻海集團股份有限公司', notifyBank: '板橋分行', applyDate: '2026/01/22', amount: 9_800_000, beneficiary: '中鴻鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026007', lcNo: 'CDSD116000007', lcType: '即期', applicant: '南山人壽股份有限公司', notifyBank: '信義分行', applyDate: '2026/01/25', amount: 1_200_000, beneficiary: '中鋼鋁業股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026008', lcNo: 'CDSD116000008', lcType: '遠期', applicant: '富邦金控股份有限公司', notifyBank: '松山分行', applyDate: '2026/01/28', amount: 4_500_000, beneficiary: '唐榮鐵工廠股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026009', lcNo: 'CDSD116000009', lcType: '即期', applicant: '中華電信股份有限公司', notifyBank: '中和分行', applyDate: '2026/02/01', amount: 3_300_000, beneficiary: '中國鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026010', lcNo: 'CDSD116000010', lcType: '遠期', applicant: '台積電股份有限公司', notifyBank: '新竹科學園區分行', applyDate: '2026/02/03', amount: 15_000_000, beneficiary: '中鴻鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026011', lcNo: 'CDSD116000011', lcType: '即期', applicant: '聯發科技股份有限公司', notifyBank: '新竹分行', applyDate: '2026/02/05', amount: 6_700_000, beneficiary: '中鋼鋁業股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026012', lcNo: 'CDSD116000012', lcType: '遠期', applicant: '多樂股份有限公司', notifyBank: '臺北分行', applyDate: '2026/02/08', amount: 2_200_000, beneficiary: '唐榮鐵工廠股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026013', lcNo: 'CDSD116000013', lcType: '即期', applicant: '大同股份有限公司', notifyBank: '台中分行', applyDate: '2026/02/10', amount: 1_800_000, beneficiary: '中國鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026014', lcNo: 'CDSD116000014', lcType: '遠期', applicant: '聯合貿易股份有限公司', notifyBank: '高雄分行', applyDate: '2026/02/12', amount: 4_100_000, beneficiary: '中鴻鋼鐵股份有限公司', status: '待主管審核' },
  { appNo: 'APP2026015', lcNo: 'CDSD116000015', lcType: '即期', applicant: '宏碁股份有限公司', notifyBank: '新竹分行', applyDate: '2026/02/15', amount: 3_600_000, beneficiary: '中鋼鋁業股份有限公司', status: '待主管審核' },
]

// 查詢開狀申請書列表
Mock.mock(/\/api\/lcApp\/list(\?.*)?$/, 'get', (options: any) => {
  const { data, total } = paginate(lcAppItems, options)
  return {
    code: 200,
    message: 'success',
    data,
    total,
    amount: data.reduce((sum, item) => sum + (item.amount || 0), 0),
  }
})
