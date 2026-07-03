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
        <h1 class="hnb16__title">註銷申請當日調整帳務清冊</h1>

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

            <template #item.cancelAppNo="{ item }">
              <a v-if="item.cancelAppNo" class="hnb__text--link" href="#" @click.prevent="handleCancelAppView(item.cancelAppNo)">
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

            <template #item.actions="{ item }">
              <v-btn
                class="hnb__btn--default mx-1 my-1"
                size="small"
                variant="flat"
                @click="handlerCredit(item.cancelAppNo)"
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
        <h1 class="hnb16__title">註銷申請/切結書-授信資料</h1>

        <v-card
          v-if="userInfo.roleName === 'BH'"
          class="border-sm pa-4 bg-grey-lighten-4"
          variant="outlined"
        >
          <v-card-text class="bg-grey-lighten-4 pb-0">
            <CancelAppCreditEditForm
              v-model:form="form"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              class="hnb__btn--cancel my-2 mx-1"
              variant="flat"
              @click="onCloseApp"
            >
              取消
            </v-btn>

            <v-btn
              class="hnb__btn--orange my-2 mx-1"
              variant="flat"
              @click="onPreviewApp"
            >
              預覽
            </v-btn>

            <v-btn
              class="hnb__btn--default mx-1"
              variant="flat"
              @click="handleReviewData"
            >
              確定
            </v-btn>

            <v-spacer />
          </v-card-actions>
        </v-card>

        <v-card
          v-if="userInfo.roleName === 'BS'"
          class="border-sm pa-4 bg-grey-lighten-4"
          variant="outlined"
        >
          <v-card-text class="bg-grey-lighten-4 pb-0">
            <div class="d-flex flex-column align-center">
              <CancelAppCreditInfo />
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              class="hnb__btn--cancel mx-1 my-2"
              @click="onCloseApp"
            >
              取消
            </v-btn>

            <v-btn
              class="hnb__btn--orange mx-1 my-2"
              @click="handleAdjustment(cancelAppNo)"
            >
              當日帳務調整
            </v-btn>

            <v-btn
              class="hnb__btn--default mx-1 my-2"
              @click="handleNoAdjustment(cancelAppNo)"
            >
              不調整
            </v-btn>

            <v-spacer />
          </v-card-actions>
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
      <!-- Cancel App Dialog -->
      <CancelAppDialog
        v-model:is-show-dialog="cancelAppDialog"
        :cancel-app-no="cancelAppNo"
        :is-show-deposit="isShowDeposit"
        :is-show-detail="isShowDetail"
        @on-close="cancelAppDialogClose"
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

      <!-- Cancel 授信資料 Dialog -->
      <CancelAppCreditDialog
        v-model:is-show-cancel-dialog="isShowCancelDialog"
        :cancel-app-no="cancelAppNo"
        @on-close="isShowCancelDialog = false"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { ListItem } from '@/types/cancelAdjustment'
  import type { PageOptions } from '@/types/common'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDateList } from '@/api/cancelAdjustment'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'

  const { handleApiError } = useApiErrorHandler()
  const userStore = useUserStore()
  const userInfo = computed(() => userStore.userInfo)

  const isLoading = ref(false)
  const isShowList = ref(true)
  const isShowApp = ref(false)
  // Cancel App Dialog
  const cancelAppDialog = ref(false)
  const cancelAppNo = ref<string>('')
  const isShowDeposit = ref<boolean>(false)
  const isShowDetail = ref<boolean>(false)

  // Lc Dialog
  const lcDialog = ref(false)
  const lcNo = ref<string>('')
  // Lc Detail Dialog (版本詳細)
  const lcDetailDialog = ref(false)
  const lcDetailNo = ref<string>('')
  // Notice Dialog
  const noticeDialog = ref(false)
  const noticeNo = ref<string>('')
  // Cancel App Credit Dialog
  const isShowCancelDialog = ref(false)

  const form = ref({
    pricingBenchmark: '01',
    accountNo: '',
    transferAccount: '',
    transferSerialNumber: '',
    transferAmount: '',
    transferSummary: '',
  })

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '當日調整帳務' },
    { title: '註銷申請當日調整帳務', to: '/cancelAdjustment' },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '註銷申請書號碼', key: 'cancelAppNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false, nowrap: true },
    { title: '申請日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '有效期限', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const messageWidth = ref<string>('auto')
  const processStatus = ref<string>('')

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return

    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '註銷申請當日調整帳務') {
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

  function handlerCredit (value: string): void {
    console.log('Edit item:', value)
    cancelAppNo.value = value
    isShowList.value = false
    isShowApp.value = true
  }

  // 關閉註銷申請/切結書-授信資料
  function onCloseApp (): void {
    isShowList.value = true
    isShowApp.value = false
  }

  // 確定註銷申請/切結書-授信資料
  function handleReviewData (): void {
    messageTitle.value = '訊息通知'
    message.value = '作業已完成！待主管審核中'
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageWidth.value = '400px'
    messageDialog.value = true

    isShowList.value = true
    isShowApp.value = false
  }

  // 預覽註銷申請/切結書-授信資料
  function onPreviewApp (): void {
    console.log('預覽註銷申請/切結書-授信資料')
    isShowCancelDialog.value = true
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

  // Cancel App Detail Dialog
  function handleCancelAppView (value: string): void {
    cancelAppNo.value = value
    isShowDeposit.value = false // 根據實際情況設定是否顯示退還保證金資訊
    cancelAppDialog.value = true
  }

  function cancelAppDialogClose (): void {
    cancelAppDialog.value = false
    cancelAppNo.value = ''
    isShowDeposit.value = false
  }

  // 當日帳務調整
  function handleAdjustment (value: string): void {
    messageDialog.value = true
    messageWidth.value = '500px'
    messageTitle.value = '作業訊息'
    message.value = '您確定要調整此筆資料嗎？'
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    processStatus.value = 'ecData'
  }

  // 送出當日帳務調整確認邏輯
  async function confirmAdjustment (): Promise<void> {
    console.log('確認當日帳務調整的邏輯')
    // 這裡可以加入實際的處理邏輯，例如呼叫 API 進行調整操作，然後根據結果顯示成功或失敗的訊息等
    // 刷新列表資料
    await fetchTableList()
    nextTick(() => {
      // 模擬 API 呼叫和處理結果
      messageDialog.value = true
      messageTitle.value = '作業訊息'
      message.value = '作業已完成！<br>您的申請書號碼：ENID0990000089已調整'
      messageStatus.value = 'success'
      messageWidth.value = '500px'
      isConfirmBtn.value = false
      processStatus.value = ''
      isShowList.value = true
      isShowApp.value = false
    })
  }

  // 處理不調整按鈕點擊事件
  function handleNoAdjustment (value: string): void {
    console.log('不調整按鈕被點擊')
    messageDialog.value = true
    messageWidth.value = '500px'
    messageTitle.value = '作業訊息'
    message.value = '您確定要還原此筆資料嗎？'
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    processStatus.value = 'noAdjustment'
  }

  // 送出不調整的確認邏輯
  async function confirmNoAdjustment (): Promise<void> {
    console.log('確認不調整操作的邏輯')
    // 這裡可以加入實際的處理邏輯，例如呼叫 API 進行還原操作，然後根據結果顯示成功或失敗的訊息等
    // 刷新列表資料
    await fetchTableList()
    nextTick(() => {
      messageDialog.value = true
      messageTitle.value = '作業訊息'
      message.value = '作業已完成！<br>您的申請書號碼：ENID0990000089不調整'
      messageStatus.value = 'success'
      messageWidth.value = '500px'
      isConfirmBtn.value = false
      processStatus.value = ''
      isShowList.value = true
      isShowApp.value = false
    })
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
    // 確認當日帳務調整
    if (processStatus.value === 'ecData') {
      confirmAdjustment()
    }

    // 確認不調整操作
    if (processStatus.value === 'noAdjustment') {
      confirmNoAdjustment()
    }
    messageDialog.value = false
  }
</script>
