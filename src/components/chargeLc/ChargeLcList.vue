<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="lcNo"
        :items="tableItems"
        :items-per-page="pageOptions.itemsPerPage"
        :loading="isLoading"
        :page="pageOptions.page"
        sort-asc-icon="mdi-sort-ascending"
        sort-desc-icon="mdi-sort-descending"
        sort-icon="mdi-swap-vertical"
        striped="odd"
      >
        <template #item.lcNo="{ item }">
          <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
            {{ item.lcNo }}
          </a>

          <span v-else>N/A</span>
        </template>

        <template #item.draftNo="{ item }">
          <a v-if="item.draftNo" class="hnb__text--link" href="#" @click.prevent="handleDraftView(item.draftNo)">
            {{ item.draftNo }}
          </a>

          <span v-else>N/A</span>
        </template>

        <template #item.lcAmount="{ item }">
          $ {{ thousandsFormatting(item.lcAmount?.toLocaleString()) }}
        </template>

        <template #item.lcBalanceAmount="{ item }">
          $ {{ thousandsFormatting(item.lcBalanceAmount?.toLocaleString()) }}
        </template>

        <template #item.issuingAmount="{ item }">
          $ {{ thousandsFormatting(item.issuingAmount?.toLocaleString()) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn
            class="hnb__btn--default mx-1"
            size="small"
            variant="flat"
            @click="handleCharge(item.lcNo)"
          >
            補收費用
          </v-btn>

          <v-btn
            class="hnb__btn--red mx-1"
            size="small"
            variant="flat"
            @click="handleNotCharge(item.lcNo)"
          >
            不收費用
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-current-page-total-amount="isShowCurrentPageTotalAmount"
      :is-show-total-amount="isShowTotalAmount"
      :is-show-total-pages="isShowTotalPages"
      :total-amount="totalAmount"
      :total-items="tableItems.length"
      :total-page-amount="totalPageAmount"
      :total-pages="totalPages"
      @update:items-per-page="pageOptions.page = 1"
    />

    <!-- 補收費用 Dialog -->
    <EditChargeLcDialog
      v-model:is-edit-dialog-open="isEditDialogOpen"
      :lc-no="selectedLcNo"
      @on-close="editDialogClose"
      @save-customer-data="saveCustomerData"
    />

    <PromptDialog
      v-model:message-dialog="messageDialog"
      :dialog-width="messageWidth"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />
  </div>
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
</template>

<script setup lang="ts">
  import type { ListItem } from '@/types/chargeLc'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/chargeLc'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-edit'])

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Edit Dialog
  const isEditDialogOpen = ref(false)
  const selectedLcNo = ref<string>('')
  // Draft Dialog
  const draftDialog = ref(false)
  const draftNo = ref<string>('')
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
  const messageWidth = ref<string>('auto')
  const isConfirmBtn = ref<boolean>(false)
  const isShowTotalPages = ref<boolean>(false)
  const isShowCurrentPageTotalAmount = ref<boolean>(true)
  const isShowTotalAmount = ref<boolean>(true)
  const totalAmount = ref<number>(0)
  const processStatus = ref<string>('')

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'senNo', align: 'center', sortable: false, nowrap: true, width: 80 },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '開狀日期', key: 'appDate', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀金額', key: 'lcAmount', align: 'end', sortable: false },
    { title: '信用狀餘額', key: 'lcBalanceAmount', align: 'end', sortable: false, nowrap: true },
    { title: '匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '押匯金額', key: 'issuingAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人名稱', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '有效期限', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
  ]

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
    sortBy: [{ key: 'lcNo', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalPageAmount = ref<number>(0) // 總金額

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
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
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
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
        totalPageAmount.value = amount || 0
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

  function handleCharge (lcNo: string): void {
    console.log('補收費用，信用狀號碼:', lcNo)
    selectedLcNo.value = lcNo
    isEditDialogOpen.value = true
  }

  function handleNotCharge (lcNo: string): void {
    console.log('不收費用，信用狀號碼:', lcNo)
    messageWidth.value = '400px'
    messageTitle.value = '作業訊息'
    message.value = `確定不再補收此次之開狀手續費？`
    messageStatus.value = 'alert'
    processStatus.value = 'notCharge'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function confirmNotCharge (): void {
    console.log('確認不收費用，執行相關邏輯')
    // 在此處執行不收費用的 API 呼叫或其他邏輯
    fetchLcAppList()
    nextTick(() => {
      messageWidth.value = '300px'
      messageTitle.value = '作業訊息'
      message.value = `作業已完成`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
    })
  }

  function saveCustomerData (): void {
    // 在這裡處理保存客戶資料的邏輯
    // 例如，可以發送 API 請求將資料保存到後端
    console.log('保存客戶資料')
    isEditDialogOpen.value = false
    messageWidth.value = '400px'
    messageTitle.value = '作業訊息'
    message.value = `作業已完成！`
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
  }

  function editDialogClose (): void {
    isEditDialogOpen.value = false
    selectedLcNo.value = ''
  }

  onMounted(fetchLcAppList)

  // 查看匯票 Draft Dialog
  function handleDraftView (value: string): void {
    draftNo.value = value
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

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    if (processStatus.value === 'notCharge') {
      confirmNotCharge()
    }
    messageDialog.value = false
  }
</script>
