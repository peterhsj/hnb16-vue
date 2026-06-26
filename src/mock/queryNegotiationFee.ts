import type { ListItem, ListResponse } from '@/types/queryNegotiationFee'
import Mock from 'mockjs'

const BANKS = ['707', '800', '120', '123', '523', '852', '963', '852']
const COMPANY_NAMES = ['泰西企業股份有限公司', '泰東企業股份有限公司', '泰南企業股份有限公司', '泰北企業股份有限公司', '優勢股份有限公司', '優良股份有限公司', '優質股份有限公司', '優越股份有限公司']
const REASONS = ['申請總行核准', '本行授信戶']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  issueDate: Mock.Random.date('yyyy/MM/dd'),
  issuingBank: BANKS[i % BANKS.length]!,
  applicant: COMPANY_NAMES[i % COMPANY_NAMES.length]!,
  draftBank: BANKS[i % BANKS.length]!,
  beneficiary: COMPANY_NAMES[i % COMPANY_NAMES.length]!,
  lcNumber: `LC${Mock.Random.integer(0, 1_000_000_000_000)}`,
  draftAmount: Mock.Random.integer(0, 1_000_000),
  accountNumber: `${Mock.Random.integer(0, 1_000_000_000)}`,
  draftFee: Mock.Random.integer(0, 1000),
  draftFeeDiscountReason: REASONS[i % REASONS.length]!,
}))

// 查詢未結案信用狀額度與保證金清冊
Mock.mock('/api/queryNegotiationFee/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
  }
})
