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
        <h1 class="hnb16__title">開狀申請書待審核清冊</h1>

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
            <template #item.lcAppNo="{ item }">
              <a v-if="item.lcAppNo" class="hnb__text--link" href="#" @click.prevent="handleLcAppNoView(item.lcAppNo)">
                {{ item.lcAppNo }}
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
        <h1 class="hnb16__title">審核開狀申請書</h1>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <LcAppInfo :bene-type="beneType" :data="data" />

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
            <v-col cols="12" md="4" sm="6">
              <v-card class="border-sm bg-white pa-4" elevated="2">
                <v-row>
                  <v-col class="border-e-sm" cols="12" md="8">
                    <div>

                      AA
                    </div>

                    <v-divider class="my-2" />

                    <div class=" text-center">
                      <v-btn
                        class="ma-1 hnb__btn--default"
                        @click="checkBeneId"
                      >
                        檢核受益人統編名
                      </v-btn>
                    </div>
                  </v-col>

                  <v-col class="text-center" cols="12" md="4">
                    <v-btn
                      class="hnb__btn--orange mx-1"
                      variant="flat"
                      @click="handleCreditData(data.value.appNo)"
                    >
                      授信資料
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

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
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { PageOptions } from '@/types/common'
  import type { ListItem } from '@/types/reviewLcApp'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDateList } from '@/api/reviewLcApp'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()
  const isLoading = ref(false)
  const isShowList = ref(true)
  // Lc Dialog
  const lcDialog = ref(false)
  const lcNo = ref<string>('')
  // Lc Detail Dialog (版本詳細)
  const lcDetailDialog = ref(false)
  const lcDetailNo = ref<string>('')
  // Notice Dialog
  const noticeDialog = ref(false)
  const noticeNo = ref<string>('')

  const isShowApp = ref(false)
  const beneType = ref<string>('cds')
  const data = ref<any>({
    appNo: 'LC20240225001',
    lcAmount: 1_000_000,
    fee: 500,
  })

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '編審作業' },
    { title: '開狀申請書', disabled: true },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '開狀申請書號碼', key: 'lcAppNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '金額', key: 'amount', align: 'end', sortable: false, nowrap: true },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '有效期限', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '尚待核准人員', key: 'pendingApprover', align: 'start', sortable: false, nowrap: false, minWidth: 200 },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
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

  function handleLcAppNoView (lcAppNo: string): void {
    console.log('View LC App No:', lcAppNo)
    isShowList.value = false
    isShowApp.value = true
  }

  // 模擬受益人統編名檢核
  function checkBeneId (): void {
    console.log('檢核受益人統編名')
    // 這裡可以加入實際的檢核邏輯，例如呼叫 API 進行檢核，然後根據結果顯示提示訊息等
    messageTitle.value = '檢核結果'
    message.value = '受益人統編名檢核成功！'
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
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

  // 查看修改通知書 Detail Dialog
  function handleAmendNoticeView (value: string): void {
    noticeNo.value = value
    noticeDialog.value = true
  }

  // 確定審核
  function handleReviewData (): void {
    console.log('確定審核')
  }

  // 關閉審核開狀申請書
  function onCloseApp (): void {
    isShowList.value = true
    isShowApp.value = false
  }

  // 處理授信資料按鈕點擊事件
  function handleCreditData (appNo: string): void {
    console.log('授信資料按鈕被點擊')
    // amendNoticeNoValue.value = appNo
    // isLcAppCreditDialogOpen.value = true
  }

  function downloadFile () {
    // 下載電子檔邏輯
    console.log('下載電子檔')
  }

  function printDoc () {
    window.print()
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
