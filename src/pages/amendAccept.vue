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

      <h1 class="ms-4 hnb16__title">修改信用狀接受註記</h1>

      <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
        <v-data-table
          class="table-sm hnb__table bg-white"
          color="blue-darken-2"
          density="compact"
          :headers="amendAcceptHeaders"
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
          <template #header.accepted>
            <div class="d-flex flex-column align-center">
              <span class="mb-1">接受</span>

              <v-btn
                class="hnb__btn--select"
                size="small"
                @click="acceptAll"
              >
                全選
              </v-btn>
            </div>
          </template>

          <template #header.rejected>
            <div class="d-flex flex-column align-center">
              <span class="mb-1">不接受</span>

              <v-btn
                class="hnb__btn--select"
                size="small"
                @click="rejectAll"
              >
                全選
              </v-btn>
            </div>
          </template>

          <template #item.accepted="{ item }">
            <div class="d-flex justify-center">
              <input
                :checked="item.isAccepted === true"
                :name="`accept-${item.lcNo}`"
                type="radio"
                @click="handleAcceptClick(item, true)"
              >
            </div>
          </template>

          <template #item.rejected="{ item }">
            <div class="d-flex justify-center">
              <input
                :checked="item.isAccepted === false"
                :name="`accept-${item.lcNo}`"
                type="radio"
                @click="handleAcceptClick(item, false)"
              >
            </div>
          </template>

          <template #item.amendNoticeNo="{ item }">
            <a v-if="item.amendNoticeNo" class="hnb__text--link" href="#" @click.prevent="handleAmendNoticeView(item.amendNoticeNo)">
              {{ item.amendNoticeNo }}
            </a>

            <span v-else>N/A</span>
          </template>

          <template #item.lcNo="{ item }">
            <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
              {{ item.lcNo }}
            </a>

            <span v-else>N/A</span>
          </template>
        </v-data-table>
      </v-card>

      <TablePagination
        v-model:items-per-page="pageOptions.itemsPerPage"
        v-model:page="pageOptions.page"
        class="mx-4"
        :total-amount="totalAmount"
        :total-items="listItems.length"
        :total-pages="totalPages"
        @update:items-per-page="pageOptions.page = 1"
      />

      <v-divider class="ma-4" />

      <div class="d-flex justify-center mt-4 mx-4">
        <v-btn
          class="hnb__btn--cancel mx-1"
          @click="resetAll"
        >
          重設
        </v-btn>

        <v-btn
          class="hnb__btn--default mx-1"
          @click="saveAll"
        >
          確定
        </v-btn>
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
  import type { AmendAcceptItem, AmendAcceptPageOptions } from '@/types/amendAccept'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref } from 'vue'
  import { getAmendAcceptList } from '@/api/amendAccept'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

  const { handleApiError } = useApiErrorHandler()
  const isLoading = ref(false)
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
  const messageWidth = ref<string>('auto')
  const processStatus = ref<string>('')

  const amendAcceptHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, width: 80 },
    { title: '接受', key: 'accepted', align: 'center', sortable: false, width: 80 },
    { title: '不接受', key: 'rejected', align: 'center', sortable: false, width: 80 },
    { title: '修改通知書號碼', key: 'amendNoticeNo', align: 'center', sortable: false },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false },
    { title: '開立日期', key: 'issueDate', align: 'center', sortable: false },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false },
  ]

  const pageOptionsInit = ref<AmendAcceptPageOptions>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [{ key: 'companyId', order: 'asc' }],
  })
  const pageOptions = ref<AmendAcceptPageOptions>({ ...pageOptionsInit.value })
  const listItems = ref<AmendAcceptItem[]>([]) // 列表資料
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

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '申請作業' },
    { title: '修改信用狀接受註記', disabled: true },
  ]

  // 取得列表資料
  async function fetchAmendAcceptList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      page,
      itemsPerPage,
    }
    isLoading.value = true
    try {
      const res = await getAmendAcceptList(payload)
      const { status, data: { data: sorceData, total } } = res
      if (status === 200) {
        listItems.value = sorceData || []
        totalCount.value = total || 0
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

  // 處理接受/不接受單選點擊
  function handleAcceptClick (item: AmendAcceptItem, acceptValue: boolean): void {
    // 如果點擊已選中的選項，則取消選取
    item.isAccepted = item.isAccepted === acceptValue ? null : acceptValue
  }

  // 全部接受
  function acceptAll (): void {
    for (const item of listItems.value) {
      item.isAccepted = true
    }
  }

  // 全部不接受
  function rejectAll (): void {
    for (const item of listItems.value) {
      item.isAccepted = false
    }
  }

  // 重設
  function resetAll (): void {
    pageOptions.value = { ...pageOptionsInit.value }
    listItems.value = []
    totalCount.value = 0
    totalAmount.value = 0
    fetchAmendAcceptList()
  }

  // 確定送出
  async function saveAll (): Promise<void> {
    messageTitle.value = '作業訊息'
    message.value = `確定不接受下列信用狀的修正嗎？<br>
    信用狀號碼：09970017151000888<br>
    信用狀號碼：09970017151000889`
    messageStatus.value = 'alert'
    messageWidth.value = '500px'
    isConfirmBtn.value = true
    messageDialog.value = true
    processStatus.value = 'save'
  }

  async function confirmSave (): Promise<void> {
    // TODO: call save API
    isLoading.value = true
    try {
      messageTitle.value = '儲存成功'
      message.value = '已成功儲存修改信用狀接受註記。'
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
    } catch (error: any) {
      await handleApiError(error, saveAll, {
        messageTitle,
        message,
        messageStatus,
        isConfirmBtn,
        messageDialog,
      })
      return
    } finally {
      isLoading.value = false
    }
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

  onMounted(fetchAmendAcceptList)

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
    if (processStatus.value === 'save') {
      nextTick(() => {
        confirmSave()
      })
    }
  }
</script>
