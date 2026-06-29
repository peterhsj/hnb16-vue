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

      <div>
        <h2 class="mx-4 hnb16__title">設定客戶特別指示條款清冊</h2>

        <v-card class="border-sm pa-4 mb-2 bg-grey-lighten-4" variant="outlined">
          <v-data-table
            class="table-sm hnb__table bg-white"
            color="blue-darken-2"
            density="compact"
            :headers="tableHeaders"
            hide-default-footer
            item-value="senId"
            :items="tableItems"
            :items-per-page="-1"
            :loading="isLoading"
            sort-asc-icon="mdi-sort-ascending"
            sort-desc-icon="mdi-sort-descending"
            sort-icon="mdi-swap-vertical"
            striped="odd"
          >
            <template #item.actions="{ item }">
              <v-btn
                class="hnb__btn--default mx-1"
                size="small"
                variant="outlined"
                @click="onEdit(item.taxId)"
              >
                編輯
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
      </div>
    </v-container>

    <SettingSiDialog
      v-model:is-setting-si-dialog="isSettingSiDialog"
      :data="dialogData"
      @on-close="isSettingSiDialog = false"
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
  import type { ListItem } from '@/types/settingSi'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref } from 'vue'
  import { getDatacList } from '@/api/settingSi'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

  const { handleApiError } = useApiErrorHandler()

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '特別指示條款設定作業' },
    { title: '設定客戶特別指示條款', disabled: true },
  ]

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  const isSettingSiDialog = ref<boolean>(false)
  const dialogData = ref<string | null>(null)

  const tableHeaders: DataTableHeader[] = [
    { title: '公司名稱', key: 'companyName', align: 'start', sortable: false, nowrap: true },
    { title: '統一編號', key: 'taxId', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'actions', align: 'center', sortable: false, nowrap: true },
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
    sortBy: [{ key: 'companyName', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  // 取得列表資料
  async function fetchLcAppList () {
    console.log('Fetching list with payload:', {})
    isLoading.value = true
    try {
      const res = await getDatacList({})
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

  // 編輯按鈕點擊事件
  function onEdit (taxId: string): void {
    const selectedItem = tableItems.value.find(item => item.taxId === taxId) || null
    if (selectedItem) {
      dialogData.value = taxId
      isSettingSiDialog.value = true
    } else {
      console.error(`Item with taxId ${taxId} not found.`)
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
