import type { ListItem, ListResponse } from '@/types/queryLcFeeDetail'
import Mock from 'mockjs'

const BRANCH_CODES = ['707', '800', '120', '123', '523', '852', '963', '852']
const BRANCH_NAMES = ['台北分行', '高雄分行', '台中分行', '台南分行', '新竹分行', '桃園分行', '嘉義分行', '營業部']
const LC_SOURCES = ['臨櫃', 'CDS']
const COMPANYS = ['泰西企業股份有限公司', '台塑石化股份有限公司', '中華電信股份有限公司', '台灣積體電路製造股份有限公司', '聯華電子股份有限公司', '台灣中油股份有限公司', '台灣自來水股份有限公司', '台灣糖業股份有限公司']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  branchCode: BRANCH_CODES[i % BRANCH_CODES.length]!,
  branchName: BRANCH_NAMES[i % BRANCH_NAMES.length]!,
  lcSource: LC_SOURCES[i % LC_SOURCES.length]!,
  applicant: COMPANYS[i % COMPANYS.length]!,
  beneficiary: COMPANYS[(i + 1) % COMPANYS.length]!,
  issueCount: Mock.Random.integer(0, 10),
  issueFeeTotal: Mock.Random.integer(0, 1_000_000),
  amendCount: Mock.Random.integer(0, 10),
  amendFeeTotal: Mock.Random.integer(0, 1_000_000),
  acceptanceCount: Mock.Random.integer(0, 10),
  acceptanceFeeTotal: Mock.Random.integer(0, 1_000_000),
  discountCount: Mock.Random.integer(0, 10),
  discountFeeTotal: Mock.Random.integer(0, 1_000_000),
}))

// 查詢未結案信用狀額度與保證金清冊
Mock.mock('/api/queryLcFeeDetail/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
  }
})
