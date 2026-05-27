export interface PagedResult<T> {
  data: T[]
  total: number
  message?: string
}

export interface ApiResult<T> {
  data: T | null
  message?: string
}

export interface PageQuery {
  pageIndex: number
  pageSize: number
}
// ── 分頁選項 ──────────────────────────────────────────────────────────────────
export interface PageOptions {
  page: number
  itemsPerPage: number
  sortBy: {
    key: string
    order?: 'asc' | 'desc'
  }[]
}

export type LcTypeOption = 'sight' | 'usance' // 即期 / 遠期
