import { api } from './axios'

export interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
}

export interface InfoItem {
  lcNo: string
  title: string
  content: string
  date: string
  status: boolean
}

/**
 * 查詢開狀訊息列表
 */
export function getLcAppList () {
  return api.get<ApiResponse<InfoItem[]>>('/api/info/lcApp')
}

/**
 * 標記為已讀
 * @param lcNos 要標記的信用狀號碼列表
 */
export function markLcAppRead (lcNos: string[]) {
  return api.patch('/api/info/lcApp/read', { lcNos })
}

/**
 * 刪除訊息
 * @param lcNos 要刪除的信用狀號碼列表
 */
export function deleteLcAppItems (lcNos: string[]) {
  return api.delete('/api/info/lcApp/delete', { data: { lcNos } })
}

export interface AmendItem {
  amendNo: string
  title: string
  content: string
  date: string
  status: boolean
}

export function getAmendAppList () {
  return api.get<ApiResponse<AmendItem[]>>('/api/info/amendApp')
}

export function markAmendAppRead (amendNos: string[]) {
  return api.patch('/api/info/amendApp/read', { amendNos })
}

export function deleteAmendAppItems (amendNos: string[]) {
  return api.delete('/api/info/amendApp/delete', { data: { amendNos } })
}

export interface CancelItem {
  cancelNo: string
  title: string
  content: string
  date: string
  status: boolean
}

export function getCancelAppList () {
  return api.get<ApiResponse<CancelItem[]>>('/api/info/cancelApp')
}

export function markCancelAppRead (cancelNos: string[]) {
  return api.patch('/api/info/cancelApp/read', { cancelNos })
}

export function deleteCancelAppItems (cancelNos: string[]) {
  return api.delete('/api/info/cancelApp/delete', { data: { cancelNos } })
}

export interface DraftItem {
  draftNo: string
  title: string
  content: string
  date: string
  status: boolean
}

export function getDraftAppList () {
  return api.get<ApiResponse<DraftItem[]>>('/api/info/draftApp')
}

export function markDraftAppRead (draftNos: string[]) {
  return api.patch('/api/info/draftApp/read', { draftNos })
}

export function deleteDraftAppItems (draftNos: string[]) {
  return api.delete('/api/info/draftApp/delete', { data: { draftNos } })
}
