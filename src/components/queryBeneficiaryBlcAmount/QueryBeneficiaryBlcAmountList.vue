<template>
  <div>
    <v-card class="border-sm pa-4 mb-5 bg-grey-lighten-4" variant="outlined">
      <div class="d-flex align-center justify-space-between mb-2">
        <div>
          <span class="font-weight-bold">開狀日期區間：</span> 2025/08/26 ~ 2025/08/30
        </div>

        <div>
          <span class="font-weight-bold">押匯日期區間：</span> 2025/08/26 ~ 2025/08/30
        </div>

        <div>
          <span class="font-weight-bold">受益人：</span> 台灣塑膠工業股份有限公司
        </div>
      </div>

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

        <template #item.cdsidCount="{ item }">
          {{ thousandsFormatting(item.cdsidCount.toLocaleString()) }}
        </template>

        <template #item.cdsidAmount="{ item }">
          ${{ thousandsFormatting(item.cdsidAmount.toLocaleString()) }}
        </template>

        <template #item.counterCount="{ item }">
          {{ thousandsFormatting(item.counterCount.toLocaleString()) }}
        </template>

        <template #item.counterAmount="{ item }">
          ${{ thousandsFormatting(item.counterAmount.toLocaleString()) }}
        </template>

        <template #item.onlineCount="{ item }">
          {{ thousandsFormatting(item.onlineCount.toLocaleString()) }}
        </template>

        <template #item.onlineAmount="{ item }">
          ${{ thousandsFormatting(item.onlineAmount.toLocaleString()) }}
        </template>

        <template #item.discountCount="{ item }">
          {{ thousandsFormatting(item.discountCount.toLocaleString()) }}
        </template>

        <template #item.discountAmount="{ item }">
          ${{ thousandsFormatting(item.discountAmount.toLocaleString()) }}
        </template>

        <template #body.append>
          <tr class="font-weight-bold bg-blue-lighten-5">
            <td class="text-center text-red-darken-2">合計</td>

            <td />

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.cdsidCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.cdsidAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.counterCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.counterAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.discountCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.discountAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.onlineCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.onlineAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.electronicDiscountCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.electronicDiscountAmount, 0).toLocaleString()) }}
            </td>
          </tr>

          <tr class="font-weight-bold bg-blue-lighten-5">
            <td class="text-center text-red-darken-2">總合計</td>

            <td />

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.cdsidCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.cdsidAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.counterCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.counterAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.discountCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.discountAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.onlineCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.onlineAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              {{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.electronicDiscountCount, 0).toLocaleString()) }}
            </td>

            <td class="text-end text-red-darken-2">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.electronicDiscountAmount, 0).toLocaleString()) }}
            </td>

          </tr>
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
  import type { ListItem, QueryFormPayload } from '@/types/queryBeneficiaryBlcAmount'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryBeneficiaryBlcAmount'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
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
    { title: 'CDSID 開狀筆數', key: 'cdsidCount', align: 'end', sortable: false, nowrap: true },
    { title: 'CDSID 開狀金額', key: 'cdsidAmount', align: 'end', sortable: false, nowrap: true },
    { title: '臨櫃開狀筆數', key: 'counterCount', align: 'end', sortable: false, nowrap: true },
    { title: '臨櫃開狀金額', key: 'counterAmount', align: 'end', sortable: false, nowrap: true },
    { title: '網銀開狀筆數', key: 'onlineCount', align: 'end', sortable: false, nowrap: true },
    { title: '網銀開狀金額', key: 'onlineAmount', align: 'end', sortable: false, nowrap: true },
    { title: '臨櫃押匯筆數', key: 'discountCount', align: 'end', sortable: false, nowrap: true },
    { title: '臨櫃押匯金額', key: 'discountAmount', align: 'end', sortable: false, nowrap: true },
    { title: '電子押匯筆數', key: 'electronicDiscountCount', align: 'end', sortable: false, nowrap: true },
    { title: '電子押匯金額', key: 'electronicDiscountAmount', align: 'end', sortable: false, nowrap: true },
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
