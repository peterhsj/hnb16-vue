<template>
  <div>
    <!-- 銀行資料查詢列表 -->
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
          新增銀行
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
        item-value="bankId"
        :items="listItems"
        :items-length="totalCount"
        :loading="loading"
        show-current-page
        striped="even"
        @update:options="loadItems"
      >
        <!-- 操作 -->
        <template #item.action="{ item }">
          <v-btn
            v-if="item.status"
            class="ma-2"
            color="deep-orange-darken-1"
            size="small"
            @click="handleDisable(item.bankId, item.bankName)"
          >
            <v-icon :icon="'mdi-pause'" size="18" />
            停用
          </v-btn>
          <v-btn
            v-else
            class="ma-2"
            color="success"
            size="small"
            @click="handleEnable(item.bankId)"
          >
            <v-icon :icon="'mdi-play'" size="18" />
            啟用
          </v-btn>
          <v-btn
            class="ma-2"
            color="light-blue-darken-2"
            size="small"
            @click="handleEdit('edit', item)"
          >
            <v-icon class="me-2" icon="mdi-pencil" size="16" />
            編輯
          </v-btn>
          <v-btn
            class="ma-2"
            color="light-blue-darken-2"
            size="small"
            @click="handleViewBranch(item)"
          >
            <v-icon class="me-2" icon="mdi-file-document-outline" size="16" />
            檢視分行
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>
    <!-- 編輯銀行資料對話框 -->
    <MaintainBankInfoEdit
      v-if="editDialog"
      v-model:edit-dialog="editDialog"
      :data="editItem"
      :edit-type="editType"
      @on-close="closeEditDialog"
      @on-save="editOnSave"
    />
    <!-- 分行資料對話框 -->
    <BranchListDialog
      v-if="branchListDialog"
      v-model:branch-list-dialog="branchListDialog"
      :data="editItem"
      @on-close="closebranchListDialog"
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
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { api } from '@/api/axios'

  interface Props {
    title?: string
    formData: {
      bankName: string | null
      bankId: string | null
    }
  }
  const props = defineProps<Props>()

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const editType = ref<string>('new')
  const editItem = ref<Partial<TableDataItem>>({})
  const editDialog = ref<boolean>(false)

  // 分行資料對話框
  const branchListDialog = ref<boolean>(false)

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
        fetchLcInfoList().finally(() => {
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
    fetchLcInfoList().finally(() => {
      isSearching.value = false
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateTableHeight)
  })

  interface HeaderItem {
    id?: number
    title: string
    key: string
    sortable?: boolean
    nowrap?: boolean
    headerProps?: {
      class: string
    }
    align?: 'start' | 'end' | 'center' | undefined
    width?: string | number
  }
  const headers: HeaderItem[] = [
    { title: '銀行代碼', key: 'bankId', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '銀行名稱', key: 'bankName', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '操作', key: 'action', sortable: false, align: 'center', nowrap: true, width: '250px', headerProps: { class: 'bg-blue-lighten-4' } },
  ]

  const loading = ref<boolean>(false)

  interface TableDataItem {
    bankId: string // 銀行代碼
    bankName: string // 銀行名稱
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
    sortBy: [{ key: 'companyId', order: 'asc' }],
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
    fetchLcInfoList()
  }

  // 使用 axios 呼叫 API 獲取列表
  async function fetchLcInfoList (): Promise<void> {
    const { page, itemsPerPage, sortBy } = pageOptions.value
    const payload = {
      ...props.formData, // 包含查詢條件
      page,
      itemsPerPage,
      sortBy: sortBy.map(s => s.key),
      sortDesc: sortBy.map(s => s.order === 'desc'),
    }
    loading.value = true
    const apiUrl = '/api/maintainBankInfoList/list'
    try {
      // 使用 axios POST 請求
      const res = await api.post(apiUrl, payload)
      const { code, data, total, totalAmount: amount } = res.data

      console.log('API 回應:', { code, data, total, payload })
      // 更新表格數據
      if (code === 200) {
        listItems.value = data
        totalCount.value = total
        totalAmount.value = amount // 更新總金額
      }
    } catch (error) {
      console.error('API 請求失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 編輯銀行資料
  function handleEdit (type: string, item?: TableDataItem): void {
    // 在此處實現編輯銀行資料的邏輯，例如跳轉到編輯頁面或打開編輯對話框
    editDialog.value = true
    editType.value = type
    editItem.value = item || {}
    console.log('編輯銀行資料 ID:', item, '類型:', type, 'editDialog:', editDialog.value)
  }

  // 停用銀行資料
  function handleDisable (bankId: string, bankName: string): void {
    messageTitle.value = '訊息通知'
    message.value = `確認停用 <span class="text-teal-darken-2">${bankName}</span> 銀行權限？`
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    messageDialog.value = true
    processStatus.value = 'pauseUserAuthority'
  }
  function pauseUserAuthority (): void {
    // 在此處實現停用銀行資料的邏輯，例如呼叫 API 停用指定 ID 的銀行資料
    console.log('停用銀行資料')
    fetchLcInfoList()
    setTimeout(() => {
      messageTitle.value = '訊息通知'
      message.value = `銀行權限已停用`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
    }, 1000)
  }

  // 啟用銀行資料
  function handleEnable (bankId: string): void {
    // 在此處實現啟用銀行資料的邏輯，例如呼叫 API 啟用指定 ID 的銀行資料
    console.log('啟用銀行資料 ID:', bankId)
    fetchLcInfoList()
  }

  // 編輯保存後的回調函數
  function editOnSave (): void {
    nextTick().then(() => {
      messageTitle.value = '訊息通知'
      message.value = `銀行資料已儲存`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
      fetchLcInfoList()
    })
  }

  // 檢視分行資料
  function handleViewBranch (item: TableDataItem): void {
    // 在此處實現檢視分行資料的邏輯，例如跳轉到分行資料頁面或打開分行資料對話框
    console.log('檢視分行資料 ID:', item.bankId, '銀行名稱:', item.bankName)
    branchListDialog.value = true
    editItem.value = item || {}
  }

  // 關閉分行資料對話框
  function closebranchListDialog (): void {
    branchListDialog.value = false
  }

  // 關閉編輯對話框
  function closeEditDialog (): void {
    editDialog.value = false
    editItem.value = {}
  }

  // 確認 message
  function messageConfirm (): void {
    if (processStatus.value === 'pauseUserAuthority') {
      pauseUserAuthority()
      processStatus.value = ''
    }
    messageDialog.value = false
  }
  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
