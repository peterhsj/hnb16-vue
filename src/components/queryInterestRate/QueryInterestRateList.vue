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

        <template #item.draftAmount="{ item }">
          ${{ thousandsFormatting(item.draftAmount.toLocaleString()) }}
        </template>

        <template #item.lcAmount="{ item }">
          ${{ thousandsFormatting(item.lcAmount.toLocaleString()) }}
        </template>

        <template #item.availableAmount="{ item }">
          ${{ thousandsFormatting(item.availableAmount.toLocaleString()) }}
        </template>

        <!-- 查看利率約定書 -->
        <template #item.interestRateAgreement="{ item }">
          <v-btn
            v-if="item.interestRateAgreement"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleInterestRateAgreementView(item.interestRateAgreement)"
          />
        </template>

      </v-data-table>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-total-amount="isShowTotalAmount"
      :is-show-total-pages="isShowTotalPages"
      :total-amount="totalAmount"
      :total-items="tableItems.length"
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
  import type { ListItem, QueryFormPayload } from '@/types/queryInterestRate'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryInterestRate'
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
  const isShowTotalPages = ref<boolean>(false)
  const isShowTotalAmount = ref<boolean>(true)
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true },
    { title: '利率約定書', key: 'interestRateAgreement', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '匯票金額', key: 'draftAmount', align: 'end', sortable: false, nowrap: true },
    { title: '開狀銀行', key: 'issuingBank', align: 'center', sortable: false, nowrap: true },
    { title: '開狀日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀金額', key: 'lcAmount', align: 'end', sortable: false, nowrap: true },
    { title: '可用餘額', key: 'availableAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '有效期限', key: 'validDate', align: 'center', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
    { title: '確認日期', key: 'confirmationDate', align: 'center', sortable: false, nowrap: false, minWidth: 90 },
    { title: '來源', key: 'source', align: 'center', sortable: false, nowrap: false, minWidth: 90 },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    queryMode: '',
    lcNo: '',
    applicantTaxId: '',
    beneficiaryTaxId: '',
    issuingBank: '',
    lcStatus: [],
    issueDateStart: '',
    issueDateEnd: '',
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
          lcNo: '',
          applicantTaxId: '',
          beneficiaryTaxId: '',
          issuingBank: '',
          lcStatus: [],
          issueDateStart: '',
          issueDateEnd: '',
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
    const { lcNo, applicantTaxId, beneficiaryTaxId, issuingBank, lcStatus, issueDateStart, issueDateEnd } = searchForm.value
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      lcNo,
      applicantTaxId,
      beneficiaryTaxId,
      issuingBank,
      lcStatus,
      issueDateStart,
      issueDateEnd,
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
