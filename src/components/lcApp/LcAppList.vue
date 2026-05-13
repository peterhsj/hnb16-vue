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
          variant="flat"
          @click="editItem(item)"
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
    <!-- App Dialog -->
    <AppDialog
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
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

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<LcAppItem[]>([])
  const isLoading = ref(false)
  // App Dialog
  const appDialog = ref(false)
  const appNo = ref<string>('')

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const isShowTotalPages = ref<boolean>(false)
  const isShowTotalAmount = ref<boolean>(true)
  const processStatus = ref<{ action: string, status: number }>({
    action: '',
    status: 0,
  })

  const tableHeaders: DataTableHeader[] = [
    { title: '開狀申請書號碼', key: 'appNo', align: 'center', sortable: false },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false },
    { title: '信用狀別', key: 'lcType', align: 'center', sortable: false },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false },
    { title: '通知銀行', key: 'notifyBank', align: 'center', sortable: false },
    { title: '申請日期', key: 'applyDate', align: 'center', sortable: false },
    { title: '金額', key: 'amount', align: 'end', sortable: false },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false },
    { title: '狀態', key: 'status', align: 'center', sortable: false },
    { title: '操作', key: 'action', align: 'center', sortable: false, width: 200 },
  ]

  interface Props {
    formData?: SearchForm | {}
  }
  const props = defineProps<Props>()
  const searchForm = ref<SearchForm | {}>(props.formData || {
    searchType: 'lcNo',
    lcNo: null,
    appNo: null,
    beneNo: null,
    beneInNo: null,
    status: null,
    startDate: null,
    endDate: null,
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
      searchForm.value = newVal || {}
      pageOptions.value.page = 1
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
    const { lcNo, appNo, beneNo, beneInNo, status, startDate, endDate } = searchForm.value as SearchForm
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
  function editItem (item: LcAppItem): void {
    messageTitle.value = '編輯開狀申請書'
    message.value = `您選擇了編輯開狀申請書，申請書號碼為 ${item.appNo}。`
    messageStatus.value = 'info'
    isConfirmBtn.value = false
    messageDialog.value = true
  }

  // 查看開狀申請書
  function handleAppView (value: string): void {
    // messageTitle.value = '查看開狀申請書'
    // message.value = `您選擇了查看開狀申請書，申請書號碼為 ${appNo}。`
    // messageStatus.value = 'info'
    // isConfirmBtn.value = false
    // messageDialog.value = true
    appNo.value = value
    appDialog.value = true
  }

  // 查看信用狀
  function handleLcView (lcNo: string): void {
    messageTitle.value = '查看信用狀'
    message.value = `您選擇了查看信用狀，信用狀號碼為 ${lcNo}。`
    messageStatus.value = 'info'
    isConfirmBtn.value = false
    messageDialog.value = true
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

  // 離開 App Dialog
  function appDialogClose (): void {
    appDialog.value = false
    appNo.value = ''
  }
</script>
