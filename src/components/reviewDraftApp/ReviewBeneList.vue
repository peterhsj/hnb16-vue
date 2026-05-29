<template>
  <div>
    <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
      <v-data-table
        class="table-sm hnb__table bg-white"
        color="blue-darken-2"
        density="compact"
        :headers="tableHeaders"
        hide-default-footer
        item-value="draftNo"
        :items="listItems"
        :items-per-page="pageOptions.itemsPerPage"
        :loading="isLoading"
        :page="pageOptions.page"
        sort-asc-icon="mdi-sort-ascending"
        sort-desc-icon="mdi-sort-descending"
        sort-icon="mdi-swap-vertical"
        striped="odd"
        @update:items-per-page="pageOptions.itemsPerPage = $event"
      >
        <template #item.beneficiary="{ item }">
          <a v-if="item.beneficiary" class="hnb__text--link" href="#" @click.prevent="showList(item.beneficiaryId)">
            {{ item.beneficiary }}
          </a>

          <span v-else>N/A</span>
        </template>

        <template #item.count="{ item }">
          {{ thousandsFormatting(item.count.toLocaleString()) }}
        </template>

      </v-data-table>
    </v-card>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :is-show-total-amount="true"
      :is-show-total-pages="true"
      :total-amount="totalAmount"
      :total-items="totalCount"
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
  import type { BeneListItem } from '@/types/reviewDraftApp'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getBeneList } from '@/api/reviewDraftApp'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const emits = defineEmits(['on-show-list'])
  const { handleApiError } = useApiErrorHandler()

  const listItems = ref<BeneListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const _isShowTotalPages = ref<boolean>(false)
  const _isShowTotalAmount = ref<boolean>(true)
  const _processStatus = ref<{ action: string, status: number }>({
    action: '',
    status: 0,
  })

  const tableHeaders: DataTableHeader[] = [
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '筆數', key: 'count', align: 'center', sortable: false, nowrap: true, width: 200 },
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
    sortBy: [{ key: 'lcNo', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalAmount = ref<number>(0) // 總金額

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => pageOptions.value,
    newVal => {
      console.log('Page options changed:', newVal)
      fetchTableList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchTableList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      itemsPerPage,
      page,
    }
    isLoading.value = true
    try {
      const res = await getBeneList(payload)
      const { status, data: { data: sorceData, total, amount } } = res
      if (status === 200) {
        listItems.value = sorceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
      }
    } catch (error: any) {
      await handleApiError(error, fetchTableList, {
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

  // 編輯項目
  function showList (beneficiaryId: string): void {
    emits('on-show-list', beneficiaryId)
  }

  onMounted(fetchTableList)

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
