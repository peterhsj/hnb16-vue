export type BeneTypeOption = 'cds' | 'fpc' | 'other'

export type AmendQueryMode = 'lcNo' | 'criteria'

export type LcStatusOption = 'expired' | 'active'

export interface BeneTypeItem {
  readonly title: string
  readonly value: BeneTypeOption
}

export interface LcStatusItem {
  readonly title: string
  readonly value: LcStatusOption
}

export interface AmendQueryFormPayload {
  beneType: BeneTypeOption | null
  queryMode: AmendQueryMode
  lcNo: string
  applicantLoanAccount: string
  beneficiaryTaxId: string
  lcStatus: LcStatusOption | null
  issueDateStart: string
  issueDateEnd: string
}

export const BENE_TYPE_ITEMS: readonly BeneTypeItem[] = [
  {
    title: 'CDS 客戶 (中鋼、中鴻、中鋁、華新麗華、東和鋼鐵)',
    value: 'cds',
  },
  {
    title: '台塑 e 化平台客戶 (台塑集團、奇美集團)',
    value: 'fpc',
  },
  {
    title: '其他客戶',
    value: 'other',
  },
] as const

export const LC_STATUS_ITEMS: readonly LcStatusItem[] = [
  { title: '已到期', value: 'expired' },
  { title: '未到期', value: 'active' },
] as const

export function createInitialAmendQueryForm (): AmendQueryFormPayload {
  return {
    beneType: null,
    queryMode: 'lcNo',
    lcNo: '',
    applicantLoanAccount: '',
    beneficiaryTaxId: '',
    lcStatus: null,
    issueDateStart: '',
    issueDateEnd: '',
  }
}
