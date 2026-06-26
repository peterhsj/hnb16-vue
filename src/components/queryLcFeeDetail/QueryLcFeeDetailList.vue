<template>
  <div>
    <v-card class="border-sm pa-4 mb-5 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="lcNo"
        :items="tableItems"
        :items-per-page="-1"
        :loading="isLoading"
        sort-asc-icon="mdi-sort-ascending"
        sort-desc-icon="mdi-sort-descending"
        sort-icon="mdi-swap-vertical"
        striped="odd"
      >

        <template #item.issueCount="{ item }">
          {{ thousandsFormatting(item.issueCount.toLocaleString()) }}
        </template>

        <template #item.issueFeeTotal="{ item }">
          ${{ thousandsFormatting(item.issueFeeTotal.toLocaleString()) }}
        </template>

        <template #item.amendCount="{ item }">
          {{ thousandsFormatting(item.amendCount.toLocaleString()) }}
        </template>

        <template #item.amendFeeTotal="{ item }">
          ${{ thousandsFormatting(item.amendFeeTotal.toLocaleString()) }}
        </template>

        <template #item.acceptanceCount="{ item }">
          {{ thousandsFormatting(item.acceptanceCount.toLocaleString()) }}
        </template>

        <template #item.acceptanceFeeTotal="{ item }">
          ${{ thousandsFormatting(item.acceptanceFeeTotal.toLocaleString()) }}
        </template>

        <template #item.discountCount="{ item }">
          {{ thousandsFormatting(item.discountCount.toLocaleString()) }}
        </template>

        <template #item.discountFeeTotal="{ item }">
          ${{ thousandsFormatting(item.discountFeeTotal.toLocaleString()) }}
        </template>
      </v-data-table>
    </v-card>

    <!-- <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-current-page-total-amount="isShowCurrentPageTotalAmount"
      :is-show-total-amount="isShowTotalAmount"
      :is-show-total-pages="isShowTotalPages"
      :total-amount="totalAmount"
      :total-items="tableItems.length"
      :total-page-amount="totalPageAmount"
      :total-pages="totalPages"
      @update:items-per-page="pageOptions.page = 1"
    /> -->
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
  import type { ListItem, QueryFormPayload } from '@/types/queryLcFeeDetail'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryLcFeeDetail'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  // const _isShowCurrentPageTotalAmount = ref<boolean>(true)
  // const _isShowTotalPages = ref<boolean>(false)
  // const _isShowTotalAmount = ref<boolean>(true)
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const tableHeaders: DataTableHeader[] = [
    { title: '分行代號', key: 'branchCode', align: 'center', sortable: false, nowrap: true },
    { title: '分行名稱', key: 'branchName', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀來源', key: 'lcSource', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '開狀筆數', key: 'issueCount', align: 'end', sortable: false, nowrap: true },
    { title: '開狀手續費總計', key: 'issueFeeTotal', align: 'end', sortable: false, nowrap: true },
    { title: '修狀筆數', key: 'amendCount', align: 'end', sortable: false, nowrap: true },
    { title: '修狀手續費總計', key: 'amendFeeTotal', align: 'end', sortable: false, nowrap: true },
    { title: '承兌筆數', key: 'acceptanceCount', align: 'end', sortable: false, nowrap: true },
    { title: '承兌手續費總計', key: 'acceptanceFeeTotal', align: 'end', sortable: false, nowrap: true },
    { title: '押匯筆數', key: 'discountCount', align: 'end', sortable: false, nowrap: true },
    { title: '押匯手續費總計', key: 'discountFeeTotal', align: 'end', sortable: false, nowrap: true },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    issueDateStart: '',
    issueDateEnd: '',
    draftDateStart: '',
    draftDateEnd: '',
    beneficiary: null,
  })

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          issueDateStart: '',
          issueDateEnd: '',
          draftDateStart: '',
          draftDateEnd: '',
          beneficiary: null,
        }
      console.log('Search form data changed:', searchForm.value)
      fetchLcAppList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchLcAppList () {
    const { issueDateStart, issueDateEnd, draftDateStart, draftDateEnd, beneficiary } = searchForm.value
    const payload = { issueDateStart, issueDateEnd, draftDateStart, draftDateEnd, beneficiary }
    console.log('Fetching list with payload:', payload)
    isLoading.value = true
    try {
      const res = await getDatacList(payload)
      console.log('API response:', res)
      const { status, data: { items: sourceData } } = res
      if (status === 200) {
        tableItems.value = sourceData || []
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

  onMounted(() => {
    fetchLcAppList()
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
