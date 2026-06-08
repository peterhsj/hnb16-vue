<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #item="{ item }">
            <v-breadcrumbs-item
              :disabled="Boolean(item.disabled)"
              :title="item.title"
              :to="item.title === '申請作業' ? '' : item.to"
              @click="onBreadcrumbClick(item)"
            />
          </template>

          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="isShowList" class="mt-4 mx-4">
        <h1 class="hnb16__title">開狀沖正(EC)清冊</h1>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <v-data-table
            class="table-sm hnb__table bg-white"
            color="blue-darken-2"
            density="compact"
            :headers="tableHeaders"
            hide-default-footer
            item-value="lcNo"
            :items="listItems"
            :items-per-page="pageOptions.itemsPerPage"
            :loading="isLoading"
            :page="pageOptions.page"
            sort-asc-icon="mdi-sort-ascending"
            sort-desc-icon="mdi-sort-descending"
            sort-icon="mdi-swap-vertical"
            striped="odd"
            @update:items-per-page="pageOptions.itemsPerPage = $event"
          >
            <template #item.lcType="{ item }">
              {{ item.lcType === 'sight' ? '即期' : '遠期' }}
            </template>

            <template #item.amendNoticeNo="{ item }">
              <a v-if="item.amendNoticeNo" class="hnb__text--link" href="#" @click.prevent="handleAmendNoticeView(item.amendNoticeNo)">
                {{ item.amendNoticeNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.totalAmount="{ item }">
              ${{ thousandsFormatting(item.totalAmount.toLocaleString()) }}
            </template>
          </v-data-table>
        </v-card>

        <TablePagination
          v-model:items-per-page="pageOptions.itemsPerPage"
          v-model:page="pageOptions.page"
          :is-show-total-amount="true"
          :total-amount="totalAmount"
          :total-items="listItems.length"
          :total-pages="totalPages"
          @update:items-per-page="pageOptions.page = 1"
        />
      </div>

      <div v-if="isShowApp" class="mt-4 mx-4">
        <h1 class="hnb16__title">開狀申請書</h1>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <LcAppInfo :bene-type="beneType" :data="data" />

          <div class="mt-4 text-center">
            <v-btn
              class="hnb__btn--cancel my-2 mx-1"
              variant="flat"
              @click="onClose"
            >
              取消
            </v-btn>

            <v-btn
              class="hnb__btn--orange mx-1"
              variant="flat"
              @click="handleCreditData('')"
            >
              授信資料
            </v-btn>

            <v-btn
              class="hnb__btn--default mx-1"
              variant="flat"
              @click="handleEcData"
            >
              當日沖正(EC)交易
            </v-btn>
          </div>
        </v-card>
      </div>

      <!-- 開狀申請書-授信資料 Dialog -->
      <LcAppCreditDialog
        v-model:is-lc-app-credit-dialog-open="isLcAppCreditDialogOpen"
        :amend-notice-no="amendNoticeNoValue"
        :is-show-history="isShowHistory"
        @on-close="lcAppCreditDialogClose"
        @on-show-history-view="handleHistoryView"
      />

      <!-- 查看授信歷程資料 Dialog -->
      <LcAppHistoryViewDialog
        v-model:is-history-dialog-open="isHistoryDialogOpen"
        :credit-no="creditNo"
        :is-show-history="isShowHistory"
        @on-close="historyDialogClose"
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
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { ListItem } from '@/types/amendLcApp'
  import type { PageOptions } from '@/types/common'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDataList } from '@/api/amendLcApp'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()
  const isLoading = ref(false)
  const isShowList = ref(true)
  const isShowApp = ref(false)
  const beneType = ref<string>('cds')
  const data = {
    paymentMain: 'sight', // sight: 即期, fixed: 定日付款
    fixedExpiryBasis: 'draft_invoice', // draft_invoice: 匯票日期, unified_invoice: 統一發票日期
  }

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '當日沖正交易' },
    { title: '開狀沖正(EC)', to: '/amendLcApp' },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '開狀申請書號碼', key: 'amendNoticeNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '申請日期', key: 'applicationDate', align: 'center', sortable: false, nowrap: true },
    { title: '開狀日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '總金額', key: 'totalAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
  ]

  // 授信資料 Dialog
  const isLcAppCreditDialogOpen = ref(false)
  const amendNoticeNoValue = ref<string>('')

  // 查看授信歷程資料 Dialog
  const isShowHistory = ref(false)
  const isHistoryDialogOpen = ref(false)
  const creditNo = ref<string>('') // 這裡可以根據實際情況設定 creditNo 的值

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const messageWidth = ref<string>('auto')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return

    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '開狀沖正(EC)') {
        isShowList.value = true
        isShowApp.value = false
      }
    }
  }

  const pageOptionsInit = ref<PageOptions>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [{ key: 'companyId', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const listItems = ref<ListItem[]>([]) // 列表資料
  const totalCount = ref<number>(0) // 總筆數
  const totalAmount = ref<number>(0) // 總金額

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => pageOptions.value,
    newVal => {
      console.log('Page options changed:', newVal)
      fetchAmendAcceptList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchAmendAcceptList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      page,
      itemsPerPage,
    }
    isLoading.value = true
    try {
      const res = await getDataList(payload)
      const { status, data: { data: sorceData, total, amount } } = res
      if (status === 200) {
        listItems.value = sorceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
      }
    } catch (error: any) {
      await handleApiError(error, fetchAmendAcceptList, {
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

  function handleAmendNoticeView (amendNoticeNo: string): void {
    console.log('View Amend Notice:', amendNoticeNo)
    isShowList.value = false
    isShowApp.value = true
  }

  function onClose (): void {
    isShowList.value = true
    isShowApp.value = false
  }

  // 處理授信資料按鈕點擊事件
  function handleCreditData (amendNoticeNo: string): void {
    console.log('授信資料按鈕被點擊')
    amendNoticeNoValue.value = amendNoticeNo
    isLcAppCreditDialogOpen.value = true
    // 這裡可以加入實際的處理邏輯，例如跳轉到授信資料頁面或顯示相關資訊等
  }

  function lcAppCreditDialogClose (): void {
    isLcAppCreditDialogOpen.value = false
  }

  // 處理當日沖正(EC)交易按鈕點擊事件
  function handleEcData (): void {
    console.log('當日沖正(EC)交易按鈕被點擊')
    // 這裡可以加入實際的處理邏輯，例如跳轉到當日沖正(EC)交易頁面或顯示相關資訊等
    messageDialog.value = true
    messageTitle.value = '作業訊息'
    message.value = '您確定要沖正此筆資料嗎？'
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    processStatus.value = 'ecData'
  }

  // 處理查看歷程資料事件
  function handleHistoryView (value: string): void {
    console.log('查看歷程資料', value)
    // 這裡可以加入實際的處理邏輯，例如根據傳入的值顯示歷程資料等
    isHistoryDialogOpen.value = true
    creditNo.value = value
  }

  // 查看歷程資料 Dialog 關閉事件
  function historyDialogClose (): void {
    isHistoryDialogOpen.value = false
    creditNo.value = ''
  }

  // 送出當日沖正(EC)交易的確認邏輯
  async function confirmEcData (): Promise<void> {
    console.log('確認沖正當日沖正(EC)交易的邏輯')
    // 這裡可以加入實際的處理邏輯，例如呼叫 API 進行沖正操作，然後根據結果顯示成功或失敗的訊息等
    // 刷新列表資料
    await fetchAmendAcceptList()
    nextTick(() => {
      // 模擬 API 呼叫和處理結果
      messageDialog.value = true
      messageTitle.value = '作業訊息'
      message.value = '作業已完成！'
      messageStatus.value = 'success'
      messageWidth.value = '400px'
      isConfirmBtn.value = false
      processStatus.value = ''
      isShowList.value = true
      isShowApp.value = false
    })
  }

  onMounted(fetchAmendAcceptList)

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    if (processStatus.value === 'ecData') {
      // 在這裡處理當日沖正(EC)交易的邏輯
      console.log('確認沖正當日沖正(EC)交易')
      confirmEcData()
    }
    messageDialog.value = false
  }
</script>
