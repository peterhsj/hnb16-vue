<template>
  <div>
    <v-card class="border-sm pa-4 mb-5 bg-grey-lighten-4" variant="outlined">
      <!-- <p class="mb-2">
        <span class="font-weight-bold">申請人名稱：</span> 網優股份有限公司
      </p>

      <p class="mb-2">
        <span class="font-weight-bold">單位：</span> 新台幣 (元)
      </p> -->

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
        <!-- <template #item.lcNo="{ item }">
          <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
            {{ item.lcNo }}
          </a>

          <span v-else>N/A</span>
        </template> -->

        <template #item.draftAmount="{ item }">
          ${{ thousandsFormatting(item.draftAmount.toLocaleString()) }}
        </template>

        <template #item.draftFee="{ item }">
          ${{ thousandsFormatting(item.draftFee.toLocaleString()) }}
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
  import type { ListItem, QueryFormPayload } from '@/types/queryNegotiationFee'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryNegotiationFee'
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
    { title: '押匯/承兌日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '開狀行', key: 'issuingBank', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '押匯行', key: 'draftBank', align: 'center', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '信用狀號碼', key: 'lcNumber', align: 'center', sortable: false, nowrap: true },
    { title: '押匯金額', key: 'draftAmount', align: 'end', sortable: false, nowrap: true },
    { title: '入帳帳號', key: 'accountNumber', align: 'center', sortable: false, nowrap: true },
    { title: '押匯手續費', key: 'draftFee', align: 'end', sortable: false, nowrap: true },
    { title: '押匯手續費優惠原因', key: 'draftFeeDiscountReason', align: 'start', sortable: false, nowrap: true },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    draftDateStart: '',
    draftDateEnd: '',
  })

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          draftDateStart: '',
          draftDateEnd: '',
        }
      console.log('Search form data changed:', searchForm.value)
      fetchLcAppList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchLcAppList () {
    const { draftDateStart, draftDateEnd } = searchForm.value
    const payload = { draftDateStart, draftDateEnd }
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
