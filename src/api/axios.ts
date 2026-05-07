import axios from 'axios'
import qs from 'qs'
import { useMessage } from '@/composables/useMessage'
import router from '@/router'

const msg = useMessage()

/**
 * Axios 實例配置
 *
 * 使用 Mock 資料的方式：
 * 1. 註解掉下方第 1 行的 baseURL
 * 2. 取消註解第 2 行的 baseURL（使用 '/'）
 * 3. 或直接關閉後端 API 服務器（Mock 會自動攔截所有請求）
 */
export const api = axios.create({
  // 方式 1：連接到後端 API 服務器（正式資料）
  // baseURL: import.meta.env.DEV ? 'http://localhost:5173' : '/api',

  // 方式 2：使用 Mock 資料（開發測試用）
  // 取消下面這行的註解，並註解上面那行，即可使用 Mock 資料
  baseURL: import.meta.env.DEV ? '/' : '/api',

  timeout: 10_000,
  withCredentials: true, // 若需要跨網域夾帶 cookie 改為 true
})

// 若常要送 x-www-form-urlencoded，可以做一個輔助方法
/**
 * repeat: a=1&a=2
 * brackets: a[]=1&a[]=2
 * indices: a[0]=1&a[1]=2
 * comma: a=1,2
 */
export function toForm (data: any, opts: any) {
  return qs.stringify(data, {
    arrayFormat: 'brackets', // 'brackets' | 'indices' | 'repeat' | 'comma'
    allowDots: false,
    encodeValuesOnly: true,
    ...opts,
  })
}

// 請求攔截：帶上 Token 等
api.interceptors.request.use(
  config => {
    // console.log(config)
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error),
)

// 回應攔截：統一錯誤處理
api.interceptors.response.use(
  res => res,
  async error => {
    // const originalRequest = error.config
    const status = error.response?.status
    const errorMessage = error.response?.data?.message || '請求失敗'

    // 處理 401 未授權錯誤
    // if (status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true

    //   try {
    //     const newToken = await refreshToken()
    //     // Token 已更新，重試原請求
    //     originalRequest.headers['Authorization'] = `Bearer ${newToken}`
    //     return api(originalRequest)
    //   } catch (refreshError) {
    //     msg.error('登入已過期，請重新登入')
    //     router.push('/login')
    //     throw refreshError
    //   }
    // }

    // 其他錯誤統一處理
    switch (status) {
      case 400: {
        msg.error(errorMessage || '請求參數錯誤')
        break
      }
      case 403: {
        msg.error('拒絕訪問')
        break
      }
      case 404: {
        msg.error('請求資源不存在')
        break
      }
      case 500: {
        msg.error('伺服器錯誤')
        break
      }
      default: {
        msg.error(errorMessage)
      }
    }

    throw error
  },
)

// interface ApiResponse<T = any> {
//   code: number
//   data?: T
// }
// 重新取得 Token
// async function refreshToken (): Promise<string | void> {
//   const userInfo = JSON.parse(localStorage.getItem('userSession') || '{}')
//   console.log('userInfo from localStorage:', userInfo)
//   const { refreshToken } = userInfo

//   if (!refreshToken) {
//     router.push('/login')
//     return
//   }

//   const payload = { refreshToken }
//   const apiUrl = '/api/auth/refresh'
//   try {
//     const res = await api.post<ApiResponse>(apiUrl, payload)
//     const { code, data } = res.data
//     console.log('refreshToken response:', data)
//     if (code === 200) {
//       const { token, expiresIn, refreshToken: newRefreshToken } = data
//       // 更新 userSession 中的 token 和 refreshToken
//       const updatedUserInfo = { ...userInfo, expiresIn, token, refreshToken: newRefreshToken }
//       localStorage.removeItem('userSession')
//       localStorage.setItem('userSession', JSON.stringify(updatedUserInfo))
//       return token
//     }
//     if (code === 400) {
//       localStorage.removeItem('userSession')
//       router.push('/login')
//       return
//     }
//   } catch (error) {
//     console.error('更新 Token 失敗:', error)
//     router.push('/login')
//     return
//   }
// }

// Vue 插件：注入到 this.$api / 組件的全域屬性
export default {
  install (app: any) {
    app.config.globalProperties.$api = api
  },
}
