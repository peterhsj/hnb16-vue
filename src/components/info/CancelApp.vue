<template>
  <div>
    <v-data-table
      v-model="cancelAppSelected"
      class="table-sm hnb__table bg-white"
      color="blue-darken-2"
      density="compact"
      :headers="cancelAppHeaders"
      hide-default-footer
      item-value="cancelNo"
      :items="cancelAppItems"
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
            density="compact"
            :disabled="cancelAppSelected.length === 0"
            elevation="2"
            variant="elevated"
            @click="deleteCancelAppSelected"
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
            density="compact"
            elevation="2"
            variant="elevated"
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
          density="comfortable"
          label
        >
          已讀
        </v-chip>

        <v-btn
          v-else
          class="hnb__btn--default"
          density="compact"
          variant="elevated"
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
      :total-items="cancelAppItems.length"
      :total-pages="totalPages"
      @update:items-per-page="pageOptions.page = 1"
    />
  </div>
</template>

<script setup lang="ts">
  import type { CancelItem } from '@/api/info'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref } from 'vue'
  import { deleteCancelAppItems, getCancelAppList, markCancelAppRead } from '@/api/info'

  const cancelAppSelected = ref<string[]>([])
  const cancelAppItems = ref<CancelItem[]>([])
  const isLoading = ref(false)

  async function fetchCancelAppList () {
    isLoading.value = true
    try {
      const res = await getCancelAppList()
      const { status, data: { data: sourceData } } = res
      if (status === 200) {
        cancelAppItems.value = sourceData || []
      }
    } catch (error) {
      console.error('Error fetching Cancel App list:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchCancelAppList)

  async function deleteCancelAppSelected () {
    await deleteCancelAppItems(cancelAppSelected.value)
    await fetchCancelAppList()
    cancelAppSelected.value = []
  }

  async function readItem (item: CancelItem) {
    await markCancelAppRead([item.cancelNo])
    item.status = true
  }

  async function readAll () {
    const unread = cancelAppItems.value.filter(i => !i.status).map(i => i.cancelNo)
    if (unread.length === 0) return
    await markCancelAppRead(unread)
    for (const item of cancelAppItems.value) {
      item.status = true
    }
  }

  const cancelAppHeaders: DataTableHeader[] = [
    { title: '主旨', key: 'title', align: 'start', sortable: false },
    { title: '訊息內容', key: 'content', align: 'start', sortable: false },
    { title: '訊息日期', key: 'date', align: 'center', sortable: false },
    { title: '已讀', key: 'status', align: 'center', sortable: false, width: 150 },
  ]

  const pageOptions = ref({ page: 1, itemsPerPage: 10 })

  const totalPages = computed(() =>
    Math.ceil(cancelAppItems.value.length / pageOptions.value.itemsPerPage),
  )

  const totalAmount = ref<number>(0)
</script>
