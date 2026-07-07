import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor：附加 JWT token
http.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor：統一錯誤處理
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default http

/**
 * 統一 API 錯誤處理：console.error 列出完整錯誤資訊
 */
export function handleApiError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '[API Error]'
  if (axios.isAxiosError(error)) {
    console.error(prefix, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data,
      responseData: error.response?.data,
    })
  } else if (error instanceof Error) {
    console.error(prefix, error.message, error)
  } else {
    console.error(prefix, error)
  }
}
