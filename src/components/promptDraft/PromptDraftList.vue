<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <p class="mb-2">
        <span class="text-teal-darken-2">
          受益人 中國鋼鐵股份有限公司 於 2025年4月14日14時51分47秒 提示完整下述信用狀項下押匯文件 ( 詳如附件 )，請處理！
        </span>
      </p>

      <p class="mb-2">
        <span class="font-weight-bold">開狀行代碼：</span> 0081050
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

        <template #item.draftAmount="{ item }">
          $ {{ thousandsFormatting(item.draftAmount?.toLocaleString()) }}
        </template>

        <template #item.invoiceAmount="{ item }">
          $ {{ thousandsFormatting(item.invoiceAmount?.toLocaleString()) }}
        </template>

        <template #body.append>
          <tr class="bg-blue-lighten-5">
            <td colspan="4" />
            <td class="text-center font-weight-bold text-red-darken-3">同匯票小計</td>

            <td class="text-right">
              $ 282,125.00
            </td>
          </tr>

          <tr class="bg-blue-lighten-5">
            <td colspan="2" />
            <td class="text-center font-weight-bold text-red-darken-3">同信用狀小計</td>

            <td class="text-right">
              $ 282,125.00
            </td>

            <td class="text-center font-weight-bold text-red-darken-3">同信用狀小計</td>

            <td class="text-right">
              $ 282,125.00
            </td>
          </tr>

          <tr class="bg-blue-lighten-5">
            <td colspan="2" />
            <td class="text-center font-weight-bold text-red-darken-3">開狀行匯票總額</td>

            <td class="text-right">
              $ 282,125.00
            </td>

            <td class="text-center font-weight-bold text-red-darken-3">開狀行發票總額</td>

            <td class="text-right">
              $ 282,125.00
            </td>
          </tr>
        </template>

      </v-data-table>
    </v-card>

    <div class="text-right my-4 text-body-2">
      <span>
        <span class="text-red-darken-3">全部匯票總額：</span>
        NT$ {{ thousandsFormatting(2429574) }}
      </span>

      <span>
        <span class="text-red-darken-3"> / 全部發票總額：</span>
        NT$ {{ thousandsFormatting(4429574) }}
      </span>
    </div>

    <!-- <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-total-amount="isShowTotalAmount"
      :is-show-total-pages="isShowTotalPages"
      :total-amount="totalAmount"
      :total-items="tableItems.length"
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
  import type { ListItem, QueryFormPayload } from '@/types/promptDraft'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/promptDraft'
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
  const isShowTotalAmount = ref<boolean>(true)
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const tableHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '買受人名稱', key: 'buyerName', align: 'start', sortable: false, nowrap: true },
    { title: '求償匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '求償匯票金額', key: 'draftAmount', align: 'end', sortable: false, nowrap: true, width: '15%' },
    { title: '發票號碼', key: 'invoiceNo', align: 'center', sortable: false, nowrap: true, width: '15%' },
    { title: '發票金額', key: 'invoiceAmount', align: 'end', sortable: false, nowrap: true, width: '15%' },
  ]

  interface Props {
    formData?: QueryFormPayload
  }
  const props = defineProps<Props>()
  const searchForm = ref<QueryFormPayload>(props.formData ?? {
    beneficiary: '',
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

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => props.formData,
    newVal => {
      searchForm.value = newVal
        ? { ...newVal }
        : {
          beneficiary: '',
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
