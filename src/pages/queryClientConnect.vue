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
        <h2 class="mx-4 hnb16__title">Client連線狀態</h2>

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
          />
        </v-card>

        <!-- <TablePagination
          v-model:items-per-page="pageOptions.itemsPerPage"
          v-model:page="pageOptions.page"
          :total-items="tableItems.length"
          :total-pages="totalPages"
          @update:items-per-page="pageOptions.page = 1"
        /> -->
      </div>
    </v-container>
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
  import type { ListItem } from '@/types/queryClientConnect'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, ref } from 'vue'
  import { getDatacList } from '@/api/queryClientConnect'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

  const { handleApiError } = useApiErrorHandler()

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '查詢作業' },
    { title: 'Client連線狀態', disabled: true },
  ]

  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'senId', align: 'center', sortable: false, nowrap: true },
    { title: '分行名稱', key: 'branchName', align: 'end', sortable: false, nowrap: true },
    { title: '帳號', key: 'account', align: 'end', sortable: false, nowrap: true },
    { title: '角色', key: 'role', align: 'end', sortable: false, nowrap: true },
    { title: 'IP', key: 'ip', align: 'end', sortable: false, nowrap: true },
    { title: '登入時間', key: 'loginTime', align: 'end', sortable: false, nowrap: true },
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
    sortBy: [{ key: 'senId', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數

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
