<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="isShowList" class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            系統會員清冊
          </h2>

          <div>
            <v-btn
              class="hnb__btn--orange my-2"
              prepend-icon="mdi-plus"
              variant="flat"
              @click="onEdit({ userAccount: '', branchName: '', branchCode: '', userRole: '' }, 'new')"
            >
              新增
            </v-btn>
          </div>
        </div>

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
            </template>
          </v-data-table>

          <!-- <div class="mt-2 text-caption text-red-darken-3">
            請注意：「*」號欄位所顯示之內容並不一定已被賣方( 受益人 )所接受，僅供參考
          </div> -->
        </v-card>

        <TablePagination
          v-model:items-per-page="pageOptions.itemsPerPage"
          v-model:page="pageOptions.page"
          :total-items="tableItems.length"
          :total-pages="totalPages"
          @update:items-per-page="pageOptions.page = 1"
        />

        <!-- 編輯 -->
        <EditManagerMemberDialog
          v-model:is-edit-dialog-open="isEditDialogOpen"
          :data-item="selectedItem"
          :edit-type="editType"
          @on-close="isEditDialogOpen = false"
          @on-save="saveHandler"
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
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { ListItem } from '@/types/managerMember'
  import type { DataTableHeader } from 'vuetify'
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import { getDatacList } from '@/api/managerMember'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '會員管理作業' },
    { title: '會員管理', disabled: true },
  ]

  const isShowList = ref<boolean>(true)

  const { handleApiError } = useApiErrorHandler()

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  const branchFile = ref<File | null>(null)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const tableHeaders: DataTableHeader[] = [
    { title: '用戶帳號', key: 'userAccount', align: 'start', sortable: false, nowrap: true },
    { title: '分行名稱', key: 'branchName', align: 'start', sortable: false, nowrap: true },
    { title: '分行代碼', key: 'branchCode', align: 'center', sortable: false, nowrap: true },
    { title: '用戶角色', key: 'userRole', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: false, width: '300px' },
  ]

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
    sortBy: [{ key: 'userAccount', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => pageOptions.value,
    newVal => {
      console.log('Page options changed:', newVal)
      fetchLcAppList()
    },
    { deep: true },
  ) // 取得列表資料
  async function fetchLcAppList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      page,
      itemsPerPage,
    }
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

  // 編輯
  const editType = ref<string>('') // 'new' or 'edit'
  const isEditDialogOpen = ref<boolean>(false)
  const selectedItem = ref<ListItem>({ userAccount: '', branchName: '', branchCode: '', userRole: '' })
  function onEdit (item: ListItem, type: string): void {
    console.log('編輯', item)
    editType.value = type
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  // saveHandler
  function saveHandler (): void {
    isEditDialogOpen.value = false
    console.log('儲存資料')
    // 在這裡執行儲存操作，例如呼叫 API 儲存資料
    // 儲存後重新取得列表資料
    messageTitle.value = '作業訊息'
    message.value = `作業已完成`
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
    fetchLcAppList()
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

  // 匯入分行資料
  function onSaveBranchFile (): void {
    if (!branchFile.value) {
      messageTitle.value = '作業訊息'
      message.value = `請選擇要匯入的檔案`
      messageStatus.value = 'alert'
      isConfirmBtn.value = false
      messageDialog.value = true
      return
    }
    console.log('匯入分行資料', branchFile.value)
    // 在這裡執行匯入操作，例如呼叫 API 匯入資料
    // 匯入後重新取得列表資料
    fetchLcAppList()
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
