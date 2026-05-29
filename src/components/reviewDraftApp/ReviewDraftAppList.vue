<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="draftNo"
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
          <a v-if="item.draftNo" class="hnb__text--link" href="#" @click.prevent="handleDraftReview(item.draftNo)">
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

        <template #item.lastAmount="{ item }">
          ${{ thousandsFormatting(item.lastAmount.toLocaleString()) }}
        </template>

        <template #item.draftAmount="{ item }">
          ${{ thousandsFormatting(item.draftAmount.toLocaleString()) }}
        </template>

      </v-data-table>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-current-page-total-amount="true"
      :is-show-total-amount="true"
      :total-amount="totalAmount"
      :total-items="totalCount"
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
  import type { FormPayload, ListItem } from '@/types/reviewDraftApp'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDateList } from '@/api/reviewDraftApp'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-draft-review'])

  const { handleApiError } = useApiErrorHandler()

  const listItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const _isShowTotalPages = ref<boolean>(false)
  const _isShowTotalAmount = ref<boolean>(true)
  const _processStatus = ref<{ action: string, status: number }>({
    action: '',
    status: 0,
  })

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀餘額', key: 'lastAmount', align: 'end', sortable: false, nowrap: true },
    { title: '有效期限', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀比對結果', key: 'notifyBank', align: 'center', sortable: false, nowrap: true },
    { title: '押匯日期', key: 'issuingDate', align: 'center', sortable: false, nowrap: true },
    { title: '押匯金額', key: 'draftAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '尚待核准人員', key: 'pendingApprover', align: 'start', sortable: false, nowrap: false, minWidth: 200 },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
  ]

  interface Props {
    formData?: FormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<FormPayload>(props.formData ?? {
    beneficiaryId: '',
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
  const totalAmount = ref<number>(0) // 總金額
  const totalPageAmount = ref<number>(0) // 當前頁面總金額

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          beneficiaryId: '',
        }
      pageOptions.value.page = 1
      console.log('Search form data changed:', searchForm.value)
      fetchTableList()
    },
    { immediate: true },
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
    const { beneficiaryId } = searchForm.value
    const payload = {
      beneficiaryId,
      itemsPerPage,
      page,
    }
    isLoading.value = true
    try {
      const res = await getDateList(payload)
      const { status, data: { data: sorceData, total, amount } } = res
      if (status === 200) {
        listItems.value = sorceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
        totalPageAmount.value = listItems.value.reduce((sum, item) => sum + item.draftAmount, 0)
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

  // 押匯審核
  function handleDraftReview (draftNo: string): void {
    emits('on-draft-review', { draftNo })
  }

  // 信用狀號碼檢視
  function handleLcView (lcNo: string): void {
    console.log('View LC No:', lcNo)
  }

  onMounted(fetchTableList)

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
