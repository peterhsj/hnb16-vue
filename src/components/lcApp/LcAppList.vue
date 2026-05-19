<template>
  <div>
    <v-data-table
      v-model:items-per-page="pageOptions.itemsPerPage"
      class="table-sm hnb__table bg-white"
      color="blue-darken-2"
      density="compact"
      :headers="tableHeaders"
      hide-default-footer
      item-value="appNo"
      :items="tableItems"
      :loading="isLoading"
      :page="pageOptions.page"
      sort-asc-icon="mdi-sort-ascending"
      sort-desc-icon="mdi-sort-descending"
      sort-icon="mdi-swap-vertical"
      striped="odd"
      @update:items-per-page="pageOptions.itemsPerPage = $event"
    >
      <template #item.appNo="{ item }">
        <a v-if="item.appNo" class="hnb__text--link" href="#" @click.prevent="handleAppView(item.appNo)">
          {{ item.appNo }}
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

      <template #item.action="{ item }">
        <v-btn
          class="hnb__btn--default mx-1 my-1"
          size="small"
          variant="flat"
          @click="editItem('edit', item.appNo)"
        >
          編輯開狀申請書
        </v-btn>
      </template>
    </v-data-table>

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
    <!-- App For Cds Dialog -->
    <AppForCdsDialog
      v-if="searchForm.beneficiaryType === 'cds'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />
    <!-- App For Fpc Dialog -->
    <AppForFpcDialog
      v-if="searchForm.beneficiaryType === 'fpc'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />
    <!-- App For Other Dialog -->
    <AppForOtherDialog
      v-if="searchForm.beneficiaryType === 'other'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />
    <!-- Lc Dialog -->
    <LcDialog
      v-model:lc-dialog="lcDialog"
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
  </div>
</template>

<script setup lang="ts">
  import type { LcAppItem, SearchForm } from '@/api/lcApp'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getLcAppList } from '@/api/lcApp'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-edit'])

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<LcAppItem[]>([])
  const isLoading = ref(false)
  // App Dialog
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
    { title: '開狀申請書號碼', key: 'appNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', sortable: false, nowrap: true },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '申請日期', key: 'applyDate', align: 'center', sortable: false, nowrap: true },
    { title: '金額', key: 'amount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'action', align: 'center', sortable: false, width: 200, nowrap: true },
  ]

  interface Props {
    formData?: SearchForm
  }
  const props = defineProps<Props>()
  const searchForm = ref<SearchForm>(props.formData ?? {
    searchType: 'lcNo',
    lcNo: null,
    appNo: null,
    beneNo: null,
    beneInNo: null,
    status: null,
    startDate: null,
    endDate: null,
    beneficiaryType: null,
    beneficiary: null,
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
          searchType: 'lcNo',
          lcNo: null,
          appNo: null,
          beneNo: null,
          beneInNo: null,
          status: null,
          startDate: null,
          endDate: null,
          beneficiaryType: null,
          beneficiary: null,
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
    const { lcNo, appNo, beneNo, beneInNo, status, startDate, endDate, beneficiary } = searchForm.value as SearchForm
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      lcNo,
      appNo,
      beneNo,
      beneInNo,
      status,
      startDate,
      endDate,
      page,
      itemsPerPage,
      beneficiary,
    }
    console.log('Fetching list with payload:', payload, 'Page:', page, 'Items per page:', itemsPerPage)
    isLoading.value = true
    try {
      const res = await getLcAppList(payload)
      const { status, data: { data: sourceData, total, amount } } = res
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

  // 編輯項目
  function editItem (type: string, appNo: string): void {
    emits('on-edit', { type, appNo })
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
