<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="isShowList" class="mt-4 mx-4">
        <h1 class="hnb16__title">註銷申請待審核清冊</h1>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <v-data-table
            class="table-sm hnb__table bg-white"
            color="blue-darken-2"
            density="compact"
            :headers="tableHeaders"
            hide-default-footer
            item-value="cancelAppNo"
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
            <template #item.cancelAppNo="{ item }">
              <a v-if="item.cancelAppNo" class="hnb__text--link" href="#" @click.prevent="handleCancelAppNoView(item.cancelAppNo)">
                {{ item.cancelAppNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.lcNo="{ item }">
              <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
                {{ item.lcNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.amount="{ item }">
              ${{ thousandsFormatting(item.amount.toLocaleString()) }}
            </template>

          </v-data-table>

          <div class="mt-2 text-caption text-red-darken-3">
            請注意：「*」號欄位所顯示之內容並不一定已被賣方( 受益人 )所接受，僅供參考
          </div>
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
        <h1 class="hnb16__title">審核信用狀註銷申請/切結書</h1>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <CancelAppInfo :data="data" :is-show-edit="isShowEdit" />

          <div class="mt-4 text-center">
            <v-btn
              class="ma-1 hnb__btn--default"
              prepend-icon="mdi-cloud-download"
              @click="downloadFile"
            >
              下載電子檔
            </v-btn>

            <v-btn
              class="ma-1 hnb__btn--orange"
              prepend-icon="mdi-printer"
              @click="printDoc"
            >
              列印
            </v-btn>
          </div>

          <!-- 審核表單 -->
          <v-row class="my-4" justify="center">
            <v-col cols="12" md="6" sm="12">
              <v-card
                v-if="userInfo.roleName === 'BH'"
                class="border-sm bg-white pa-4"
                elevated="2"
              >
                <div class="d-flex align-center ga-2 mb-2">
                  <div class="text-no-wrap text-end w-25">未退還保證金：</div>
                  <div>55000.0</div>

                  <v-btn
                    class="ma-1 hnb__btn--default"
                    @click="checkUnreturnedDeposit"
                  >
                    查詢未退還保證金
                  </v-btn>
                </div>

                <div class="d-flex align-center ga-2 my-3">
                  <div class="text-no-wrap text-end w-25">退還保證金：</div>
                  <div>55000.0</div>
                </div>

                <div class="d-flex align-start ga-2 mb-2">
                  <div class="text-no-wrap text-end w-25 mt-3">退還保證金方式：</div>

                  <div class="w-75">
                    <v-radio-group
                      v-model="reviewForm.pricingBenchmark"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                    >
                      <div class="d-flex align-center text-body-2">
                        <v-radio
                          color="cyan-darken-3"
                          density="compact"
                          hide-details
                          style="flex: none;"
                          value="01"
                        />

                        <div class="d-flex align-center my-1 w-100">
                          <span class="text-no-wrap mx-1">入帳帳號：</span>

                          <v-text-field
                            v-model="reviewForm.accountNo"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            variant="outlined"
                            @click.stop
                          />

                          <v-btn
                            class="ms-2 hnb__btn--default"
                            @click="checkAccountName"
                          >
                            查詢帳號戶名
                          </v-btn>
                        </div>
                      </div>

                      <div class="d-flex align-start text-body-2">
                        <v-radio
                          class="mt-3"
                          color="cyan-darken-3"
                          density="compact"
                          hide-details
                          style="flex: none;"
                          value="02"
                        />

                        <div class="d-flex align-start my-1 w-100">
                          <span class="text-no-wrap mx-1 mt-3">轉入科目：</span>

                          <div class="d-flex flex-column w-100">
                            <div class="d-flex align-center">
                              <div class="text-no-wrap text-end me-2">轉入會計科目：</div>

                              <v-select
                                v-model="reviewForm.transferAccount"
                                bg-color="white"
                                color="teal-darken-2"
                                density="compact"
                                hide-details="auto"
                                item-title="title"
                                item-value="value"
                                :items="[...TRANSFER_ACCOUNT_ITEMS]"
                                variant="outlined"
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="text-no-wrap text-end me-2">轉入銷帳序號：</div>

                              <v-text-field
                                v-model="reviewForm.transferSerialNumber"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="text-no-wrap text-end me-2">轉入科目金額：</div>

                              <v-text-field
                                v-model="reviewForm.transferAmount"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="text-no-wrap text-end me-2">轉入科目摘要：</div>

                              <v-text-field
                                v-model="reviewForm.transferSummary"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </v-radio-group>
                  </div>
                </div>
              </v-card>

              <v-card
                v-if="userInfo.roleName === 'BS'"
                class="border-sm bg-white pa-4"
                elevated="2"
              >
                <div class="d-flex align-center ga-2 mb-2">
                  <div class="text-no-wrap text-end w-25">未退還保證金：</div>
                  <div>55000.0</div>
                </div>

                <div class="d-flex align-center ga-2 my-3">
                  <div class="text-no-wrap text-end w-25">退還保證金：</div>
                  <div>55000.0</div>
                </div>

                <div class="d-flex align-start ga-2 mb-2">
                  <div class="text-no-wrap text-end w-25">退還保證金方式：</div>

                  <div class="w-75">
                    <div class="d-flex align-center text-body-2">
                      <span class="mx-1"><v-icon :icon="reviewForm.pricingBenchmark === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /></span>

                      <div class="d-flex align-center my-1 w-100">
                        <span class="text-no-wrap mx-1">入帳帳號：</span>

                        <span>---</span>
                      </div>
                    </div>

                    <div class="d-flex align-start text-body-2">
                      <span class="mx-1"><v-icon :icon="reviewForm.pricingBenchmark === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /></span>

                      <div class="d-flex align-start my-1 w-100">
                        <span class="text-no-wrap mx-1">轉入科目：</span>

                        <div class="d-flex flex-column w-100">
                          <div class="d-flex align-center">
                            <div class="text-no-wrap text-end me-2">轉入會計科目：</div>

                            <span>13097-099：其他應收款-雜項</span>
                          </div>

                          <div class="d-flex align-center">
                            <div class="text-no-wrap text-end me-2">轉入銷帳序號：</div>

                            <span>---</span>
                          </div>

                          <div class="d-flex align-center">
                            <div class="text-no-wrap text-end me-2">轉入科目金額：</div>

                            <span>55000.0</span>
                          </div>

                          <div class="d-flex align-center">
                            <div class="text-no-wrap text-end me-2">轉入科目摘要：</div>

                            <span>信用狀保證金梅石股份有限公司</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <div class="mt-4 text-center mx-auto">
            <div class="d-inline-flex align-center justify-center">
              <v-radio-group
                v-model="reviewForm.reviewStatus"
                color="cyan-darken-3"
                density="compact"
                hide-details="auto"
                inline
              >
                <v-radio value="approve">
                  <template #label>
                    <span class="text-body-2">核准</span>
                  </template>
                </v-radio>

                <v-radio class="ms-4" value="reject">
                  <template #label>
                    <span class="text-body-2">拒絕 / 拒絕原因：</span>

                    <v-select
                      v-model="reviewForm.rejectReason"
                      clearable
                      color="teal-darken-2"
                      density="compact"
                      :disabled="reviewForm.reviewStatus !== 'reject'"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...REJECT_REASON_ITEMS]"
                      placeholder="請選擇"
                      variant="outlined"
                      width="200px"
                    />
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>

          <div class="mt-4 text-center">
            <v-btn
              class="hnb__btn--cancel my-2 mx-1"
              variant="flat"
              @click="onCloseApp"
            >
              取消
            </v-btn>

            <v-btn
              class="hnb__btn--default mx-1"
              :disabled="reviewForm.reviewStatus === ''"
              variant="flat"
              @click="handleReviewData"
            >
              確定
            </v-btn>
          </div>
        </v-card>
      </div>

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

      <!-- 審核核准 Dialog -->
      <ReviewCancelSuccessDialog
        v-model:is-review-cancel-approve="isReviewCancelApprove"
        :cancel-app-no="cancelAppNo"
        @on-close="closeReviewCancelApproveDialog"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { PageOptions } from '@/types/common'
  import type { ListItem } from '@/types/reviewCancelApp'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDateList } from '@/api/reviewCancelApp'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()
  const userStore = useUserStore()
  const userInfo = computed(() => userStore.userInfo)
  const isLoading = ref(false)
  const isShowList = ref(true)
  // 審核核准 Dialog
  const cancelAppNo = ref<string>('')
  const isReviewCancelApprove = ref(false)

  const isShowApp = ref(false)
  const isShowEdit = ref(true)
  const data = ref<any>({
    appNo: 'LC20240225001',
    beneType: 'cds',
    lcAmount: 1_000_000,
    fee: 500,
  })

  const TRANSFER_ACCOUNT_ITEMS = [
    { title: '13097-099：其他應收款-雜項', value: 'ta1' },
    { title: '13097-100：其他應收款-雜項', value: 'ta2' },
    { title: '13097-101：其他應收款-雜項', value: 'ta3' },
    { title: '13097-102：其他應收款-雜項', value: 'ta4' },
  ]

  interface ReviewForm {
    loanAccountNo: string
    lcLoanApprovalNo: string
    isReintroduce: boolean
    reviewStatus: string
    rejectReason: string | null
    pricingBenchmark?: string | null
    accountNo?: string | null
    transferAccount?: string | null
    transferSerialNumber?: string | null
    transferAmount?: number | null
    transferSummary?: string | null
  }
  const reviewForm = ref<ReviewForm>({
    loanAccountNo: '1750161000861',
    lcLoanApprovalNo: '9900410000',
    isReintroduce: false,
    reviewStatus: '',
    rejectReason: null,
    pricingBenchmark: null,
    accountNo: null,
    transferAccount: null,
    transferSerialNumber: null,
    transferAmount: 55_000,
    transferSummary: '信用狀保證金梅石股份有限公司',
  })

  const REJECT_REASON_ITEMS = [
    { title: '拒絕原因 1', value: 'r1' },
    { title: '拒絕原因 2', value: 'r2' },
    { title: '拒絕原因 3', value: 'r3' },
    { title: '拒絕原因 4', value: 'r4' },
  ]

  // Lc Dialog
  const lcDialog = ref(false)
  const lcNo = ref<string>('')
  // Lc Detail Dialog (版本詳細)
  const lcDetailDialog = ref(false)
  const lcDetailNo = ref<string>('')
  // Notice Dialog
  const noticeDialog = ref(false)
  const noticeNo = ref<string>('')

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '編審作業' },
    { title: '註銷申請/切結書', disabled: true },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '註銷申請書號碼', key: 'cancelAppNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '* 申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '* 金額', key: 'amount', align: 'end', sortable: false, nowrap: true },
    { title: '餘額', key: 'lastAmount', align: 'end', sortable: false, nowrap: true },
    { title: '* 通知銀行', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '* 有效期限', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '尚待核准人員', key: 'pendingApprover', align: 'start', sortable: false, nowrap: false, minWidth: 200 },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const messageWidth = ref<string>('auto')
  const isConfirmBtn = ref<boolean>(false)
  const _processStatus = ref<string>('')

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

  // 查詢未退還保證金
  function checkUnreturnedDeposit (): void {
    console.log('查詢未退還保證金', reviewForm.value.accountNo)
  }

  // 查詢帳號戶名
  function checkAccountName (): void {
    console.log('查詢帳號戶名', reviewForm.value.accountNo)
  }

  function handleCancelAppNoView (cancelAppNo: string): void {
    console.log('View Cancel App No:', cancelAppNo)
    isShowList.value = false
    isShowApp.value = true
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

  // 確定審核
  function handleReviewData (): void {
    console.log('審核結果：', reviewForm.value.reviewStatus)
    if (reviewForm.value.reviewStatus === 'approve') {
      isReviewCancelApprove.value = true
    } else {
      messageTitle.value = '訊息通知'
      message.value = `<span class="font-weight-bold">註銷申請書號碼：</span>
        <span class="text-blue-grey-darken-4">099700017161000861-V-01</span><br>
        <span class="font-weight-bold">審核動作：</span>
        <span class="text-blue-grey-darken-4">退回經辦：王建明退回測試</span><br>
        <span class="font-weight-bold">審核結果：</span>
        <span class="text-blue-grey-darken-4">審核未完成</span>`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageWidth.value = '600px'
      messageDialog.value = true

      isShowList.value = true
      isShowApp.value = false
    }
  }

  // 關閉審核核准 Dialog
  function closeReviewCancelApproveDialog (): void {
    isReviewCancelApprove.value = false
    isShowList.value = true
    isShowApp.value = false
  }

  // 關閉審核開狀申請書
  function onCloseApp (): void {
    isShowList.value = true
    isShowApp.value = false
  }

  function downloadFile () {
    // 下載電子檔邏輯
    console.log('下載電子檔')
  }

  function printDoc () {
    window.print()
  }

  onMounted(() => {
    if (userInfo.value.roleName === 'BS') {
      reviewForm.value.pricingBenchmark = '02'
    }
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
