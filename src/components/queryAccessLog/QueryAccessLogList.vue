<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        v-model:items-per-page="pageOptions.itemsPerPage"
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="seqNo"
        :items="tableItems"
        :loading="isLoading"
        :page="pageOptions.page"
        sort-asc-icon="mdi-sort-ascending"
        sort-desc-icon="mdi-sort-descending"
        sort-icon="mdi-swap-vertical"
        striped="odd"
        @update:items-per-page="pageOptions.itemsPerPage = $event"
      >
        <template #item.lcNo="{ item }">
          <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
            {{ item.lcNo }}
          </a>

          <span v-else>N/A</span>
        </template>

        <template #item.lcType="{ item }">
          {{ item.lcType === 'sight' ? '即期' : '遠期' }}
        </template>

        <template #item.amount="{ item }">
          ${{ thousandsFormatting(item.amount.toLocaleString()) }}
        </template>

        <template #item.availableBalance="{ item }">
          ${{ thousandsFormatting(item.availableBalance.toLocaleString()) }}
        </template>
      </v-data-table>

      <div class="mt-2 text-caption text-red-darken-3">
        請注意：「*」號欄位所顯示之內容並不一定已被賣方( 受益人 )所接受，僅供參考
      </div>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-current-page-total-amount="isShowCurrentPageTotalAmount"
      :is-show-total-amount="isShowTotalAmount"
      :is-show-total-page-positive-balance-amount="isShowTotalPagePositiveBalanceAmount"
      :is-show-total-pages="isShowTotalPages"
      :total-amount="totalAmount"
      :total-items="tableItems.length"
      :total-page-amount="totalPageAmount"
      :total-page-positive-balance-amount="totalPagePositiveBalanceAmount"
      :total-page-positive-balance-items="totalPagePositiveBalanceItems"
      :total-pages="totalPages"
      @update:items-per-page="pageOptions.page = 1"
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
  import type { ListItem, QueryFormPayload } from '@/types/queryAccessLog'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryAccessLog'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-edit'])

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)
  // Cancel App Dialog
  const cancelAppDialog = ref(false)
  const cancelAppNo = ref<string>('')
  // Lc Dialog
  const lcDialog = ref(false)
  const lcNo = ref<string>('')
  // Lc Detail Dialog (版本詳細)
  const lcDetailDialog = ref(false)
  const lcDetailNo = ref<string>('')
  // Notice Dialog
  const noticeDialog = ref(false)
  const noticeNo = ref<string>('')

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const tableHeaders: DataTableHeader[] = [
    { title: '帳號', key: 'account', align: 'center', sortable: false, nowrap: true },
    { title: '姓名', key: 'name', align: 'center', sortable: false, nowrap: true },
    { title: '角色', key: 'role', align: 'center', sortable: false, nowrap: true },
    { title: '時間', key: 'time', align: 'center', sortable: false, nowrap: true },
    { title: '作業項目', key: 'operationItem', align: 'center', sortable: false, nowrap: true },
    { title: '作業結果', key: 'operationResult', align: 'center', sortable: false, nowrap: false },
    { title: '作業訊息', key: 'operationMessage', align: 'center', sortable: false, nowrap: false },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    issueDateStart: '',
    issueDateEnd: '',
    beneficiaryTaxId: '',
    role: null,
    operationItem: null,
    operationResult: null,
  })

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
  const totalPageAmount = ref<number>(0) // 本頁總金額
  const totalPagePositiveBalanceItems = ref<number>(0) // 本頁可用餘額大於零總筆數
  const totalPagePositiveBalanceAmount = ref<number>(0) // 本頁可用餘額大於零總金額
  const isShowCurrentPageTotalAmount = ref<boolean>(true)
  const isShowTotalPages = ref<boolean>(false)
  const isShowTotalAmount = ref<boolean>(true)
  const isShowTotalPagePositiveBalanceItems = ref<boolean>(true)
  const isShowTotalPagePositiveBalanceAmount = ref<boolean>(true)

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          issueDateStart: '',
          issueDateEnd: '',
          beneficiaryTaxId: '',
          role: null,
          operationItem: null,
          operationResult: null,
        }
      pageOptions.value.page = 1
      console.log('Search form data changed:', searchForm.value)
      fetchLcAppList()
    },
    { deep: true },
  )

  watch(
    () => pageOptions.value,
    newVal => {
      console.log('Page options changed:', newVal)
      fetchLcAppList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchLcAppList () {
    const { issueDateStart, issueDateEnd, beneficiaryTaxId, role, operationItem, operationResult } = searchForm.value
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      issueDateStart,
      issueDateEnd,
      beneficiaryTaxId,
      role,
      operationItem,
      operationResult,
      page,
      itemsPerPage,
    }
    console.log('Fetching list with payload:', payload, 'Page:', page, 'Items per page:', itemsPerPage)
    isLoading.value = true
    try {
      const res = await getDatacList(payload)
      console.log('API response:', res)
      const { status, data: { items: sourceData, summary: { total, amount, positiveItems, positiveAmount } } } = res
      if (status === 200) {
        tableItems.value = sourceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
        totalPageAmount.value = sourceData.reduce((sum, item) => sum + item.amount, 0) || 0
        totalPagePositiveBalanceItems.value = positiveItems || 0
        totalPagePositiveBalanceAmount.value = positiveAmount || 0
      }
    } catch (error: any) {
      await handleApiError(error, fetchLcAppList, {
        messageTitle,
        message,
        messageStatus,
        isConfirmBtn,
        messageDialog,
      })
    } finally {
      isLoading.value = false
    }
  }

  // 查看註銷申請書 Cancel App Dialog
  function handleCancelAppNoView (value: string): void {
    cancelAppNo.value = value
    cancelAppDialog.value = true
  }
  // 查看轉帳支出傳票
  function handleTransferVoucherView (value: string): void {
    console.log('查看轉帳支出傳票:', value)
  }

  // 查看轉帳收入傳票
  function handleIncomeTransferVoucherView (value: string): void {
    console.log('查看轉帳收入傳票:', value)
  }

  // 查看信用狀 Lc Dialog
  function handleLcView (value: string): void {
    lcNo.value = value
    lcDialog.value = true
  }

  // 離開 Lc Dialog
  function lcDialogClose (): void {
    lcDialog.value = false
    lcNo.value = ''
  }

  // 開啟版本詳細 Dialog
  function handleOpenLcDetail (value: string): void {
    lcDetailNo.value = value
    lcDetailDialog.value = true
  }

  // 離開 Lc Detail Dialog
  function lcDetailDialogClose (): void {
    lcDetailDialog.value = false
    lcDetailNo.value = ''
  }

  // 開啟修改通知書 Detail Dialog
  function handleOpenNoticeDetail (value: string): void {
    noticeNo.value = value
    noticeDialog.value = true
  }

  // 離開修改通知書 Detail Dialog
  function noticeDialogClose (): void {
    noticeDialog.value = false
    noticeNo.value = ''
  }

  onMounted(fetchLcAppList)

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
