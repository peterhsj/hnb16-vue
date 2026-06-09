<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <p class="mb-2">
        <span class="font-weight-bold">查詢日期：</span> 115/06/20
      </p>

      <p class="mb-2">
        <span class="font-weight-bold">單位：</span> 新台幣 (元)
      </p>

      <p class="mb-2">
        <span class="font-weight-bold text-teal-darken-2">分行代號：700</span>
      </p>

      <template v-for="(group, index) in tableItems" :key="index">
        <v-data-table
          class="table-sm hnb__table bg-white"
          color="blue-darken-2"
          density="compact"
          :headers="tableHeaders"
          hide-default-footer
          item-value="seqNo"
          :items="group"
          :items-per-page="-1"
          :loading="isLoading"
          sort-asc-icon="mdi-sort-ascending"
          sort-desc-icon="mdi-sort-descending"
          sort-icon="mdi-swap-vertical"
          striped="odd"
        >

          <template #item.debit="{ item }">
            {{ item.debit != null ? thousandsFormatting(item.debit.toLocaleString()) : '' }}
          </template>

          <template #item.credit="{ item }">
            {{ item.credit != null ? thousandsFormatting(item.credit.toLocaleString()) : '' }}
          </template>

          <template #body.append>
            <tr class="font-weight-bold bg-blue-lighten-5">
              <td class="text-right text-red-darken-3" colspan="3">明細合計：</td>

              <td class="text-right text-red-darken-3 w-20">
                {{ thousandsFormatting(group.reduce((sum, row) => sum + (row.debit ?? 0), 0).toLocaleString()) }}
              </td>

              <td class="text-right text-red-darken-3 w-20">
                {{ thousandsFormatting(group.reduce((sum, row) => sum + (row.credit ?? 0), 0).toLocaleString()) }}
              </td>
            </tr>
          </template>

        </v-data-table>
      </template>

      <v-table
        class="table-sm hnb__table bg-white mt-1"
        density="compact"
      >
        <tbody>
          <tr class="font-weight-bold bg-blue-lighten-5">
            <td class="text-right text-red-darken-3" colspan="3">分行小計：</td>

            <td class="text-right text-red-darken-3 w-20">
              {{ thousandsFormatting(tableItems.reduce((sum, group) => sum + group.reduce((groupSum, row) => groupSum + (row.debit ?? 0), 0), 0).toLocaleString()) }}
            </td>

            <td class="text-right text-red-darken-3 w-20">
              {{ thousandsFormatting(tableItems.reduce((sum, group) => sum + group.reduce((groupSum, row) => groupSum + (row.credit ?? 0), 0), 0).toLocaleString()) }}
            </td>
          </tr>
        </tbody>
      </v-table>

    </v-card>

    <!-- <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-total-amount="isShowTotalAmount"
      :is-show-total-pages="isShowTotalPages"
      :total-amount="totalAmount"
      :total-items="tableItems.length"
      :total-pages="totalPages"
      @update:items-per-page="pageOptions.page = 1"
    /> -->
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
    <!-- Lc Dialog -->
    <LcDialog
      v-model:lc-dialog="lcDialog"
      :bene-type="''"
      :is-show-notice="true"
      :is-show-version="true"
      :lc-no="lcNo"
      @on-close="lcDialogClose"
      @open-lc-detail="handleOpenLcDetail"
      @open-notice-detail="handleOpenNoticeDetail"
    />
    <!-- Lc Detail Dialog (版本詳細) -->
    <LcDialog
      v-model:lc-dialog="lcDetailDialog"
      :bene-type="''"
      :lc-no="lcDetailNo"
      @on-close="lcDetailDialogClose"
    />
    <!-- 信用狀修改通知書 Notice Dialog -->
    <NoticeDialog
      v-model:notice-dialog="noticeDialog"
      :is-show-lc="true"
      :notice-no="noticeNo"
      @on-close="noticeDialogClose"
      @open-lc-detail="handleOpenLcDetail"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ListItem, QueryFormPayload } from '@/types/queryAccount'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryAccount'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-edit'])

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[][]>([])
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
  const isShowTotalPages = ref<boolean>(false)
  const isShowTotalAmount = ref<boolean>(true)
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const tableHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true, width: '20%' },
    { title: '科目', key: 'subject', align: 'start', sortable: false, nowrap: true },
    { title: '子目', key: 'subAccount', align: 'start', sortable: false, nowrap: true, width: '20%' },
    { title: '借方', key: 'debit', align: 'end', sortable: false, nowrap: true, width: '10%' },
    { title: '貸方', key: 'credit', align: 'end', sortable: false, nowrap: true, width: '10%' },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    queryMode: '',
    searchDate: '',
    issuingBank: '',
    transactionType: '',
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

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          queryMode: '',
          searchDate: '',
          issuingBank: '',
          transactionType: '',
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
    const { queryMode, searchDate, issuingBank, transactionType } = searchForm.value
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      queryMode,
      searchDate,
      issuingBank,
      transactionType,
      page,
      itemsPerPage,
    }
    console.log('Fetching list with payload:', payload, 'Page:', page, 'Items per page:', itemsPerPage)
    isLoading.value = true
    try {
      const res = await getDatacList(payload)
      console.log('API response:', res)
      const { status, data: { items: sourceData, summary: { total, amount } } } = res
      if (status === 200) {
        tableItems.value = sourceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
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

  // 查看利率約定書
  function handleInterestRateAgreementView (value: string): void {
    console.log('查看利率約定書:', value)
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
