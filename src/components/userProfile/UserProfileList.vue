<template>
  <div>
    <!-- 人員資料查詢列表 -->
    <div class="d-flex justify-space-between align-center">
      <h1 class="hnb__title">{{ props.title }}</h1>

      <div>
        <v-btn
          class="me-5"
          color="light-blue-darken-2"
          size="small"
          @click="handleEdit('new')"
        >
          <v-icon class="me-2" icon="mdi-plus" size="16" />
          新增人員資料
        </v-btn>
      </div>
    </div>

    <v-card class="border-lg pa-4" flat>
      <!-- 無資料時顯示 -->
      <v-card v-if="!loading && listItems.length === 0" class="mx-auto my-3" color="grey-lighten-4" flat>
        <v-card-text class="text-center py-12">
          <v-icon color="grey-lighten-1" icon="mdi-file-document-alert-outline" size="64" />
          <p class="text-h6 text-orange-darken-2 mt-4">尚無資料</p>
        </v-card-text>
      </v-card>

      <v-data-table-server
        v-else
        v-model:items-per-page="pageOptions.itemsPerPage"
        class="hnb__table"
        color="light-blue-darken-2"
        density="compact"
        fixed-header
        :headers="headers"
        :height="tableHeight"
        item-value="userId"
        :items="listItems"
        :items-length="totalCount"
        :loading="loading"
        show-current-page
        striped="even"
        @update:options="loadItems"
      >

        <!-- 狀態 -->
        <template #item.status="{ item }">
          <div class="d-flex justify-center">
            <v-switch
              color="success"
              hide-details
              :model-value="item.status"
              @update:model-value="(val) => handleStatusChange(item, val)"
            />
          </div>
        </template>

        <!-- 操作 -->
        <template #item.action="{ item }">
          <v-btn
            class="ma-2"
            color="light-blue-darken-2"
            size="small"
            @click="handleEdit('edit', item)"
          >
            <v-icon class="me-2" icon="mdi-pencil" size="16" />
            編輯
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>
    <!-- 編輯人員資料對話框 -->
    <UserProfileEdit
      v-if="editDialog"
      v-model:edit-dialog="editDialog"
      :data="editItem"
      :edit-type="editType"
      @on-close="closeEditDialog"
      @on-save="editOnSave"
    />
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  // 使用 storeToRefs 自動解包 ref
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface Props {
    title?: string
    formData: {
      name: string | null
      userId: string | null
    }
  }
  const props = defineProps<Props>()

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<{ action: string, userId: string, status: boolean }>({
    action: '',
    userId: '',
    status: false,
  })

  // 選中的項目
  const editType = ref<string>('new')
  const editItem = ref<Partial<TableDataItem>>({})
  const editDialog = ref<boolean>(false)

  // 防止重複調用的標記
  const isSearching = ref<boolean>(false)

  // 監聽 formData 變化，當有查詢條件時重新載入資料
  watch(
    () => props.formData,
    (newValue: Props['formData']) => {
      // 檢查是否有任何查詢條件
      const hasSearchCriteria = Object.keys(newValue || {}).length > 0
      if (hasSearchCriteria) {
        // 設置標記並重置到第一頁
        isSearching.value = true
        pageOptions.value = { ...pageOptionsInit.value }
        fetchUserProfileList().finally(() => {
          isSearching.value = false
        })
      }
    },
    { deep: true })

  // 動態計算表格高度
  const tableHeight = ref<number>(600)

  function calculateTableHeight () {
    // 計算可用高度：視窗高度 - 其他元素高度（如標題、padding 等）
    // 可根據實際情況調整減去的數值
    const offset = 570 // 扣除頁面其他元素的高度
    tableHeight.value = window.innerHeight - offset
  }

  onMounted(() => {
    calculateTableHeight()
    window.addEventListener('resize', calculateTableHeight)
    isSearching.value = true
    fetchUserProfileList().finally(() => {
      isSearching.value = false
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateTableHeight)
  })

  interface HeaderItem {
    userId?: string
    title: string
    key: string
    sortable?: boolean
    nowrap?: boolean
    headerProps?: {
      class: string
    }
    align?: 'start' | 'end' | 'center' | undefined
  }
  const headers: HeaderItem[] = [
    { title: 'User Id', key: 'userId', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '姓名', key: 'name', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '所屬單位', key: 'companyName', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '職稱', key: 'title', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '人員角色', key: 'userRole', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '類別', key: 'categoryName', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '行動電話', key: 'mobile', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '電話', key: 'phone', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '傳真', key: 'fax', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '電子信箱', key: 'email', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '狀態', key: 'status', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '操作', key: 'action', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
  ]

  const loading = ref<boolean>(false)

  interface TableDataItem {
    userId: string
    name: string
    phone: string // 電話
    fax: string // 傳真
    mobile: string // 行動電話
    email: string // 電子信箱
    title: string // 職稱
    userRoleId: string // 人員角色 ID
    userRole: string // 人員角色
    companyId: string // 所屬單位 ID
    companyName: string // 所屬單位
    categoryId: string // 類別 ID
    categoryName: string // 類別
    status: boolean // 狀態
  }
  const listItems = ref<TableDataItem[]>([])
  /** 分頁 **/
  interface PageOptions {
    page: number
    itemsPerPage: number
    sortBy: {
      key: string
      order?: 'asc' | 'desc'
    }[]
  }
  const pageOptionsInit = ref<PageOptions>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [{ key: 'id', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalAmount = ref<number>(0) // 總金額

  function loadItems ({ page, itemsPerPage, sortBy }: PageOptions): void {
    // 如果正在執行搜索，跳過此次調用
    if (isSearching.value) {
      return
    }
    pageOptions.value.page = page
    pageOptions.value.itemsPerPage = itemsPerPage
    pageOptions.value.sortBy = sortBy.map(s => ({ key: s.key, order: s.order }))
    fetchUserProfileList()
  }

  // 取得人員資料列表
  async function fetchUserProfileList (): Promise<void> {
    const { page, itemsPerPage, sortBy } = pageOptions.value
    const payload = {
      ...props.formData, // 包含查詢條件
      page,
      itemsPerPage,
      sortBy: sortBy.map(s => s.key),
      sortDesc: sortBy.map(s => s.order === 'desc'),
    }
    loading.value = true
    const apiUrl = '/api/userProfile/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: resData, total, totalAmount: amount } = data
        // 更新表格數據
        if (status === 200) {
          listItems.value = resData
          totalCount.value = total
          totalAmount.value = amount // 更新總金額
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchUserProfileList, {
        messageTitle,
        message,
        messageStatus,
        isConfirmBtn,
        messageDialog,
      })
    } finally {
      loading.value = false
    }
  }

  // 編輯人員資料
  function handleEdit (type: string, item?: TableDataItem): void {
    // 在此處實現編輯人員資料的邏輯，例如跳轉到編輯頁面或打開編輯對話框
    editDialog.value = true
    editType.value = type
    editItem.value = item || { categoryId: '1', companyId: '2' } // 預設值
    console.log('編輯人員資料:', editItem.value, '類型:', type, 'editDialog:', editDialog.value)
  }

  // 啟用 / 停用會員
  function handleStatusChange (item: TableDataItem, newStatus: boolean | null): void {
    if (newStatus === null) return
    console.log('狀態變更:', item.name, newStatus)
    const { name, userId } = item

    if (newStatus) {
      ToggleRole(userId, newStatus)
    } else {
      messageTitle.value = '訊息通知'
      message.value = `確認停用 <span class="text-teal-darken-2">${name}</span> 角色？`
      messageStatus.value = 'alert'
      isConfirmBtn.value = true
      messageDialog.value = true
      processStatus.value = { action: 'pauseUserAuthority', userId, status: newStatus }
    }
  }

  // Toggle Role Status
  interface ToggleCompanyResponse {
    userId: string
    status: boolean
    updatedAt: string
  }
  async function ToggleRole (userId: string, status: boolean): Promise<void> {
    const payload = { userId, status }
    loading.value = true
    const apiUrl = '/api/userProfile/toggle'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: apiData, message: resMessage } = data

        console.log('API 回應:', { status, apiData, message: resMessage })
        // 更新表格數據
        if (status === 200) {
          const updatedRole = apiData as ToggleCompanyResponse
          const index = listItems.value.findIndex(item => item.userId === updatedRole.userId)
          if (index !== -1 && listItems.value[index]) {
            listItems.value[index]!.status = updatedRole.status
          }
          messageTitle.value = '訊息通知'
          message.value = resMessage
          messageStatus.value = 'success'
          isConfirmBtn.value = false
          messageDialog.value = true
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, () => ToggleRole(userId, status), {
        messageTitle,
        message,
        messageStatus,
        isConfirmBtn,
        messageDialog,
      })
    } finally {
      loading.value = false
    }
  }

  // 編輯保存後的回調函數
  function editOnSave (): void {
    nextTick().then(() => {
      messageTitle.value = '訊息通知'
      message.value = `人員資料已儲存`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
      fetchUserProfileList()
    })
  }

  // 關閉編輯對話框
  function closeEditDialog (): void {
    editDialog.value = false
    editItem.value = {}
  }

  // 確認 message
  function messageConfirm (): void {
    const { action, userId, status } = processStatus.value
    if (action === 'pauseUserAuthority' && userId) {
      ToggleRole(userId, status)
      processStatus.value = { action: '', userId: '', status: false }
    }
    messageDialog.value = false
  }
  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
