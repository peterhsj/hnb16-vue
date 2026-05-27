<template>
  <div class="d-flex align-center justify-center ga-1 my-3 text-grey-darken-4">
    <v-pagination
      active-color="teal-darken-2"
      color="teal-darken-2"
      density="compact"
      :length="props.totalPages"
      :model-value="props.page"
      show-first-last-page
      :total-visible="7"
      @update:model-value="$emit('update:page', $event)"
    />

    <div class="d-flex align-center ga-1">
      <span class="mx-2 text-body-2">每頁筆數：</span>

      <v-select
        bg-color="white"
        color="teal-darken-2"
        density="compact"
        hide-details
        :items="props.itemsPerPageOptions"
        :model-value="props.itemsPerPage"
        variant="outlined"
        @update:model-value="$emit('update:itemsPerPage', $event)"
      />
    </div>

    <v-spacer />

    <span class="mx-2 text-body-2 text-right">
      <span class="text-red-darken-3">總筆數：</span>
      {{ props.totalItems }}
      <span v-if="props.isShowTotalPages">
        <span class="text-red-darken-3">/ 總頁數：</span>
        {{ props.totalPages }}
      </span>

      <span v-if="props.isShowCurrentPageTotalAmount">
        <span class="text-red-darken-3">/ 本頁總金額：</span>
        NT$ {{ thousandsFormatting(props.totalPageAmount ?? 0) }}
        <br />
      </span>

      <span v-if="props.isShowTotalAmount">
        <span class="text-red-darken-3">/ 總金額：</span>
        NT$ {{ thousandsFormatting(props.totalAmount ?? 0) }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { thousandsFormatting } from '@/utils/format'

  const props = withDefaults(defineProps<{
    page: number
    itemsPerPage: number
    totalPages: number
    totalItems: number
    totalAmount: number
    isShowTotalPages?: boolean
    isShowTotalAmount?: boolean
    isShowCurrentPageTotalAmount?: boolean
    totalPageAmount?: number
    itemsPerPageOptions?: number[]
  }>(), {
    itemsPerPageOptions: () => [10, 20, 50, 100],
  })

  defineEmits<{
    'update:page': [value: number]
    'update:itemsPerPage': [value: number]
  }>()
</script>
