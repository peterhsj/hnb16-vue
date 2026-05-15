<template>
  <div>
    <!-- L/C 基本資料查詢列表 -->
    <div class="d-flex justify-space-between align-center">
      <h1 class="hnb__title">{{ props.title }}</h1>
    </div>

    <v-card class="border-lg pa-4" flat>
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
        <template #item.lcNo="{ item }">
          <a v-if="item.lcNo" class="text-blue-darken-2" href="#" @click.prevent="handleLcView(item.lcNo)">
            {{ item.lcNo }}
          </a>

          <span v-else>-</span>
        </template>

        <template #item.lcAmount="{ item }">
          $ {{ thousandsFormatting(item?.lcAmount || 0) }}
        </template>

        <template #item.availableBalance="{ item }">
          $ {{ thousandsFormatting(item?.availableBalance || 0) }}
        </template>
      </v-data-table-server>
    </v-card>
    <!-- lc Dialog -->
    <LcDialog
      v-if="lcDialog"
      v-model:lc-dialog="lcDialog"
      :lc-id="lcId"
      @on-close="lcDialogClose"
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
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'
  import { thousandsFormatting } from '@/utils/format'

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface Props {
    title?: string
    searchType: string
    formData: {
      issuingBankId: string | null
      issuingBranchId: string | null
      lcNo: string | null
      lcStatus: string | null
      applicantId: string | null
    }
  }
  const props = defineProps<Props>()

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  // 防止重複調用的標記
  const isSearching = ref<boolean>(false)

  // LC Dialog
  const lcDialog = ref<boolean>(false)

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
  }
  const headers: HeaderItem[] = [
    { title: '買受人名稱', key: 'buyerName', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '買受人統編', key: 'receptNo', sortable: false, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '開狀銀行', key: 'issuingBank', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '信用狀號碼', key: 'lcNo', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '信用狀金額 ( NT$ )', key: 'lcAmount', sortable: false, align: 'end', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '信用狀可用餘額 ( NT$ )', key: 'availableBalance', sortable: false, align: 'end', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '到期日', key: 'expiryDate', sortable: true, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '狀態', key: 'status', sortable: true, align: 'center', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
  ]

  const loading = ref<boolean>(false)

  interface TableDataItem {
    id: string
    buyerName: string // 買受人名稱
    receptNo: string // 買受人統編
    issuingBank?: string // 開狀銀行
    lcNo?: string // 信用狀號碼
    lcAmount?: number // 信用狀金額(NT$)
    availableBalance?: number // 信用狀可用餘額(NT$)
    expiryDate?: string // 到期日
    status?: string // 狀態
  }
  const items = ref<TableDataItem[]>([])
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
    if (isSearching.value) {
      // 如果正在搜尋，則不執行載入
      return
    }
    pageOptions.value.page = page
    pageOptions.value.itemsPerPage = itemsPerPage
    pageOptions.value.sortBy = sortBy.map(s => ({ key: s.key, order: s.order }))
    fetchLcInfoList()
  }

  // 查詢 L/C 基本資料列表
  async function fetchLcInfoList (): Promise<void> {
    const { page, itemsPerPage, sortBy } = pageOptions.value
    const payload = {
      ...props.formData,
      page,
      itemsPerPage,
      sortBy: sortBy.map(s => s.key),
      sortDesc: sortBy.map(s => s.order === 'desc'),
    }
    loading.value = true
    const apiUrl = '/api/lcInfo/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: lcData, total } = data
        // 更新表格數據
        if (status === 200) {
          items.value = lcData
          totalCount.value = total
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchLcInfoList, {
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

  // 查看 LC 詳細資料
  const lcId = ref<string>('')
  async function handleLcView (lcNo: string): Promise<void> {
    console.log('查看 LC:', lcNo)
    lcId.value = lcNo
    lcDialog.value = true
  }

  // 離開 LC Dialog
  function lcDialogClose (): void {
    lcDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
