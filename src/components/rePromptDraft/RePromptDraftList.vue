<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="lcNo"
        :items="tableItems"
        :items-per-page="pageOptions.itemsPerPage"
        :loading="isLoading"
        :page="pageOptions.page"
        sort-asc-icon="mdi-sort-ascending"
        sort-desc-icon="mdi-sort-descending"
        sort-icon="mdi-swap-vertical"
        striped="odd"
      >
        <template #header.accepted>
          <div class="d-flex flex-column align-center">
            <v-btn
              class="hnb__btn--select my-1"
              size="small"
              @click="acceptAll"
            >
              全選
            </v-btn>
          </div>
        </template>

        <template #header.rejected>
          <div class="d-flex flex-column align-center">
            <v-btn
              class="hnb__btn--select my-1"
              size="small"
              @click="rejectAll"
            >
              取消全選
            </v-btn>
          </div>
        </template>

        <template #item.accepted="{ item }">
          <div class="d-flex justify-center">
            <input
              :checked="item.isAccepted === true"
              :name="`accept-${item.lcNo}`"
              type="radio"
              @change="item.isAccepted = true"
            >
          </div>
        </template>

        <template #item.rejected="{ item }">
          <div class="d-flex justify-center">
            <input
              :checked="item.isAccepted === false"
              :name="`accept-${item.lcNo}`"
              type="radio"
              @change="item.isAccepted = false"
            >
          </div>
        </template>

        <template #item.lcBalanceAmount="{ item }">
          $ {{ thousandsFormatting(item.lcBalanceAmount?.toLocaleString()) }}
        </template>

        <template #item.issuingAmount="{ item }">
          $ {{ thousandsFormatting(item.issuingAmount?.toLocaleString()) }}
        </template>
      </v-data-table>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-current-page-total-amount="isShowCurrentPageTotalAmount"
      :is-show-total-pages="isShowTotalPages"
      :total-items="tableItems.length"
      :total-page-amount="totalPageAmount"
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
  </div>
</template>

<script setup lang="ts">
  import type { ListItem, QueryFormPayload } from '@/types/rePromptDraft'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/rePromptDraft'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-edit'])

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const isShowTotalPages = ref<boolean>(false)
  const isShowCurrentPageTotalAmount = ref<boolean>(true)
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'senNo', align: 'center', sortable: false, nowrap: true },
    { title: '接受', key: 'accepted', align: 'center', sortable: false, width: 50 },
    { title: '拒絕', key: 'rejected', align: 'center', sortable: false, width: 50 },
    { title: '匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請人名稱', key: 'applicantName', align: 'start', sortable: false, nowrap: true },
    { title: '申請人統編', key: 'buyerTaxId', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀餘額', key: 'lcBalanceAmount', align: 'end', sortable: false, nowrap: true },
    { title: '信用狀到期日', key: 'lcExpiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '押匯日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '押匯金額', key: 'issuingAmount', align: 'end', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    beneficiary: null, // 受益人
    buyerTaxId: null, // 買受人統編
    lcNo: null, // 信用狀號碼
    draftNo: null, // 匯票號碼
    appDateStart: null, // 開狀日期起
    appDateEnd: null, // 開狀日期訖
    issueDateStart: null, // 押匯日期起
    issueDateEnd: null, // 押匯日期訖
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
    sortBy: [{ key: 'lcNo', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalPageAmount = ref<number>(0) // 總金額

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          beneficiary: null,
          buyerTaxId: null,
          lcNo: null,
          draftNo: null,
          appDateStart: null,
          appDateEnd: null,
          issueDateStart: null,
          issueDateEnd: null,
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
    const { beneficiary } = searchForm.value
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      beneficiary,
      page,
      itemsPerPage,
    }
    console.log('Fetching list with payload:', payload, 'Page:', page, 'Items per page:', itemsPerPage)
    isLoading.value = true
    try {
      const res = await getDatacList(payload)
      console.log('API response:', res)
      const { status, data: { items: sourceData, summary: { total, amount } } } = res
      if (status === 200) {
        tableItems.value = sourceData || []
        totalCount.value = total || 0
        totalPageAmount.value = amount || 0
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

  onMounted(fetchLcAppList)

  function acceptAll (): void {
    for (const item of tableItems.value) {
      item.isAccepted = true
    }
  }

  function rejectAll (): void {
    for (const item of tableItems.value) {
      item.isAccepted = false
    }
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
