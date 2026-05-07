import type { Ref } from 'vue'
import { nextTick } from 'vue'
import { useUserStore } from '@/stores/user'

export interface MessageConfig {
  messageTitle: Ref<string>
  message: Ref<string>
  messageStatus: Ref<string>
  isConfirmBtn: Ref<boolean>
  messageDialog: Ref<boolean>
}

/**
 * API 錯誤處理 composable
 * 統一處理 401, 404, 500 等常見錯誤
 */
export function useApiErrorHandler () {
  const userStore = useUserStore()

  // 防止無限遞迴的重試標記
  let isRefreshing = false

  /**
   * 處理 API 錯誤
   * @param error - Axios 錯誤物件
   * @param retryFn - 重試函數（用於 401 錯誤後重新執行 API 請求）
   * @param messageConfig - 訊息對話框設定物件
   */
  async function handleApiError (
    error: any,
    retryFn?: () => Promise<void>,
    messageConfig?: MessageConfig,
  ): Promise<void> {
    const res = error?.response
    const { status, data } = res || {}
    const requestUrl = error?.config?.url || ''

    switch (status) {
      case 401: {
        // 如果是 refresh token API 本身返回 401，直接登出，不再重試
        if (requestUrl.includes('/api/auth/refresh')) {
          console.error('Refresh Token 已過期，請重新登入')
          if (messageConfig) {
            messageConfig.messageTitle.value = '訊息通知'
            messageConfig.message.value = '登入已過期，請重新登入'
            messageConfig.messageStatus.value = 'alert'
            messageConfig.isConfirmBtn.value = false
            messageConfig.messageDialog.value = true
          }
          userStore.signOut()
          break
        }

        // 防止重複刷新
        if (isRefreshing) {
          console.warn('Token 刷新進行中，跳過重複請求')
          break
        }

        try {
          isRefreshing = true
          console.log('Token 逾時，開始刷新...')

          // Token 逾時重刷
          console.log('Token 執行刷新')
          await userStore.refreshToken()
          console.log('Token 已刷新，新 token:', userStore.userInfo.token.slice(0, 20) + '...')

          // 等待 Vue 響應式系統更新完成
          await nextTick()
          console.log('響應式更新完成')

          // 重新載入資料
          if (retryFn) {
            console.log('正在重試 API 請求...')
            await retryFn()
            console.log('API 重試完成')
            isRefreshing = false
          }
        } catch (refreshError) {
          console.error('Token 刷新失敗:', refreshError)
          // 刷新失敗，登出並跳轉到登入頁
          if (messageConfig) {
            messageConfig.messageTitle.value = '訊息通知'
            messageConfig.message.value = '登入已過期，請重新登入'
            messageConfig.messageStatus.value = 'alert'
            messageConfig.isConfirmBtn.value = false
            messageConfig.messageDialog.value = true
          }
          userStore.signOut()
        } finally {
          isRefreshing = false
        }
        break
      }
      case 404: {
        if (messageConfig) {
          messageConfig.messageTitle.value = '訊息通知'
          messageConfig.message.value = data?.message || '請求資源不存在'
          messageConfig.messageStatus.value = 'alert'
          messageConfig.isConfirmBtn.value = false
          messageConfig.messageDialog.value = true
        }
        break
      }
      case 500: {
        if (messageConfig) {
          messageConfig.messageTitle.value = '訊息通知'
          messageConfig.message.value = '無法連接到伺服器，請稍後再試。'
          messageConfig.messageStatus.value = 'alert'
          messageConfig.isConfirmBtn.value = false
          messageConfig.messageDialog.value = true
        }
        break
      }
      default: {
        // 其他未處理的錯誤
        if (messageConfig && status) {
          messageConfig.messageTitle.value = '訊息通知'
          messageConfig.message.value = data?.message || `發生錯誤 (${status})`
          messageConfig.messageStatus.value = 'alert'
          messageConfig.isConfirmBtn.value = false
          messageConfig.messageDialog.value = true
        }
        break
      }
    }
  }

  return { handleApiError }
}
