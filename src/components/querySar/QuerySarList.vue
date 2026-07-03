<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        v-model:items-per-page="pageOptions.itemsPerPage"
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="seqNo"
        :items="tableItems"
        :loading="isLoading"
        :page="pageOptions.page"
        sort-asc-icon="mdi-sort-ascending"
        sort-desc-icon="mdi-sort-descending"
        sort-icon="mdi-swap-vertical"
        striped="odd"
        @update:items-per-page="pageOptions.itemsPerPage = $event"
      >

        <template #item.actions="{ item }">
          <v-btn
            class="hnb__btn--default"
            size="small"
            variant="flat"
            @click="handleQueryResult(item)"
          >
            查詢結果
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :total-items="tableItems.length"
      :total-pages="totalPages"
      @update:items-per-page="pageOptions.page = 1"
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
  </div>
</template>

<script setup lang="ts">
  import type { ListItem, QueryFormPayload } from '@/types/querySar'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/querySar'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const messageWidth = ref<string>('auto')
  const isConfirmBtn = ref<boolean>(false)

  const tableHeaders: DataTableHeader[] = [
    { title: '交易日期', key: 'transactionDate', align: 'center', sortable: false, nowrap: true },
    { title: '交易序號', key: 'transactionSeqNo', align: 'center', sortable: false, nowrap: true },
    { title: '作業', key: 'operationType', align: 'center', sortable: false, nowrap: true },
    { title: '主管核準時間', key: 'approvalTime', align: 'center', sortable: false, nowrap: true },
    { title: '異常代碼', key: 'errorCode', align: 'center', sortable: false, nowrap: true },
    { title: '異常訊息', key: 'errorMessage', align: 'start', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    issueDateStart: '',
    issueDateEnd: '',
    operationType: '',
    transactionSeqNo: '',
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
    sortBy: [{ key: 'transactionSeqNo', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          issueDateStart: '', // 申請日期起（格式 YYYY/MM/DD）
          issueDateEnd: '', // 申請日期迄（格式 YYYY/MM/DD）
          operationType: '', // 作業類型
          transactionSeqNo: '', // 交易序號
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
    const { issueDateStart, issueDateEnd, operationType, transactionSeqNo } = searchForm.value
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      issueDateStart, // 申請日期起（格式 YYYY/MM/DD）
      issueDateEnd, // 申請日期迄（格式 YYYY/MM/DD）
      operationType, // 作業類型
      transactionSeqNo, // 交易序號
      page,
      itemsPerPage,
    }
    console.log('Fetching list with payload:', payload, 'Page:', page, 'Items per page:', itemsPerPage)
    isLoading.value = true
    try {
      const res = await getDatacList(payload)
      console.log('API response:', res)
      const { status, data: { items: sourceData, summary: { total } } } = res
      if (status === 200) {
        tableItems.value = sourceData || []
        totalCount.value = total || 0
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

  // 查詢結果
  function handleQueryResult (item: ListItem): void {
    console.log('Query result for item:', item)
    messageTitle.value = '作業訊息'
    messageWidth.value = '500px'
    message.value = '處理結果：核准成功'
    messageStatus.value = 'success'
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
</script>
