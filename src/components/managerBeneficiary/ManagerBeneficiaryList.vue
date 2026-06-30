<template>
  <div>
    <v-card class="border-sm pa-4 mb-2 bg-grey-lighten-4" variant="outlined">
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
        <template #item.confirmStatus="{ item }">
          {{ item.confirmStatus ? '啟用' : '停用' }}
        </template>

        <template #item.actions="{ item }">
          <v-btn
            class="hnb__btn--default mx-1 my-1"
            size="small"
            variant="flat"
            @click="onEdit(item, 'edit')"
          >
            編輯
          </v-btn>

          <v-btn
            class="hnb__btn--red mx-1 my-1"
            size="small"
            variant="flat"
            @click="onDelete(item)"
          >
            刪除
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1 my-1"
            size="small"
            variant="flat"
            @click="onApprove(item, 'approve')"
          >
            核准
          </v-btn>

          <v-btn
            class="hnb__btn--red mx-1 my-1"
            size="small"
            variant="flat"
            @click="onReject(item, 'reject')"
          >
            拒絕
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
  import type { ListItem, QueryFormPayload } from '@/types/managerBeneficiary'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/managerBeneficiary'
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
  const processStatus = ref<string>('')

  interface Props {
    beneType?: string | null
  }
  const props = defineProps<Props>()
  const emits = defineEmits<{
    'on-edit': [{ item: ListItem, type: string }]
  }>()

  const tableHeaders = ref<DataTableHeader[]>([
    { title: '編號', key: 'serNo', align: 'center', sortable: false, nowrap: true },
    { title: '公司統編', key: 'compId', align: 'center', sortable: false, nowrap: true },
    { title: '公司名稱', key: 'compName', align: 'start', sortable: false, nowrap: true },
    { title: '負責人姓名', key: 'managerName', align: 'start', sortable: false, nowrap: true },
    { title: '負責人職稱', key: 'managerTitle', align: 'center', sortable: false, nowrap: true },
    { title: '登記地址', key: 'address', align: 'start', sortable: false, nowrap: true },
    { title: '連絡電話', key: 'phone', align: 'start', sortable: false, nowrap: true },
    { title: '電子信箱', key: 'email', align: 'start', sortable: false, nowrap: true },
    { title: '審核狀態', key: 'confirmStatus', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
  ])

  watch(
    () => props.beneType,
    newVal => {
      console.log('Search beneType:', newVal)
      tableHeaders.value
        = newVal === 'fpc'
          ? [
            { title: '編號', key: 'serNo', align: 'center', sortable: false, nowrap: true },
            { title: '公司統編', key: 'compId', align: 'center', sortable: false, nowrap: true },
            { title: '公司名稱', key: 'compName', align: 'start', sortable: false, nowrap: true },
            { title: '負責人姓名', key: 'managerName', align: 'start', sortable: false, nowrap: true },
            { title: '負責人職稱', key: 'managerTitle', align: 'center', sortable: false, nowrap: true },
            { title: '登記地址', key: 'address', align: 'start', sortable: false, nowrap: true },
            { title: '連絡電話', key: 'phone', align: 'start', sortable: false, nowrap: true },
            { title: '電子信箱', key: 'email', align: 'start', sortable: false, nowrap: true },
            { title: '受益人事業部', key: 'beneficiaryDepartment', align: 'start', sortable: false, nowrap: true },
            { title: '審核狀態', key: 'confirmStatus', align: 'center', sortable: false, nowrap: true },
            { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
          ]
          : [
            { title: '編號', key: 'serNo', align: 'center', sortable: false, nowrap: true },
            { title: '公司統編', key: 'compId', align: 'center', sortable: false, nowrap: true },
            { title: '公司名稱', key: 'compName', align: 'start', sortable: false, nowrap: true },
            { title: '負責人姓名', key: 'managerName', align: 'start', sortable: false, nowrap: true },
            { title: '負責人職稱', key: 'managerTitle', align: 'center', sortable: false, nowrap: true },
            { title: '登記地址', key: 'address', align: 'start', sortable: false, nowrap: true },
            { title: '連絡電話', key: 'phone', align: 'start', sortable: false, nowrap: true },
            { title: '電子信箱', key: 'email', align: 'start', sortable: false, nowrap: true },
            { title: '審核狀態', key: 'confirmStatus', align: 'center', sortable: false, nowrap: true },
            { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
          ]

      fetchLcAppList()
    },
    { immediate: true },
  )

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

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  // 取得列表資料
  async function fetchLcAppList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      importType: props.beneType,
      page,
      itemsPerPage,
    }
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

  // 編輯
  function onEdit (item: ListItem, type: string): void {
    console.log('編輯', item)
    emits('on-edit', { item, type })
  }

  // 刪除
  function onDelete (item: ListItem): void {
    console.log('刪除', item)
    messageTitle.value = '作業訊息'
    message.value = `您確定要刪除此筆資料嗎？`
    messageStatus.value = 'alert'
    processStatus.value = 'delete'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function deleteHandler (): void {
    console.log('執行刪除操作')
    // 在這裡執行刪除操作，例如呼叫 API 刪除資料
    // 刪除後重新取得列表資料
    fetchLcAppList()
    nextTick(() => {
      messageTitle.value = '作業訊息'
      message.value = `作業已完成`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
    })
  }

  // 核准
  function onApprove (item: ListItem, type: string): void {
    messageTitle.value = '作業訊息'
    message.value = `作業已完成`
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
  }

  // 拒絕
  function onReject (item: ListItem, type: string): void {
    messageTitle.value = '作業訊息'
    message.value = `作業已完成`
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
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
    if (processStatus.value === 'delete') {
      console.log('確認刪除')
      // 在這裡執行刪除操作，例如呼叫 API 刪除資料
      // 刪除後重新取得列表資料
      deleteHandler()
    }
    messageDialog.value = false
  }
</script>
