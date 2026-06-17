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
        <h1 class="hnb16__title">修改申請當日調整帳務清冊</h1>

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

            <!-- 預覽修改申請書 -->
            <template #item.amendAppNo="{ item }">
              <a v-if="item.amendAppNo" class="hnb__text--link" href="#" @click.prevent="handleAmendAppView(item.amendAppNo)">
                {{ item.amendAppNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <!-- 預覽信用狀 -->
            <template #item.lcNo="{ item }">
              <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
                {{ item.lcNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <!-- 預覽信用狀修改通知書 -->
            <template #item.amendNoticeNo="{ item }">
              <a v-if="item.amendNoticeNo" class="hnb__text--link" href="#" @click.prevent="handleOpenNoticeDetail(item.amendNoticeNo)">
                {{ item.amendNoticeNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.totalAmount="{ item }">
              ${{ thousandsFormatting(item.totalAmount.toLocaleString()) }}
            </template>

            <template #item.actions="{ item }">
              <v-btn
                class="hnb__btn--default mx-1 my-1"
                size="small"
                variant="flat"
                @click="handleCreditData(item.amendAppNo)"
              >
                授信資料
              </v-btn>
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
        <h1 class="hnb16__title">修改申請書-授信資料</h1>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <v-card-text class="bg-grey-lighten-4">
            <AmendLcAppCreditEditForm
              v-model:form-data="formData"
              :amend-app-no="amendAppNo"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              class="hnb__btn--cancel mx-1 my-2"
              @click="handleAppClose"
            >
              取消
            </v-btn>

            <v-btn
              class="hnb__btn--orange mx-1 my-2"
              @click="isLcAppCreditDialogOpen = true"
            >
              預覽
            </v-btn>

            <v-btn
              class="hnb__btn--default mx-1 my-2"
              @click="saveCreditData"
            >
              確定
            </v-btn>

            <v-spacer />
          </v-card-actions>
        </v-card>
      </div>

      <!-- 預覽修改申請書 Dialogs（依受益人類別顯示） -->
      <AmendLcDialog
        v-model:app-dialog="appDialog"
        :app-no="appNo"
        :ben-type="beneType"
        @on-close="appDialogClose"
      />
      <!-- Lc Dialog -->
      <LcDialog
        v-model:lc-dialog="lcDialog"
        :bene-type="beneType"
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
        :bene-type="beneType"
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

      <!-- 修改申請書-授信資料 Dialog -->
      <AmendLcAppCreditDialog
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
  import type { FormData, ListItem } from '@/types/amendAdjustment'
  import type { PageOptions } from '@/types/common'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDateList } from '@/api/amendAdjustment'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()
  const isLoading = ref(false)
  const isShowList = ref(true)
  const beneType = ref<string>('')

  // 預覽修改申請書 Dialog
  const appDialog = ref(false)
  const appNo = ref<string>('')
  // Lc Dialog
  const lcDialog = ref(false)
  const lcNo = ref<string>('')
  // Lc Detail Dialog (版本詳細)
  const lcDetailDialog = ref(false)
  const lcDetailNo = ref<string>('')
  // Notice Dialog
  const noticeDialog = ref(false)
  const noticeNo = ref<string>('')

  // 授信資料 Dialog
  const isLcAppCreditDialogOpen = ref(false)
  const amendNoticeNoValue = ref<string>('')

  // 查看授信歷程資料 Dialog
  const isShowHistory = ref(true)
  const isHistoryDialogOpen = ref(false)
  const creditNo = ref<string>('')

  // 授信資料編輯 Dialog
  const isShowApp = ref(false)
  const amendAppNo = ref<string>('')

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '當日調整帳務' },
    { title: '修改申請當日調整帳務', to: '/amendAdjustment' },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '修改申請書號碼', key: 'amendAppNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false, nowrap: true },
    { title: '修改通知書號碼', key: 'amendNoticeNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
  ]

  const formData = ref<FormData>({
    pricingBenchmark: null, // 定價指標
    basisRate: '', // 加碼年率
    monthlyAdjust: '01', // 每月調整
    yearlyRate: '', // 固定年利率
    currentBenchmark: '01', // 貨幣市場基準
    basisDayRate: '', // 天期均價利率
    yard: '', // 碼
    rate2: '', // 第二利率
    isAuth: true, // 是否有授權扣帳
    cleanChecked: true, // 是否已確實洗錢防制檢核
    otherReason: null, // 其他定價指標原因
    loanAccount: '', // 放款戶號
    openLoanApprovalNo: '', // 開狀放款核號
    acceptanceLoanApprovalNo: '', // 承兌放款核號
    loanManagerId: '', // 貸放經理人ID
    reviewManagerIdA: '', // 徵審主管 ID-A
    reviewManagerIdB: '', // 徵審主管 ID-B
    openingFee: '', // 開狀手續費
    isStampTaxDeducted: false, // 開狀手續費是否扣印花稅
    acceptanceFee: '', // 承兌手續費
    isAcceptanceFeeStampTaxDeducted: false, // 承兌手續費是否扣印花稅
    depositMarginRate: '', // 存入保證金比率
    guaranteeDeposit: '', // 保證金
    batchNumber: '', // 批次案號
    noticeNo: '', // 信保通知單編號
    cashAmount: '', // 現金金額
    checkAccount1: '', // 支票存款帳號 1
    checkNumber1: '', // 支票號碼 1
    checkAmount1: '', // 金額 1
    checkAccount2: '', // 支票存款帳號 2
    checkNumber2: '', // 支票號碼 2
    checkAmount2: '', // 金額 2
    savingsAccount: '', // 活期存款帳號
    amount1: '', // 第 1 張取款條金額
    amount2: '', // 第 2 張取款條金額
    transferAccount: '', // 轉出會計科目
    transferSerialNumber: '', // 轉出銷帳序號
    transferAmount: '', // 轉出科目金額
    transferSummary: '', // 轉出科目摘要
    guaranteeCondition: null, // 擔保條件
    guaranteeConditionRemark: '', // 擔保條件備註說明
    riskCategoryOne: null, // 風險類別一
    riskCategoryTwo: null, // 風險類別二
    riskCategoryThree: null, // 風險類別三
    riskCategoryFour: null, // 風險類別四
    riskCategoryOnePercentage: '', // 風險類別一百分比
    riskCategoryTwoPercentage: '', // 風險類別二百分比
    riskCategoryThreePercentage: '', // 風險類別三百分比
    riskCategoryFourPercentage: '', // 風險類別四百分比
  })

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

      if (item.title === '修改申請當日調整帳務') {
        isShowList.value = true
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
      fetchTableList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchTableList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      page,
      itemsPerPage,
    }
    isLoading.value = true
    try {
      const res = await getDateList(payload)
      const { status, data: { data: sorceData, total, amount } } = res
      if (status === 200) {
        listItems.value = sorceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
      }
    } catch (error: any) {
      await handleApiError(error, fetchTableList, {
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

  // 開啟預覽修改申請書 Dialog
  function handleAmendAppView (amendAppNo: string): void {
    appDialog.value = true
    appNo.value = amendAppNo
    beneType.value = 'other'
  }

  function appDialogClose (): void {
    appDialog.value = false
    appNo.value = ''
    beneType.value = ''
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

  // 處理授信資料按鈕點擊事件
  function handleCreditData (amendAppNoValue: string): void {
    console.log('授信資料按鈕被點擊', amendAppNoValue)
    amendAppNo.value = amendAppNoValue
    // isAmendLcAppCreditEditDialog.value = true
    isShowList.value = false
    isShowApp.value = true
  }

  // // 儲存授信資料
  // function saveCreditData (): void {
  //   console.log('儲存授信資料，Amend App No:', amendAppNo.value)
  //   // 這裡可以加入實際的儲存邏輯，例如呼叫 API 儲存資料，然後根據結果顯示提示訊息等
  //   messageTitle.value = '訊息通知'
  //   message.value = '授信資料已成功儲存！'
  //   messageStatus.value = 'success'
  //   isConfirmBtn.value = false
  //   messageWidth.value = '400px'
  //   messageDialog.value = true
  // }

  // 儲存授信資料
  function saveCreditData (): void {
    console.log('儲存授信資料，App No:', appNo.value)
    // 這裡可以加入實際的儲存邏輯，例如呼叫 API 儲存資料，然後根據結果顯示提示訊息等
    messageTitle.value = '訊息通知'
    message.value = '作業已完成！待主管審核中'
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageWidth.value = '400px'
    messageDialog.value = true

    isShowList.value = true
    isShowApp.value = false
  }

  // 離開授信資料編輯
  function handleAppClose (): void {
    isShowApp.value = false
    isShowList.value = true
    appNo.value = ''
  }

  function lcAppCreditDialogClose (): void {
    isLcAppCreditDialogOpen.value = false
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

  onMounted(() => {
    fetchTableList()
  })

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
