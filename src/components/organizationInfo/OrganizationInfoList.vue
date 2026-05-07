<template>
  <div>
    <!-- 會員-公司資料查詢列表 -->
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
          新增會員-公司資料
        </v-btn>
      </div>
    </div>
    <v-btn @click="toggleAuth">token 測試</v-btn>

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
        item-value="id"
        :items="listItems"
        :items-length="totalCount"
        :loading="loading"
        show-current-page
        striped="even"
        @update:options="loadItems"
      >
        <!-- 公司名稱 -->
        <template #item.companyName="{ item }">
          <span v-if="item.receiptNo"><span>{{ item.receiptNo || '-' }}</span><br></span>
          <span v-if="item.companyName"><span>{{ item.companyName || '-' }}</span><br></span>
          <span v-if="item.companyNameEn" class="text-caption text-grey-darken-1">{{ item.companyNameEn || '-' }}</span>
        </template>

        <!-- 地址/註冊地址 -->
        <template #item.address="{ item }">
          <div style="max-width: 500px; word-wrap: break-word; white-space: normal;">
            <span>{{ item.address || '-' }}</span><br>
            <span v-if="item.addressEn"><span class="text-caption text-grey-darken-1">{{ item.addressEn || '-' }}</span><br></span>
            <span v-if="item.registeredAddress">{{ item.registeredAddress || '-' }}<br></span>
            <span v-if="item.registeredAddressEn"><span class="text-caption text-grey-darken-1">{{ item.registeredAddressEn || '-' }}</span></span>
          </div>
        </template>

        <!-- 電話 / 傳真 -->
        <template #item.phone="{ item }">
          <span v-if="item.phone"><span>{{ item.phone || '-' }}</span><br></span>
          <span v-if="item.fax" class="text-caption text-grey-darken-1">{{ item.fax || '-' }}</span>
        </template>

        <!-- 負責人姓名 / 電話 -->
        <template #item.principalName="{ item }">
          <span v-if="item.principalName"><span>{{ item.principalName || '-' }}</span><br></span>
          <span v-if="item.principalPhone" class="text-caption text-grey-darken-1">{{ item.principalPhone || '-' }}</span>
        </template>

        <!-- 聯絡人資訊 -->
        <template #item.contactName="{ item }">
          <div class="py-2">
            <span v-if="item.contactName">
              <span class="mr-2" v-html="item.contactName" />
              <span v-if="item.contactMobile" class="text-caption text-grey-darken-1">{{ item.contactMobile || '-' }}</span>
              <br>
            </span>
            <span v-if="item.contactPhone || item.contactFax">
              <span>電話：{{ item.contactPhone || '-' }}</span>
              <span v-if="item.contactFax"> / <span>傳真：{{ item.contactFax || '-' }}</span></span>
              <br>
            </span>
            <span v-if="item.contactEmail">電子信箱：{{ item.contactEmail || '-' }}</span>
          </div>
        </template>

        <!-- 狀態 -->
        <template #item.status="{ item }">
          <div class="d-flex justify-center">
            <v-switch
              color="success"
              hide-details
              :model-value="item.status === 1 ? true : false"
              @update:model-value="(val) => handleStatusChange(item, val ? 1 : 0)"
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
    <!-- 編輯會員資料對話框 -->
    <OrganizationInfoEdit
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
  // 使用 storeToRefs 自動解包 ref，保持響應式
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface Props {
    title?: string
    formData: {
      companyName: string | null
      receiptNo: string | null
    }
  }
  const props = defineProps<Props>()

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<{ action: string, companyId: number, status: number }>({
    action: '',
    companyId: 0,
    status: 0,
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
        fetchOrganizationInfoList().finally(() => {
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
    fetchOrganizationInfoList().finally(() => {
      isSearching.value = false
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateTableHeight)
  })

  interface HeaderItem {
    // id?: number
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
    { title: '公司統編 / 名稱', key: 'companyName', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '地址 / 註冊地址', key: 'address', sortable: false, align: 'start', headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '電話 / 傳真', key: 'phone', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '負責人資訊', key: 'principalName', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '聯絡人資訊', key: 'contactName', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '類別', key: 'categoryName', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '狀態', key: 'status', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '操作', key: 'action', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
  ]

  const loading = ref<boolean>(false)

  interface TableDataItem {
    companyId: number // 公司 ID
    companyName: string // 公司名稱
    companyNameEn: string // 公司英文名稱
    receiptNo: string // 統一編號
    address: string // 地址
    addressEn: string // 英文地址
    registeredAddress: string // 註冊地址
    registeredAddressEn: string // 英文註冊地址
    phone: string // 電話
    fax: string // 傳真
    principalName: string // 負責人姓名
    principalPhone: string // 負責人電話
    contactName: string // 聯絡人姓名
    contactPhone: string // 聯絡人電話
    contactFax: string // 聯絡人傳真
    contactMobile: string // 聯絡人行動電話
    contactEmail: string // 聯絡人電子信箱
    invoiceStamp: string // 發票章
    companyLogo: string // 公司LOGO圖片
    categoryId: number // 類別 ID
    categoryName: string // 類別
    status: number // 狀態
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
    sortBy: [{ key: 'companyId', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數

  function loadItems ({ page, itemsPerPage, sortBy }: PageOptions): void {
    // 如果正在執行搜索，跳過此次調用
    if (isSearching.value) {
      return
    }
    pageOptions.value.page = page
    pageOptions.value.itemsPerPage = itemsPerPage
    pageOptions.value.sortBy = sortBy.map(s => ({ key: s.key, order: s.order }))
    fetchOrganizationInfoList()
  }

  interface ApiResponse<T = any> {
    code: number
    message?: string
    data?: T
    total?: number
  }

  // 取得會員-公司資料查詢列表
  async function fetchOrganizationInfoList (): Promise<void> {
    const { page, itemsPerPage, sortBy } = pageOptions.value
    const payload = {
      ...props.formData, // 包含查詢條件
      page,
      itemsPerPage,
      sortBy: sortBy.map(s => s.key),
      sortDesc: sortBy.map(s => s.order === 'desc'),
    }
    loading.value = true
    const apiUrl = '/api/organizationInfo/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post<ApiResponse>(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: resData, total } = data
        // 更新表格數據
        if (status === 200) {
          listItems.value = resData
          totalCount.value = total ?? 0
        }
        listItems.value = resData
        totalCount.value = total ?? 0
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchOrganizationInfoList, {
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

  // 編輯會員資料
  function handleEdit (type: string, item?: TableDataItem): void {
    // 在此處實現編輯會員資料的邏輯，例如跳轉到編輯頁面或打開編輯對話框
    editDialog.value = true
    editType.value = type
    editItem.value = item || {}
    console.log('編輯會員資料 ID:', item, '類型:', type, 'editDialog:', editDialog.value)
  }

  // 啟用 / 停用會員
  function handleStatusChange (item: TableDataItem, newStatus: number): void {
    const { companyName, companyId } = item

    if (newStatus) {
      ToggleRole(companyId, newStatus)
    } else {
      messageTitle.value = '訊息通知'
      message.value = `確認停用 <span class="text-teal-darken-2">${companyName}</span>？`
      messageStatus.value = 'alert'
      isConfirmBtn.value = true
      messageDialog.value = true
      processStatus.value = { action: 'pauseCompanyAuthority', companyId, status: newStatus }
    }
  }

  // 開啟 / 停用會員-公司資料
  interface ToggleCompanyResponse {
    companyId: number
    status: number
    updatedAt: string
  }
  async function ToggleRole (companyId: number, status: number): Promise<void> {
    loading.value = true
    const apiUrl = `/api/organizationInfo/toggle/${companyId}`
    try {
      if (userInfo.value.token) {
        const res = await api.post<ApiResponse>(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { code, data } = res.data

        const { companyName } = data
        // 更新表格數據
        if (code === 200) {
          const updatedRole = data as ToggleCompanyResponse
          const index = listItems.value.findIndex(item => item.companyId === updatedRole.companyId)
          if (index !== -1 && listItems.value[index]) {
            listItems.value[index]!.status = updatedRole.status
          }
          messageTitle.value = '訊息通知'
          message.value = `會員 ${companyName} 已${status ? '啟用' : '停用'}`
          messageStatus.value = 'success'
          isConfirmBtn.value = false
          messageDialog.value = true
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, () => ToggleRole(companyId, status), {
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
      message.value = `會員資料已儲存`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
      fetchOrganizationInfoList()
    })
  }

  // 關閉編輯對話框
  function closeEditDialog (): void {
    editDialog.value = false
    editItem.value = {}
  }

  // 確認 message
  function messageConfirm (): void {
    const { action, companyId, status } = processStatus.value
    if (action === 'pauseCompanyAuthority' && companyId) {
      ToggleRole(companyId, status)
      processStatus.value = { action: '', companyId: 0, status: 0 }
    }
    messageDialog.value = false
  }
  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  function toggleAuth (): void {
    userStore.toggleAuth()
  }
</script>
