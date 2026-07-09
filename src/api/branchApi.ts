import { apiRequest } from '@/services/api-service'

export interface BranchOption {
  bankCode: string
  branchName: string
  address: string
  phone: string
}

/**
 * 取得所有分行資料（用於開狀銀行下拉選單）
 */
export async function getBranches (): Promise<BranchOption[]> {
  const res = await apiRequest<BranchOption[]>('/query/branches')
  return res.data ?? []
}
