// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/axios'
import { useMessage } from '@/composables/useMessage'
import router from '@/router'

const msg = useMessage()
// const router = useRouter()

interface UserInfo {
  userId: number | null
  account: string
  name: string
  email: string
  roleId: number | null
  roleName: string
  categoryId: number | null
  categoryName: string
  companyId: number | null
  companyName: string
  token: string
  refreshToken: string
  expiresIn: string
  loginTime: string
}
export const useUserStore = defineStore('user', () => {
  const sessionKey = 'userSession'
  const userInfo = ref<UserInfo>({
    userId: null,
    account: '',
    name: '',
    email: '',
    roleId: null,
    roleName: '',
    categoryId: null,
    categoryName: '',
    companyId: null,
    companyName: '',
    token: '',
    refreshToken: '',
    expiresIn: '',
    loginTime: '',
  })
  const isAuthenticated = ref<boolean>(false)

  const restoreSession = () => {
    const raw = localStorage.getItem(sessionKey)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as UserInfo
      userInfo.value = parsed
      isAuthenticated.value = true
    } catch {
      localStorage.removeItem(sessionKey)
    }
  }

  const signIn = (data: UserInfo) => {
    userInfo.value = data
    isAuthenticated.value = true
    localStorage.setItem(sessionKey, JSON.stringify(data))
  }

  const signOut = () => {
    userInfo.value = {
      userId: null,
      account: '',
      name: '',
      email: '',
      roleId: null,
      roleName: '',
      categoryId: null,
      categoryName: '',
      companyId: null,
      companyName: '',
      token: '',
      refreshToken: '',
      expiresIn: '',
      loginTime: '',
    }
    isAuthenticated.value = false
    localStorage.removeItem(sessionKey)
  }

  // 一件變更登入狀態的函數（用於測試）
  const toggleAuth = () => {
    const raw = localStorage.getItem(sessionKey)
    if (!raw) {
      return
    }

    const parsed = JSON.parse(raw) as UserInfo
    userInfo.value = {
      ...parsed,
      token: 'mocked_token',
      // refreshToken: 'mocked_refreshToken',
      // expiresIn: '10',
    }
  }

  // 重新取得 Token
  interface ApiResponse<T = any> {
    code: number
    data?: T
  }

  // 檢查 token 是否過期
  const isTokenExpired = (): boolean => {
    const { loginTime, expiresIn } = userInfo.value

    if (!loginTime || !expiresIn) {
      return true
    }

    const loginTimestamp = new Date(loginTime).getTime()
    const expiresInMs = Number.parseInt(expiresIn) * 1000
    const currentTime = Date.now()

    // 如果當前時間超過登入時間 + 過期時間，則 token 已過期
    const isExpired = currentTime > (loginTimestamp + expiresInMs)

    console.log('Token 過期檢查:', {
      loginTime,
      expiresIn: `${expiresIn}秒`,
      loginTimestamp,
      currentTime,
      expiresAt: new Date(loginTimestamp + expiresInMs).toLocaleString(),
      isExpired,
    })

    return isExpired
  }

  const refreshToken = async (): Promise<void> => {
    // const userInfo = JSON.parse(localStorage.getItem('userSession') || '{}')
    // console.log('userInfo:', userInfo)
    const { refreshToken } = userInfo.value

    if (!refreshToken) {
      router.push('/login')
      return
    }

    const payload = { refreshToken }
    const apiUrl = '/api/auth/refresh'
    try {
      const res = await api.post<ApiResponse>(apiUrl, payload)
      const { status, data } = res
      const { data: resData } = data
      // console.log('refreshToken response:', data)
      if (status === 200) {
        const { token, expiresIn, refreshTime, refreshToken: newRefreshToken } = resData
        // 更新 userSession 中的 token 和 refreshToken
        const updatedUserInfo = {
          ...userInfo.value,
          expiresIn,
          loginTime: refreshTime, // 更新登入時間為刷新時間
          token,
          refreshToken: newRefreshToken,
        }

        // 同時更新 userInfo.value 和 localStorage
        userInfo.value = updatedUserInfo
        localStorage.setItem('userSession', JSON.stringify(updatedUserInfo))

        console.log('Token 已更新:', {
          newToken: token.slice(0, 20) + '...',
          expiresIn,
          refreshTime,
        })
      }
    } catch (error: any) {
      console.error('Failed to refresh token:', error)
      msg.error('連線逾時，請重新登入')
      signOut()
      router.push('/login')
      return
    }
  }

  restoreSession()

  return {
    userInfo,
    isAuthenticated,
    signIn,
    signOut,
    restoreSession,
    refreshToken,
    isTokenExpired,
    toggleAuth,
  }
})
