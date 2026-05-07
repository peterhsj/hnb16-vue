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
