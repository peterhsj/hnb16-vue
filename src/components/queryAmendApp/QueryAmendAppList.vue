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
        <template #item.amendAppNo="{ item }">
          <a v-if="item.amendAppNo" class="hnb__text--link" href="#" @click.prevent="handleAmendAppView(item.amendAppNo)">
            {{ item.amendAppNo }}
          </a>

          <span v-else>N/A</span>
        </template>

        <template #item.lcNo="{ item }">
          <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
            {{ item.lcNo }}
          </a>

          <span v-else>N/A</span>
        </template>

        <template #item.noticeNo="{ item }">
          <a v-if="item.noticeNo" class="hnb__text--link" href="#" @click.prevent="handleAmendNoticeView(item.noticeNo)">
            {{ item.noticeNo }}
          </a>

          <span v-else>N/A</span>
        </template>

        <template #item.lcType="{ item }">
          {{ item.lcType === 'sight' ? '即期' : '遠期' }}
        </template>

        <template #item.pendingApprover="{ item }">
          {{ item.pendingApprover || 'N/A' }}
        </template>

        <!-- 查看開狀手續費收據 -->
        <template #item.lcFeeReceipt="{ item }">
          <v-btn
            v-if="item.lcFeeReceipt"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleLcFeeReceiptView(item.lcNo)"
          />
        </template>

        <!-- 查看保證金收款證明 -->
        <template #item.depositReceipt="{ item }">
          <v-btn
            v-if="item.depositReceipt"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleDepositReceiptView(item.lcNo)"
          />
        </template>

        <!-- 查看現金繳費單 -->
        <template #item.cashPaySlip="{ item }">
          <v-btn
            v-if="item.cashPaySlip"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleCashPaySlipView(item.lcNo)"
          />
        </template>

        <!-- 查看承兌手續費收據 -->
        <template #item.acceptanceFeeReceipt="{ item }">
          <v-btn
            v-if="item.acceptanceFeeReceipt"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleAcceptanceFeeReceiptView(item.lcNo)"
          />
        </template>

        <!-- 查看轉帳支出傳票 -->
        <template #item.transferVoucher="{ item }">
          <v-btn
            v-if="item.transferVoucher"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleTransferVoucherView(item.lcNo)"
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
    <!-- 開狀手續費收據 Dialog -->
    <LcFeeReceiptDialog
      v-model:is-lc-fee-receipt-dialog="isLcFeeReceiptDialog"
      :lc-no="lcNo"
      @on-close="isLcFeeReceiptDialog = false"
    />
    <!-- 保證金收款證明 Dialog -->
    <DepositReceiptDialog
      v-model:is-deposit-receipt-dialog="isDepositReceiptDialog"
      :lc-no="lcNo"
      @on-close="isDepositReceiptDialog = false"
    />
    <!-- 現金繳費單 Dialog -->
    <CashPaySlipDialog
      v-model:is-cash-pay-slip-dialog="isCashPaySlipDialog"
      :lc-no="lcNo"
      @on-close="isCashPaySlipDialog = false"
    />
    <!-- 承兌手續費收據 Dialog -->
    <AcceptanceFeeReceiptDialog
      v-model:is-acceptance-fee-receipt-dialog="isAcceptanceFeeReceiptDialog"
      :lc-no="lcNo"
      @on-close="isAcceptanceFeeReceiptDialog = false"
    />
    <!-- 轉帳支出傳票 Dialog -->
    <TransferVoucherDialog
      v-model:is-transfer-voucher-dialog="isTransferVoucherDialog"
      :lc-no="lcNo"
      @on-close="isTransferVoucherDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ListItem, QueryFormPayload } from '@/types/queryAmendApp'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryAmendApp'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-edit'])

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)
  // Amend App Dialog
  const amendAppDialog = ref(false)
  const amendAppNo = ref<string>('')
  // Lc Dialog
  const lcDialog = ref(false)
  const lcNo = ref<string>('')
  // Lc Detail Dialog (版本詳細)
  const lcDetailDialog = ref(false)
  const lcDetailNo = ref<string>('')
  // Notice Dialog
  const noticeDialog = ref(false)
  const noticeNo = ref<string>('')
  // 開狀手續費收據 Dialog
  const isLcFeeReceiptDialog = ref(false)
  // 保證金收款證明 Dialog
  const isDepositReceiptDialog = ref(false)
  // 現金繳費單 Dialog
  const isCashPaySlipDialog = ref(false)
  // 承兌手續費收據 Dialog
  const isAcceptanceFeeReceiptDialog = ref(false)
  // 轉帳支出傳票 Dialog
  const isTransferVoucherDialog = ref(false)

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
    { title: '修改申請書號碼', key: 'amendAppNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false, nowrap: true },
    { title: '修改通知書號碼', key: 'noticeNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '通知銀行', key: 'issuingBank', align: 'start', sortable: false, nowrap: true },
    { title: '申請日期', key: 'applicationDate', align: 'center', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
    { title: '尚待審核人員', key: 'pendingApprover', align: 'center', sortable: false, nowrap: false, minWidth: 90 },
    { title: '開狀手續費收據', key: 'lcFeeReceipt', align: 'center', sortable: false, nowrap: false, minWidth: 100 },
    { title: '保證金收款證明', key: 'depositReceipt', align: 'center', sortable: false, nowrap: false, minWidth: 100 },
    { title: '現金繳費單', key: 'cashPaySlip', align: 'center', sortable: false, nowrap: false, minWidth: 70 },
    { title: '承兌手續費收據', key: 'acceptanceFeeReceipt', align: 'center', sortable: false, nowrap: false, minWidth: 100 },
    { title: '轉帳支出傳票', key: 'transferVoucher', align: 'center', sortable: false, nowrap: false, minWidth: 90 },
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

  // 查看修改申請書 Amend app Dialog
  function handleAmendAppView (value: string): void {
    amendAppNo.value = value
  }

  // 查看修改通知書 Amend Notice Dialog
  function handleAmendNoticeView (value: string): void {
    noticeNo.value = value
    noticeDialog.value = true
  }

  // 查看開狀手續費收據
  function handleLcFeeReceiptView (value: string): void {
    console.log('查看開狀手續費收據:', value)
    lcNo.value = value
    isLcFeeReceiptDialog.value = true
  }

  // 查看保證金收款證明
  function handleDepositReceiptView (value: string): void {
    console.log('查看保證金收款證明:', value)
    lcNo.value = value
    isDepositReceiptDialog.value = true
  }

  // 查看現金繳費單
  function handleCashPaySlipView (value: string): void {
    console.log('查看現金繳費單:', value)
    lcNo.value = value
    isCashPaySlipDialog.value = true
  }

  // 查看承兌手續費收據
  function handleAcceptanceFeeReceiptView (value: string): void {
    console.log('查看承兌手續費收據:', value)
    lcNo.value = value
    isAcceptanceFeeReceiptDialog.value = true
  }

  // 查看轉帳支出傳票
  function handleTransferVoucherView (value: string): void {
    console.log('查看轉帳支出傳票:', value)
    lcNo.value = value
    isTransferVoucherDialog.value = true
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
