<template>
  <div>
    <v-data-table
      v-model="lcAppSelected"
      class="table-sm hnb__table bg-white"
      color="blue-darken-2"
      density="compact"
      :headers="lcAppHeaders"
      hide-default-footer
      item-value="lcNo"
      :items="lcAppItems"
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
            :disabled="lcAppSelected.length === 0"
            elevation="2"
            variant="elevated"
            @click="deleteLcAppSelected"
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
      :total-items="lcAppItems.length"
      :total-pages="totalPages"
      @update:items-per-page="pageOptions.page = 1"
    />
  </div>
</template>

<script setup lang="ts">
  import type { InfoItem } from '@/api/info'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref } from 'vue'
  import { deleteLcAppItems, getLcAppList, markLcAppRead } from '@/api/info'

  const lcAppSelected = ref<string[]>([])
  const lcAppItems = ref<InfoItem[]>([])
  const isLoading = ref(false)

  async function fetchLcAppList () {
    isLoading.value = true
    try {
      const res = await getLcAppList()
      const { status, data: { data: sorceData } } = res
      if (status === 200) {
        lcAppItems.value = sorceData || []
      }
    } catch (error) {
      console.error('Error fetching LC App list:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchLcAppList)

  async function deleteLcAppSelected () {
    await deleteLcAppItems(lcAppSelected.value)
    await fetchLcAppList()
    lcAppSelected.value = []
  }

  async function readItem (item: InfoItem) {
    await markLcAppRead([item.lcNo])
    item.status = true
  }

  async function readAll () {
    const unread = lcAppItems.value.filter(i => !i.status).map(i => i.lcNo)
    if (unread.length === 0) return
    await markLcAppRead(unread)
    for (const item of lcAppItems.value) {
      item.status = true
    }
  }

  const lcAppHeaders: DataTableHeader[] = [
    { title: '主旨', key: 'title', align: 'start', sortable: false },
    { title: '訊息內容', key: 'content', align: 'start', sortable: false },
    { title: '訊息日期', key: 'date', align: 'center', sortable: false },
    { title: '已讀', key: 'status', align: 'center', sortable: false, width: 150 },
  ]

  const pageOptions = ref({ page: 1, itemsPerPage: 10 })

  const totalPages = computed(() =>
    Math.ceil(lcAppItems.value.length / pageOptions.value.itemsPerPage),
  )

  const totalAmount = ref<number>(0)
</script>
