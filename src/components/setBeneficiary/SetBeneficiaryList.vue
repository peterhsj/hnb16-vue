<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="senNo"
        :items="tableItems"
        :items-per-page="pageOptions.itemsPerPage"
        :loading="isLoading"
        :page="pageOptions.page"
        sort-asc-icon="mdi-sort-ascending"
        sort-desc-icon="mdi-sort-descending"
        sort-icon="mdi-swap-vertical"
        striped="odd"
      >
        <template #item.reviewStatus="{item}">
          <v-chip
            class="ma-0"
            :color="item.reviewStatus === true ? 'green' : item.reviewStatus === false ? 'red' : 'grey'"
            size="small"
          >
            <v-icon class="me-1" :icon="item.reviewStatus ? 'mdi-check' : 'mdi-stop'" size="18" />
            <span>{{ item.reviewStatus ? '啟用' : '停用' }}</span>
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            class="hnb__btn--default mx-1"
            size="small"
            variant="flat"
            @click="handleApprove(item.senNo)"
          >
            核准
          </v-btn>

          <v-btn
            class="hnb__btn--red mx-1"
            size="small"
            variant="flat"
            @click="handleReject(item.senNo)"
          >
            拒絕
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
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
  </div>
</template>

<script setup lang="ts">
  import type { ListItem, QueryFormPayload } from '@/types/setBeneficiary'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/setBeneficiary'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

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
  const totalAmount = ref<number>(0)
  const processStatus = ref<string>('')

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'senNo', align: 'center', sortable: false, nowrap: true, width: 80 },
    { title: '公司統編', key: 'companyTaxId', align: 'center', sortable: false, nowrap: true },
    { title: '公司名稱', key: 'companyName', align: 'start', sortable: false, nowrap: true },
    { title: '負責人姓名', key: 'responsiblePersonName', align: 'start', sortable: false, nowrap: true },
    { title: '負責人職稱', key: 'responsiblePersonTitle', align: 'start', sortable: false, nowrap: true },
    { title: '登記地址', key: 'registeredAddress', align: 'start', sortable: false, nowrap: true },
    { title: '連絡電話', key: 'contactPhone', align: 'center', sortable: false, nowrap: true },
    { title: '電子信箱', key: 'email', align: 'start', sortable: false, nowrap: true },
    { title: '受益人事業部', key: 'beneficiaryDepartment', align: 'start', sortable: false, nowrap: true },
    { title: '審核狀態', key: 'reviewStatus', align: 'center', sortable: false, nowrap: true },
  ]

  interface Props {
    formData?: QueryFormPayload
  }

  const props = defineProps<Props>()

  const searchForm = ref(props.formData ?? { queryMode: '' })

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
    sortBy: [{ key: 'senNo', order: 'asc' }],
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
          queryMode: '',
        }
      pageOptions.value.page = 1
      console.log('Search form data changed:', searchForm.value)
      fetchDataList()
    },
    { deep: true },
  )

  watch(
    () => pageOptions.value,
    newVal => {
      console.log('Page options changed:', newVal)
      fetchDataList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchDataList () {
    const { queryMode } = searchForm.value
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      queryMode,
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
      }
    } catch (error: any) {
      await handleApiError(error, fetchDataList, {
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

  function handleApprove (senNo: string): void {
    console.log('核准，信用狀號碼:', senNo)
    messageTitle.value = '作業訊息'
    message.value = `您確定將核准所選取的資料嗎？`
    processStatus.value = 'approve'
    messageStatus.value = 'success'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function confirmApprove (): void {
    console.log('確認核准，執行相關邏輯')
    // 在此處執行核准的 API 呼叫或其他邏輯
  }

  function handleReject (senNo: string): void {
    console.log('拒絕，信用狀號碼:', senNo)
    messageTitle.value = '作業訊息'
    message.value = `您確定將拒絕所選取的資料嗎？`
    processStatus.value = 'reject'
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function confirmReject (): void {
    console.log('確認拒絕，執行相關邏輯')
    // 在此處執行拒絕的 API 呼叫或其他邏輯
  }

  onMounted(() => {
    fetchDataList()
  })

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    if (processStatus.value === 'approve') {
      confirmApprove()
    }
    if (processStatus.value === 'reject') {
      confirmReject()
    }
    messageDialog.value = false
  }
</script>
