<template>
  <div>
    <v-data-table
      v-model="draftAppSelected"
      class="table-sm hnb__table bg-white"
      color="blue-darken-2"
      density="compact"
      :headers="draftAppHeaders"
      hide-default-footer
      item-value="draftNo"
      :items="draftAppItems"
      :items-per-page="pageOptions.itemsPerPage"
      :loading="isLoading"
      :page="pageOptions.page"
      show-select
      sort-asc-icon="mdi-sort-ascending"
      sort-desc-icon="mdi-sort-descending"
      sort-icon="mdi-swap-vertical"
      striped="odd"
      @update:items-per-page="pageOptions.itemsPerPage = $event"
    >
      <template #header.data-table-select="{ allSelected, selectAll, someSelected }">
        <div class="d-flex flex-column align-center" style="width: 80px;">
          <v-btn
            class="hnb__btn--select mt-2"
            :disabled="draftAppSelected.length === 0"
            size="small"
            @click="deleteDraftAppSelected"
          >
            刪除
          </v-btn>

          <v-checkbox-btn
            color="primary"
            :indeterminate="someSelected && !allSelected"
            :model-value="allSelected"
            @update:model-value="selectAll(!allSelected)"
          />
        </div>
      </template>

      <template #item.data-table-select="{ internalItem, isSelected, toggleSelect }">
        <v-checkbox-btn
          class="justify-center"
          color="cyan-darken-3"
          :model-value="isSelected(internalItem)"
          @update:model-value="toggleSelect(internalItem)"
        />
      </template>

      <template #header.status="{ column }">
        <div class="d-flex flex-column align-center">
          <span>{{ column.title }}</span>

          <v-btn
            class="hnb__btn--select mt-2"
            size="small"
            @click="readAll"
          >
            全部已讀
          </v-btn>
        </div>
      </template>

      <template #item.status="{ item }">
        <v-chip
          v-if="item.status"
          class="py-1 px-4"
          color="orange-darken-1"
          label
          size="small"
        >
          已讀
        </v-chip>

        <v-btn
          v-else
          class="hnb__btn--default"
          size="small"
          @click="readItem(item)"
        >
          標為已讀
        </v-btn>
      </template>
    </v-data-table>

    <TablePagination
      v-model:items-per-page="pageOptions.itemsPerPage"
      v-model:page="pageOptions.page"
      :total-amount="totalAmount"
      :total-items="draftAppItems.length"
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
  import type { DraftItem } from '@/api/info'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref } from 'vue'
  import { deleteDraftAppItems, getDraftAppList, markDraftAppRead } from '@/api/info'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

  const { handleApiError } = useApiErrorHandler()

  const draftAppSelected = ref<string[]>([])
  const draftAppItems = ref<DraftItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<{ action: string, status: number }>({
    action: '',
    status: 0,
  })

  const draftAppHeaders: DataTableHeader[] = [
    { title: '主旨', key: 'title', align: 'start', sortable: false },
    { title: '訊息內容', key: 'content', align: 'start', sortable: false },
    { title: '訊息日期', key: 'date', align: 'center', sortable: false },
    { title: '已讀', key: 'status', align: 'center', sortable: false, width: 150 },
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
    sortBy: [{ key: 'companyId', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalAmount = ref<number>(0) // 總金額

  const totalPages = computed(() =>
    Math.ceil(draftAppItems.value.length / pageOptions.value.itemsPerPage),
  )

  watch(
    () => pageOptions.value,
    newVal => {
      console.log('Page options changed:', newVal)
      fetchDraftAppList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchDraftAppList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      page,
      itemsPerPage,
    }
    isLoading.value = true
    try {
      const res = await getDraftAppList(payload)
      const { status, data: { data: sourceData, total } } = res
      if (status === 200) {
        draftAppItems.value = sourceData || []
        totalCount.value = total || 0
      }
    } catch (error: any) {
      await handleApiError(error, fetchDraftAppList, {
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

  onMounted(fetchDraftAppList)

  // 刪除選取的項目
  function deleteDraftAppSelected () {
    messageTitle.value = '作業訊息'
    message.value = '確認刪除選取的訊息嗎？'
    messageStatus.value = 'alert'
    isConfirmBtn.value = true
    messageDialog.value = true
    processStatus.value.action = 'delete'
  }

  async function deleteConfirm () {
    await deleteDraftAppItems(draftAppSelected.value)
    await fetchDraftAppList()
    draftAppSelected.value = []
  }

  async function readItem (item: DraftItem) {
    await markDraftAppRead([item.draftNo])
    item.status = true
  }

  async function readAll () {
    const unread = draftAppItems.value.filter(i => !i.status).map(i => i.draftNo)
    if (unread.length === 0) return
    await markDraftAppRead(unread)
    for (const item of draftAppItems.value) {
      item.status = true
    }
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
    if (processStatus.value.action === 'delete') {
      deleteConfirm()
    }
  }
</script>
