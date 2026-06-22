import Mock from 'mockjs'

/**
 * 登入/登出 - Mock API
 */

// 登入
Mock.mock('/api/auth/login', 'post', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { account, password } = body

  // 驗證必填欄位
  if (!account) {
    return {
      code: 400,
      message: '帳號為必填',
      data: null,
    }
  }

  if (!password) {
    return {
      code: 400,
      message: '密碼為必填',
      data: null,
    }
  }

  // 模擬帳號密碼驗證
  // 這裡可以設定測試帳號，例如: admin/123456
  // if (account !== 'admin' && account !== 'user') {
  //   return {
  //     code: 401,
  //     message: '帳號或密碼錯誤',
  //     data: null,
  //   }
  // }

  // if (password !== '123456') {
  //   return {
  //     code: 401,
  //     message: '帳號或密碼錯誤',
  //     data: null,
  //   }
  // }

  // 模擬登入成功，回傳使用者資訊和 token
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
    expiresIn: number
    loginTime: string
  }
  const userData: UserInfo = {
    userId: Mock.Random.integer(1000, 9999),
    account,
    name: ['林大華', '陳小明', '王小美'][Mock.Random.integer(0, 2)] || '',
    email: `${account}@example.com`,
    roleId: [1, 2, 3][Mock.Random.integer(0, 2)] || 1, // 角色：S(系統管理員), C(公司管理員), O(承辦人)
    roleName: 'SM', // 角色代碼: BH=經辦, BS=主管, SM=系統管理員, MB=總行, BM=分行管理員
    categoryId: [1, 2, 3][Mock.Random.integer(0, 2)] || 1, // 類別：SC(系統公司), BU(買方), SE(賣方)
    categoryName: ['系統公司', '買方', '賣方'][Mock.Random.integer(0, 2)] || '',
    companyId: Mock.Random.integer(1000, 9999) || 123, // 公司 ID
    companyName: ['公司A', '公司B', '公司C'][Mock.Random.integer(0, 2)] || '',
    token: Mock.Random.guid(),
    refreshToken: Mock.Random.guid(),
    expiresIn: 10, // token 有效期（秒）- 測試用：10秒後過期
    loginTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  }

  return {
    code: 200,
    message: '登入成功',
    data: userData,
  }
})

// 登出
Mock.mock('/api/auth/logout', 'post', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { account } = body

  // 驗證帳號
  if (!account) {
    return {
      code: 400,
      message: '帳號為必填',
      data: null,
    }
  }

  // 模擬登出成功
  return {
    code: 200,
    message: '登出成功',
    data: {
      logoutTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    },
  }
})

// 刷新 Token
Mock.mock('/api/auth/refresh', 'post', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { refreshToken } = body

  // 驗證 refreshToken
  if (!refreshToken) {
    return {
      code: 400,
      message: 'Refresh Token 為必填',
      data: null,
    }
  }

  // 模擬刷新成功，回傳新的 token
  const newTokenData = {
    token: Mock.Random.guid(),
    refreshToken: Mock.Random.guid(),
    expiresIn: 3600,
    refreshTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  }

  return {
    code: 200,
    message: 'Token 刷新成功',
    data: newTokenData,
  }
})

// 取得目前登入使用者資訊
Mock.mock('/api/auth/me', 'get', () => {
  // 從 header 取得 token（實際應用中）
  // 這裡簡化處理，直接回傳使用者資訊

  const userData = {
    userId: Mock.Random.integer(1000, 9999),
    account: 'admin',
    name: '系統管理員',
    email: 'admin@example.com',
    auth: 'bank',
    avatar: Mock.Random.image('100x100', '#4A90E2', '#FFF', 'Avatar'),
    phone: `02-${Mock.Random.integer(2000, 8999)}-${Mock.Random.integer(1000, 9999)}`,
    department: '資訊部',
    position: '系統管理員',
    status: true,
  }

  return {
    code: 200,
    message: '成功',
    data: userData,
  }
})

export default {}
