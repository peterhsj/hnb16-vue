import type { AuthType } from '@/plugins/menu'
import { apiRequest } from '@/services/api-service'
import { clearToken, saveToken } from '@/utils/token-utils'

interface LoginRequest {
  userId: string
  password: string
}

interface LoginResponse {
  token: string
  userId: string
  userName: string
  roleId: string | null
  roleName: string | null
  branches: string[]
  hasDeputed: boolean
  expiresAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const userName = ref<string>(localStorage.getItem('user_name') ?? '')
  const authType = ref<AuthType>((localStorage.getItem('auth_type') as AuthType) ?? 'BH')
  const branches = ref<string[]>(JSON.parse(localStorage.getItem('user_branches') ?? '[]'))

  const isAuthenticated = computed(() => !!token.value)

  async function login (request: LoginRequest) {
    const res = await apiRequest<LoginResponse>('/auth/login', { method: 'POST', data: request })
    if (res.success) {
      token.value = res.data!.token
      userName.value = res.data!.userName
      branches.value = res.data!.branches
      saveToken(res.data!.token, res.data!.expiresAt)
      localStorage.setItem('user_name', res.data!.userName)
      localStorage.setItem('user_branches', JSON.stringify(res.data!.branches))
    }
    return res
  }

  function setAuthType (type: AuthType) {
    authType.value = type
    localStorage.setItem('auth_type', type)
  }

  async function logout () {
    token.value = null
    userName.value = ''
    authType.value = 'BH'
    branches.value = []
    clearToken()
    localStorage.removeItem('user_name')
    localStorage.removeItem('auth_type')
    localStorage.removeItem('user_branches')
  }

  return { token, userName, authType, branches, isAuthenticated, login, setAuthType, logout }
})
