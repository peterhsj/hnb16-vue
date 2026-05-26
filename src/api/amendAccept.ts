import type { ApiResponse } from './info'
import type { AmendAcceptItem } from '@/types/amendAccept'
import { api } from './axios'

export type { AmendAcceptItem } from '@/types/amendAccept'

export function getAmendAcceptList (payload: { page: number, itemsPerPage: number }) {
  return api.post<ApiResponse<AmendAcceptItem[]>>('/api/amendAccept/list', payload)
}
