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
        <h1 class="hnb16__title">開狀申請當日調整帳務清冊</h1>

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

            <template #item.appNo="{ item }">
              <a v-if="item.appNo" class="hnb__text--link" href="#" @click.prevent="handleAppView(item.appNo)">
                {{ item.appNo }}
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
                @click="handlerCredit(item.lcNo)"
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
        <h1 class="hnb16__title">開狀申請書-授信資料</h1>

        <v-card
          v-if="userInfo.roleName === 'BH'"
          class="border-sm pa-4 bg-grey-lighten-4"
          variant="outlined"
        >
          <v-card-text class="bg-grey-lighten-4">
            <LcAppCreditEditForm
              :app-no="appNo"
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

        <v-card
          v-if="userInfo.roleName === 'BS'"
          class="border-sm pa-4 bg-grey-lighten-4"
          variant="outlined"
        >
          <v-card-text class="bg-grey-lighten-4">
            <LcAppCreditInfo
              :app-no="appNo"
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
              @click="handleAdjustment(appNo)"
            >
              當日帳務調整
            </v-btn>

            <v-btn
              class="hnb__btn--default mx-1 my-2"
              @click="handleNoAdjustment(appNo)"
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

      <!-- 預覽開狀申請書 Dialogs（依受益人類別顯示） -->
      <LcAppDialog
        v-model:app-dialog="appDialog"
        :app-no="appNo"
        :bene-type="beneType"
        @on-close="appDialogClose"
      />

      <!-- 授信資料編輯 -->
      <!-- <LcAppCreditEditDialog
        v-model:is-lc-app-credit-edit-dialog="isLcAppCreditEditDialog"
        :app-no="appNo"
        :is-show-preview="true"
        @on-close="isLcAppCreditEditDialog = false"
        @on-save="saveCreditData"
      /> -->

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
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { PageOptions } from '@/types/common'
  import type { ListItem } from '@/types/lcAdjustment'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDataList } from '@/api/lcAdjustment'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()
  const userStore = useUserStore()
  const userInfo = computed(() => userStore.userInfo)

  const isLoading = ref(false)
  const isShowList = ref(true)

  // 開狀申請書-授信資料
  const isShowApp = ref(false)
  // App Dialog
  const appDialog = ref(false)
  const appNo = ref<string>('')
  const beneType = ref<string>('cds')

  // 授信資料 Dialog
  const isLcAppCreditDialogOpen = ref(false)
  const amendNoticeNoValue = ref<string>('')

  // 查看授信歷程資料 Dialog
  const isShowHistory = ref(true)
  const isHistoryDialogOpen = ref(false)
  const creditNo = ref<string>('')

  // 授信資料編輯 Dialog
  const isLcAppCreditEditDialog = ref(false)

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '當日調整帳務' },
    { title: '開狀申請當日調整帳務', to: '/lcAdjustment' },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '開狀申請書號碼', key: 'appNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '申請日期', key: 'applicationDate', align: 'center', sortable: false, nowrap: true },
    { title: '開狀日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '總金額', key: 'totalAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
  ]

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

      if (item.title === '開狀申請當日調整帳務') {
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
      fetchDataList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchDataList () {
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
      await handleApiError(error, fetchDataList, {
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

  // 查看開狀申請書 App Dialog
  function handleAppView (value: string): void {
    appNo.value = value
    appDialog.value = true
  }

  // 離開 App Dialog
  function appDialogClose (): void {
    appDialog.value = false
    appNo.value = ''
  }

  function handlerCredit (lcNo: string): void {
    console.log('Edit item:', lcNo)
    appNo.value = lcNo
    // isLcAppCreditEditDialog.value = true
    isShowList.value = false
    isShowApp.value = true
  }

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
    await fetchDataList()
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
    await fetchDataList()
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
    fetchDataList()
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
