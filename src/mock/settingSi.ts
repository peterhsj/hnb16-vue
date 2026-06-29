import type { ListItem, ListResponse } from '@/types/settingSi'
import Mock from 'mockjs'

const TAXIDS = ['12345678', '87654321', '11223344', '44332211', '56789012']
const COMPANYS = ['網際股份有限公司', '春源鋼鐵股份有限公司', '台塑企業股份有限公司', '華南銀行股份有限公司', '中華電信股份有限公司']

const mockItems: ListItem[] = Array.from({ length: 5 }, (_, i) => ({
  companyName: COMPANYS[i % COMPANYS.length]!,
  taxId: TAXIDS[i % TAXIDS.length]!,
}))

// 查詢台塑網通訊傳輸排程檢視
Mock.mock('/api/settingSi/list', 'post', (): ListResponse => {
  return {
    items: mockItems,
    summary: {
      total: mockItems.length,
    },
  }
})
