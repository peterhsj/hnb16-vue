export interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
}

// ── 分頁選項 ──────────────────────────────────────────────────────────────────
export interface PagedResult<T> {
  data: T[]
  total: number
  message?: string
}
export interface PageQuery {
  pageIndex: number
  pageSize: number
}
export interface PageOptions {
  page: number
  itemsPerPage: number
  sortBy: {
    key: string
    order?: 'asc' | 'desc'
  }[]
}
export interface SelectItem {
  readonly title: string
  readonly value: string
}

export type LcTypeOption = 'sight' | 'usance' // 即期 / 遠期
