<template>
  <div>
    <v-card class="border-sm pa-4 mb-5 bg-grey-lighten-4" variant="outlined">
      <p class="mb-2">
        <span class="font-weight-bold">申請人名稱：</span> 網優股份有限公司
      </p>

      <p class="mb-2">
        <span class="font-weight-bold">單位：</span> 新台幣 (元)
      </p>

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

        <template #item.lcAmount="{ item }">
          ${{ thousandsFormatting(item.lcAmount.toLocaleString()) }}
        </template>

        <template #item.lcBalance="{ item }">
          ${{ thousandsFormatting(item.lcBalance.toLocaleString()) }}
        </template>

        <template #item.unreturnedDeposit="{ item }">
          ${{ thousandsFormatting(item.unreturnedDeposit.toLocaleString()) }}
        </template>

        <template #body.append>
          <tr class="font-weight-bold bg-blue-lighten-5">
            <td class="text-center" colspan="3">合計</td>

            <td class="text-end">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.lcAmount, 0).toLocaleString()) }}
            </td>

            <td class="text-end">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.lcBalance, 0).toLocaleString()) }}
            </td>

            <td class="text-end">
              ${{ thousandsFormatting(tableItems.reduce((sum, item) => sum + item.unreturnedDeposit, 0).toLocaleString()) }}
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
  </div>
</template>

<script setup lang="ts">
  import type { ListItem, QueryFormPayload } from '@/types/queryOutstandLc'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/queryOutstandLc'
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
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '開狀日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '有效日期', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '開狀金額', key: 'lcAmount', align: 'end', sortable: false, nowrap: true },
    { title: '信用狀餘額', key: 'lcBalance', align: 'end', sortable: false, nowrap: true },
    { title: '未退還保證金', key: 'unreturnedDeposit', align: 'end', sortable: false, nowrap: true },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    applicantName: '',
    applicantTaxId: '',
  })

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          applicantName: '',
          applicantTaxId: '',
        }
      console.log('Search form data changed:', searchForm.value)
      fetchLcAppList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchLcAppList () {
    const { applicantName, applicantTaxId } = searchForm.value
    const payload = { applicantName, applicantTaxId }
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
