<template>
  <div>
    <!-- 無資料時顯示 -->
    <v-card v-if="!loading && items.length === 0" class="mx-auto my-3" color="grey-lighten-4" flat>
      <v-card-text class="text-center py-12">
        <v-icon color="grey-lighten-1" icon="mdi-file-document-alert-outline" size="64" />
        <p class="text-h6 text-orange-darken-2 mt-4">尚無資料</p>
      </v-card-text>
    </v-card>

    <v-data-table-server
      v-else
      v-model:items-per-page="pageOptions.itemsPerPage"
      class="hnb__table"
      color="grey-lighten-4"
      density="compact"
      fixed-header
      :headers="headers"
      :height="tableHeight"
      :items="items"
      :items-length="totalCount"
      :loading="loading"
      show-current-page
      striped="even"
      @update:options="loadItems"
    >
      <template #item.info="{ item }">
        <div class="py-2">
          <p class="mb-3">
            [ {{ item.id }} ] {{ item.company }}於{{ item.date }} 已通知 {{ item.bankName }}{{ item.branchName }} 押匯{{ item.data?.length || 0 }} 筆，總金額 {{ thousandsFormatting(item.dataTotalAmount || 0) }}元，資料如下：
          </p>
          <v-container class="mb-1 pa-0" fluid>
            <!-- 標題列 -->
            <v-row class="bg-teal-lighten-3 border-sm" dense>
              <v-col class="text-center pa-2 text-teal-darken-5" cols="3">
                匯票號碼
              </v-col>
              <v-col class="text-right pa-2 text-teal-darken-5" cols="3">
                金額
              </v-col>
              <v-col class="text-center pa-2 text-teal-darken-5" cols="3">
                匯票號碼
              </v-col>
              <v-col class="text-right pa-2 text-teal-darken-5" cols="3">
                金額
              </v-col>
            </v-row>
            <!-- 資料列 -->
            <v-row
              v-for="rowIndex in Math.ceil((item.data?.length || 0) / 2)"
              :key="rowIndex"
              class="border-sm border-t-0"
              :class="(rowIndex - 1) % 2 === 0 ? 'bg-teal-lighten-5' : ''"
              dense
            >
              <!-- 左側第一筆 -->
              <template v-if="item.data?.[( rowIndex - 1) * 2]">
                <v-col class="text-center pa-2" cols="3">
                  <a class="text-blue-darken-2" href="#" @click.prevent="handleDraftView(item.data[(rowIndex - 1) * 2]?.draftNo || '')">
                    {{ item.data[(rowIndex - 1) * 2]?.draftNo }}
                  </a>
                </v-col>
                <v-col class="text-right pa-2" cols="3">
                  $ {{ thousandsFormatting(item.data[(rowIndex - 1) * 2]?.amount || 0) }}
                </v-col>
              </template>
              <template v-else>
                <v-col class="text-center pa-2" cols="3" />
                <v-col class="text-right pa-2" cols="3" />
              </template>

              <!-- 右側第二筆 -->
              <template v-if="item.data?.[(rowIndex - 1) * 2 + 1]">
                <v-col class="text-center pa-2" cols="3">
                  <a class="text-blue-darken-2" href="#" @click.prevent="handleDraftView(item.data[(rowIndex - 1) * 2 + 1]?.draftNo || '')">
                    {{ item.data[(rowIndex - 1) * 2 + 1]?.draftNo }}
                  </a>
                </v-col>
                <v-col class="text-right pa-2" cols="3">
                  $ {{ thousandsFormatting(item.data[(rowIndex - 1) * 2 + 1]?.amount || 0) }}
                </v-col>
              </template>
              <template v-else>
                <v-col class="text-center pa-2" cols="3" />
                <v-col class="text-right pa-2" cols="3" />
              </template>
            </v-row>
          </v-container>
        </div>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          class="ma-2"
          color="deep-orange-darken-1"
          size="small"
          @click="handleDelete(item)"
        >
          <v-icon :icon="'mdi-trash-can-outline'" size="18" />
          刪除
        </v-btn>
        <v-btn
          class="ma-2"
          color="success"
          size="small"
          @click="handleProcess(item)"
        >
          <v-icon class="mr-1" :icon="'mdi-invoice-text-send-outline'" size="18" />
          傳送通知
        </v-btn>
      </template>
    </v-data-table-server>
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
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'
  import { thousandsFormatting } from '@/utils/format'

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  // 動態計算表格高度
  const tableHeight = ref<number>(600)

  function calculateTableHeight () {
    // 計算可用高度：視窗高度 - 其他元素高度（如標題、padding 等）
    // 可根據實際情況調整減去的數值
    const offset = 360 // 扣除頁面其他元素的高度
    tableHeight.value = window.innerHeight - offset
  }

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  // 防止重複調用的標記
  const isSearching = ref<boolean>(false)

  interface HeaderItem {
    id?: string
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
    { title: '訊息', key: 'info', sortable: false, align: 'start', headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '日期', key: 'date', sortable: true, align: 'center', headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '操作', key: 'actions', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
  ]

  const loading = ref<boolean>(false)

  interface DraftItem {
    draftNo: string
    amount: number
  }

  interface TableDataItem {
    id: string
    company: string
    bankName: string
    branchName: string
    date: string
    data?: DraftItem[]
    dataTotalAmount?: number
  }
  const items = ref<TableDataItem[]>([])
  /** 分頁 **/
  interface PageOptions {
    page: number
    itemsPerPage: number
    sortBy: string | string[]
    sortDesc?: boolean | boolean[]
  }
  const pageOptions = ref<PageOptions>({
    page: 1,
    itemsPerPage: 10,
    sortBy: ['id'],
    sortDesc: [false],
  })
  const totalCount = ref(0) // 總筆數

  // 監聽分頁、排序變化
  interface LoadItemsOptions {
    page: number
    itemsPerPage: number
    sortBy: {
      key: string
      order?: 'asc' | 'desc'
    }[]
  }
  function loadItems ({ page, itemsPerPage, sortBy }: LoadItemsOptions): void {
    // 如果正在執行搜索，跳過此次調用
    if (isSearching.value) {
      return
    }
    pageOptions.value.page = page
    pageOptions.value.itemsPerPage = itemsPerPage
    pageOptions.value.sortBy = sortBy.map(s => s.key)
    fetchNotificationList()
  }

  interface ApiResponse<T = any> {
    code: number
    data: T
    total?: number
    message?: string
  }

  // 取得押匯通知列表
  async function fetchNotificationList (): Promise<void> {
    const { page, itemsPerPage, sortBy, sortDesc } = pageOptions.value
    const payload = {
      page,
      itemsPerPage,
      sortBy,
      sortDesc,
    }
    loading.value = true
    const apiUrl = '/api/notification/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post<ApiResponse>(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: responseData, total } = data

        // console.log('API 回應:', res.data)
        // 更新表格數據
        if (status === 200) {
          const processedData = responseData.map((item: any) => ({
            id: item.id,
            date: item.date,
            company: item.company,
            bankName: item.bankName,
            branchName: item.branchName,
            data: item.dataList, // 將 dataList 賦值給 data 屬性
            dataTotalAmount: item.dataList.reduce((sum: number, draft: DraftItem) => sum + draft.amount, 0), // 計算總金額
          }))

          items.value = processedData
          totalCount.value = total || 0
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchNotificationList, {
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

  // 預覽匯票詳細資料
  async function handleDraftView (draftNo: string): Promise<void> {
    console.log('查看匯票:', draftNo)
    // 開啟新視窗顯示匯票資訊
    const url = `#/draftInfo?draftId=${encodeURIComponent(draftNo)}`
    const width = 1000
    const height = 800
    const left = (screen.width - width) / 2
    const top = (screen.height - height) / 2
    window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`)
  }

  const selectedItemId = ref<string | null>(null)

  // 刪除項目
  async function handleDelete (item: TableDataItem): Promise<void> {
    console.log('刪除項目:', item)
    processStatus.value = 'delete'
    selectedItemId.value = item.id
    messageTitle.value = '確認刪除'
    message.value = `確定要刪除編號 [ ${item.id} ] 的資料嗎？`
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  // 實際執行刪除
  async function executeDelete (): Promise<void> {
    const payload = { id: selectedItemId.value }
    try {
      const res = await api.post<ApiResponse>('/api/notification/delete', payload)
      const { code, message: apiMessage } = res.data

      if (code === 200) {
        messageTitle.value = '訊息通知'
        message.value = apiMessage || '刪除成功'
        messageStatus.value = 'success'
        isConfirmBtn.value = false
        messageDialog.value = true

        // 清空選中項目並重新載入列表
        selectedItemId.value = null
        await fetchNotificationList()
      } else if (code === 403) {
        messageTitle.value = '訊息通知'
        message.value = apiMessage || '部分資料無法刪除'
        messageStatus.value = 'alert'
        isConfirmBtn.value = false
        messageDialog.value = true
      } else {
        throw new Error(apiMessage || '刪除失敗')
      }
    } catch (error) {
      console.error('刪除失敗:', error)
      messageTitle.value = '訊息通知'
      message.value = '刪除失敗，請稍後再試'
      messageStatus.value = 'error'
      isConfirmBtn.value = false
      messageDialog.value = true
    }
  }

  // 傳送通知
  async function handleProcess (item: TableDataItem): Promise<void> {
    console.log('傳送通知:', item)
    processStatus.value = 'sendNotification'
    selectedItemId.value = item.id
    messageTitle.value = '確認傳送通知'
    message.value = `確定要傳送通知編號 [ ${item.id} ] 的資料嗎？`
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  // 實際執行傳送通知
  async function executeSendNotification (): Promise<void> {
    const payload = { id: selectedItemId.value }
    try {
      const res = await api.post<ApiResponse>('/api/notification/sendNotification', payload)
      const { code, message: apiMessage } = res.data

      if (code === 200) {
        messageTitle.value = '訊息通知'
        message.value = apiMessage || '傳送通知成功'
        messageStatus.value = 'success'
        isConfirmBtn.value = false
        messageDialog.value = true

        // 清空選中項目並重新載入列表
        selectedItemId.value = null
        await fetchNotificationList()
      } else if (code === 403) {
        messageTitle.value = '訊息通知'
        message.value = apiMessage || '部分資料無法傳送通知'
        messageStatus.value = 'alert'
        isConfirmBtn.value = false
        messageDialog.value = true
      } else {
        throw new Error(apiMessage || '傳送通知失敗')
      }
    } catch (error) {
      console.error('傳送通知失敗:', error)
      messageTitle.value = '訊息通知'
      message.value = '傳送通知失敗，請稍後再試'
      messageStatus.value = 'error'
      isConfirmBtn.value = false
      messageDialog.value = true
    }
  }

  onMounted(() => {
    calculateTableHeight()
    window.addEventListener('resize', calculateTableHeight)

    isSearching.value = true
    fetchNotificationList().finally(() => {
      isSearching.value = false
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateTableHeight)
  })

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
    // 執行刪除的 API 呼叫
    if (processStatus.value === 'delete') {
      executeDelete()
      processStatus.value = ''
    }
    // 執行傳送通知的 API 呼叫
    if (processStatus.value === 'sendNotification') {
      executeSendNotification()
      processStatus.value = ''
    }
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
