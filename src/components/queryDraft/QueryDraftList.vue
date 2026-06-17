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
        <template #item.draftNo="{ item }">
          <a v-if="item.draftNo" class="hnb__text--link" href="#" @click.prevent="handleDraftView(item.draftNo)">
            {{ item.draftNo }}
          </a>

          <span v-else>N/A</span>
        </template>

        <!-- 信用狀比對結果 -->
        <template #item.lcComparisonResult="{ item }">
          <a v-if="item.lcComparisonResult" class="hnb__text--link" href="#" @click.prevent="handleLcComparisonView(item.draftNo)">
            {{ item.lcComparisonResult }}
          </a>
        </template>

        <!-- 狀態 -->
        <template #item.status="{ item }">
          <a v-if="item.status === '已拒絕'" class="hnb__text--link" href="#" @click.prevent="handleDraftStatusView(item.draftNo)">
            {{ item.status }}
          </a>
        </template>

        <template #item.availableBalance="{ item }">
          ${{ thousandsFormatting(item.availableBalance.toLocaleString()) }}
        </template>

        <template #item.issuingAmount="{ item }">
          ${{ thousandsFormatting(item.issuingAmount.toLocaleString()) }}
        </template>

        <!-- 單據遞送單 -->
        <template #item.documentDelivery="{ item }">
          <v-btn
            v-if="item.documentDelivery"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleDocumentDeliveryView(item.draftNo)"
          />
        </template>

        <!-- 匯款交易附件(含轉帳收入傳票) -->
        <template #item.remittanceAttachment="{ item }">
          <v-btn
            v-if="item.remittanceAttachment"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleRemittanceAttachmentView(item.draftNo)"
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
            @click="handleCashPaySlipView(item.draftNo)"
          />
        </template>

        <!-- 押匯手續費收據 -->
        <template #item.draftFeeReceipt="{ item }">
          <v-btn
            v-if="item.draftFeeReceipt"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleDraftFeeReceiptView(item.draftNo)"
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
            @click="handleAcceptanceFeeReceiptView(item.draftNo)"
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
            @click="handleTransferVoucherView(item.draftNo)"
          />
        </template>

        <!-- 補收開狀手續費收據 -->
        <template #item.supplementaryLcFeeReceipt="{ item }">
          <v-btn
            v-if="item.supplementaryLcFeeReceipt"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleSupplementaryLcFeeReceiptView(item.draftNo)"
          />
        </template>

        <!-- 補收現金繳費單 -->
        <template #item.supplementaryCashPaySlip="{ item }">
          <v-btn
            v-if="item.supplementaryCashPaySlip"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleSupplementaryCashPaySlipView(item.draftNo)"
          />
        </template>

        <!-- 補收轉帳支出傳票 -->
        <template #item.supplementaryTransferVoucher="{ item }">
          <v-btn
            v-if="item.supplementaryTransferVoucher"
            class="hnb__btn--default"
            density="comfortable"
            icon="mdi-file-document-outline"
            size="small"
            variant="flat"
            @click="handleSupplementaryTransferVoucherView(item.draftNo)"
          />
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
    <!-- Prompt Dialog -->
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
    <!-- 信用狀比對結果 Dialog -->
    <LcComparisonResultDialog
      v-model:is-lc-comparison-result-dialog="isLcComparisonResultDialog"
      :lc-no="lcNo"
      @on-close="isLcComparisonResultDialog = false"
    />
    <!-- 單據遞送單 Dialog -->
    <DocumentDeliveryDialog
      v-model:is-document-delivery-dialog="isDocumentDeliveryDialog"
      :lc-no="lcNo"
      @on-close="isDocumentDeliveryDialog = false"
    />
    <!-- 押匯交易憑證 / 轉帳收入傳票 Dialog -->
    <RemittanceAttachmentDialog
      v-model:is-remittance-attachment-dialog="isRemittanceAttachmentDialog"
      :lc-no="lcNo"
      @on-close="isRemittanceAttachmentDialog = false"
    />
    <!-- 現金繳費單 Dialog -->
    <CashPaySlipDialog
      v-model:is-cash-pay-slip-dialog="isCashPaySlipDialog"
      :lc-no="lcNo"
      @on-close="isCashPaySlipDialog = false"
    />
    <!-- 押匯手續費收據 -->
    <DraftFeeReceiptDialog
      v-model:is-draft-fee-receipt-dialog="isDraftFeeReceiptDialog"
      :lc-no="lcNo"
      @on-close="isDraftFeeReceiptDialog = false"
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
    <!-- 補收開狀手續費收據 -->
    <SupplementaryLcFeeReceiptDialog
      v-model:is-supplementary-lc-fee-receipt-dialog="isSupplementaryLcFeeReceiptDialog"
      :lc-no="lcNo"
      @on-close="isSupplementaryLcFeeReceiptDialog = false"
    />
    <!-- 補收現金繳費單 -->
    <SupplementaryCashPaySlipDialog
      v-model:is-supplementary-cash-pay-slip-dialog="isSupplementaryCashPaySlipDialog"
      :lc-no="lcNo"
      @on-close="isSupplementaryCashPaySlipDialog = false"
    />
    <!-- 補收轉帳支出傳票 -->
    <SupplementaryTransferVoucherDialog
      v-model:is-supplementary-transfer-voucher-dialog="isSupplementaryTransferVoucherDialog"
      :lc-no="lcNo"
      @on-close="isSupplementaryTransferVoucherDialog = false"
    />

    <!-- Draft Dialog -->
    <DraftDetailDialog
      v-model:is-draft-detail-dialog="isDraftDetailDialog"
      @on-close="isDraftDetailDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ListItem, QueryFormPayload } from '@/types/queryDraft'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryDraft'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)
  // 信用狀比對結果 Dialog
  const isLcComparisonResultDialog = ref(false)
  // 單據遞送單 Dialog
  const isDocumentDeliveryDialog = ref(false)
  // 現金繳費單 Dialog
  const isCashPaySlipDialog = ref(false)
  // 押匯手續費收據 Dialog
  const isDraftFeeReceiptDialog = ref(false)
  // 匯款交易附件 Dialog
  const isRemittanceAttachmentDialog = ref(false)
  // 承兌手續費收據 Dialog
  const isAcceptanceFeeReceiptDialog = ref(false)
  // 轉帳支出傳票 Dialog
  const isTransferVoucherDialog = ref(false)
  // 補收開狀手續費收據 Dialog
  const isSupplementaryLcFeeReceiptDialog = ref(false)
  // 補收現金繳費單 Dialog
  const isSupplementaryCashPaySlipDialog = ref(false)
  // 補收轉帳支出傳票 Dialog
  const isSupplementaryTransferVoucherDialog = ref(false)
  // Draft Dialog
  const isDraftDetailDialog = ref(false)
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
  const isShowCurrentPageTotalAmount = ref<boolean>(true)
  const isShowTotalPages = ref<boolean>(false)
  const isShowTotalAmount = ref<boolean>(true)
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true },
    { title: '匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀餘額', key: 'availableBalance', align: 'end', sortable: false, nowrap: true },
    { title: '有效期限', key: 'validDate', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀比對結果', key: 'lcComparisonResult', align: 'center', sortable: false, nowrap: false, minWidth: '90px' },
    { title: '押匯申請日期', key: 'draftIssueDate', align: 'center', sortable: false, nowrap: true },
    { title: '押匯放行日期', key: 'draftReleaseDate', align: 'center', sortable: false, nowrap: true },
    { title: '押匯金額', key: 'issuingAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
    { title: '尚待核准人員', key: 'pendingApprover', align: 'center', sortable: false, nowrap: false, minWidth: '110px' },
    {
      title: '押匯行單據',
      key: 'draftBankDocs',
      align: 'center',
      sortable: false,
      children: [
        { title: '單據遞送單', key: 'documentDelivery', align: 'center', sortable: false, nowrap: false, minWidth: '70px' },
        { title: '匯款交易附件 (含轉帳收入傳票)', key: 'remittanceAttachment', align: 'center', sortable: false, nowrap: false, minWidth: '140px' },
        { title: '現金繳費單', key: 'cashPaySlip', align: 'center', sortable: false, nowrap: false, minWidth: '80px' },
        { title: '押匯手續費收據', key: 'draftFeeReceipt', align: 'center', sortable: false, nowrap: false, minWidth: '90px' },
        { title: '承兌手續費收據', key: 'acceptanceFeeReceipt', align: 'center', sortable: false, nowrap: false, minWidth: '90px' },
        { title: '轉帳支出傳票', key: 'transferVoucher', align: 'center', sortable: false, nowrap: false, minWidth: '80px' },
      ],
    },
    {
      title: '開狀行單據',
      key: 'issuingBankDocs',
      align: 'center',
      sortable: false,
      children: [
        { title: '補收開狀手續費收據', key: 'supplementaryLcFeeReceipt', align: 'center', sortable: false, nowrap: false, minWidth: '100px' },
        { title: '補收現金繳費單', key: 'supplementaryCashPaySlip', align: 'center', sortable: false, nowrap: false, minWidth: '90px' },
        { title: '補收轉帳支出傳票', key: 'supplementaryTransferVoucher', align: 'center', sortable: false, nowrap: false, minWidth: '90px' },
      ],
    },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    queryMode: '',
    lcNo: '',
    beneficiaryTaxId: '',
    issuingBank: '',
    lcStatus: [],
    lcType: '',
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
  const totalPageAmount = ref<number>(0) // 本頁總金額
  const totalPagePositiveBalanceItems = ref<number>(0) // 本頁可用餘額大於零總筆數
  const totalPagePositiveBalanceAmount = ref<number>(0) // 本頁可用餘額大於零總金額

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
          beneficiaryTaxId: '',
          issuingBank: '',
          lcStatus: [],
          lcType: '',
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
    const { lcNo, beneficiaryTaxId, issuingBank, lcStatus, lcType, issueDateStart, issueDateEnd } = searchForm.value
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      lcNo,
      beneficiaryTaxId,
      issuingBank,
      lcStatus,
      lcType,
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
      const { status, data: { items: sourceData, summary: { total, amount, positiveItems, positiveAmount } } } = res
      if (status === 200) {
        tableItems.value = sourceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
        totalPageAmount.value = sourceData.reduce((sum, item) => sum + item.issuingAmount, 0) || 0
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

  // 查看Draft Dialog
  function handleDraftView (value: string): void {
    draftNo.value = value
    isDraftDetailDialog.value = true
  }

  function handleDocumentDeliveryView (value: string): void {
    console.log('查看單據遞送單:', value)
    lcNo.value = value
    isDocumentDeliveryDialog.value = true
  }

  function handleRemittanceAttachmentView (value: string): void {
    console.log('查看匯款交易附件:', value)
    isRemittanceAttachmentDialog.value = true
    lcNo.value = value
  }

  function handleDraftFeeReceiptView (value: string): void {
    console.log('查看押匯手續費收據:', value)
    isDraftFeeReceiptDialog.value = true
    lcNo.value = value
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

  function handleSupplementaryLcFeeReceiptView (value: string): void {
    console.log('查看補收開狀手續費收據:', value)
    isSupplementaryLcFeeReceiptDialog.value = true
    lcNo.value = value
  }

  function handleSupplementaryCashPaySlipView (value: string): void {
    console.log('查看補收現金繳費單:', value)
    isSupplementaryCashPaySlipDialog.value = true
    lcNo.value = value
  }

  function handleSupplementaryTransferVoucherView (value: string): void {
    console.log('查看補收轉帳支出傳票:', value)
    isSupplementaryTransferVoucherDialog.value = true
    lcNo.value = value
  }

  // 查看信用狀比對結果 Dialog
  function handleLcComparisonView (value: string): void {
    lcNo.value = value
    isLcComparisonResultDialog.value = true
  }

  // 查看Draft狀態 Dialog
  function handleDraftStatusView (value: string): void {
    lcNo.value = value
    messageTitle.value = '作業訊息'
    message.value = `<p class="font-weight-bold">拒絕原因：</p>
      <p class="text-blue-grey-darken-4">XXXXXXXXXXX</p>`
    messageWidth.value = '600px'
    messageStatus.value = 'alert'
    messageDialog.value = true
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
