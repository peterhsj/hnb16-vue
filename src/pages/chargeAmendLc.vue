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
        <h1 class="hnb16__title">補收開狀手續費沖正(EC)清冊</h1>

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
            <template #item.draftNo="{ item }">
              <a v-if="item.draftNo" class="hnb__text--link" href="#" @click.prevent="handleDraftView(item.draftNo)">
                {{ item.draftNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.lcNo="{ item }">
              <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
                {{ item.lcNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.lcAmount="{ item }">
              ${{ thousandsFormatting(item.lcAmount.toLocaleString()) }}
            </template>

            <template #item.lastAmount="{ item }">
              ${{ thousandsFormatting(item.lastAmount.toLocaleString()) }}
            </template>

            <template #item.issuingAmount="{ item }">
              ${{ thousandsFormatting(item.issuingAmount.toLocaleString()) }}
            </template>

            <template #item.chargeAmount="{ item }">
              ${{ thousandsFormatting(item.chargeAmount.toLocaleString()) }}
            </template>

            <template #item.action="{ item }">
              <v-btn
                class="hnb__btn--default mx-1 my-1"
                size="small"
                variant="flat"
                @click="handleEcData(item.lcNo)"
              >
                當日更正
              </v-btn>
            </template>
          </v-data-table>
        </v-card>

        <TablePagination
          v-model:items-per-page="pageOptions.itemsPerPage"
          v-model:page="pageOptions.page"
          :is-show-current-page-total-amount="true"
          :is-show-total-amount="true"
          :total-amount="totalAmount"
          :total-items="listItems.length"
          :total-page-amount="totalAmount"
          :total-pages="totalPages"
          @update:items-per-page="pageOptions.page = 1"
        />
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
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { ListItem } from '@/types/chargeAmendLc'
  import type { PageOptions } from '@/types/common'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDateList } from '@/api/chargeAmendLc'
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

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '當日沖正交易' },
    { title: '補收開狀手續費沖正(EC)', to: '/chargeAmendLc' },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '開狀日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '開狀金額', key: 'lcAmount', align: 'end', sortable: false, nowrap: true },
    { title: '信用狀餘額', key: 'lastAmount', align: 'end', sortable: false, nowrap: true },
    { title: '匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '押匯金額', key: 'issuingAmount', align: 'end', sortable: false, nowrap: true },
    { title: '補收開狀手續費', key: 'chargeAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '有效期限', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'action', align: 'center', sortable: false, nowrap: true },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const messageWidth = ref<string>('auto')
  const isConfirmBtn = ref<boolean>(true)
  const processStatus = ref<string>('')

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return

    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '補收開狀手續費沖正(EC)') {
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

  function handleDraftView (draftNo: string): void {
    console.log('View Draft:', draftNo)
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

  // 處理當日沖正(EC)交易按鈕點擊事件
  function handleEcData (lcNo: string): void {
    console.log('當日沖正(EC)交易按鈕被點擊')
    // 這裡可以加入實際的處理邏輯，例如跳轉到當日沖正(EC)交易頁面或顯示相關資訊等
    messageDialog.value = true
    messageTitle.value = '作業訊息'
    message.value = '您確定要沖正此筆資料嗎？'
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    processStatus.value = 'ecData'
  }

  // 送出當日沖正(EC)交易的確認邏輯
  async function confirmEcData (): Promise<void> {
    console.log('確認沖正當日沖正(EC)交易的邏輯')
    // 這裡可以加入實際的處理邏輯，例如呼叫 API 進行沖正操作，然後根據結果顯示成功或失敗的訊息等
    // 刷新列表資料
    await fetchTableList()
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
    messageDialog.value = false
    if (processStatus.value === 'ecData') {
      confirmEcData()
    }
  }
</script>
