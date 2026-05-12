<template>
  <div class="d-flex align-center justify-center ga-1 my-3 text-grey-darken-4">
    <v-pagination
      active-color="teal-darken-2"
      color="teal-darken-2"
      density="compact"
      :length="totalPages"
      :model-value="page"
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
        :items="itemsPerPageOptions"
        :model-value="itemsPerPage"
        variant="outlined"
        @update:model-value="$emit('update:itemsPerPage', $event)"
      />
    </div>

    <v-spacer />

    <span class="mx-2 text-body-2">
      <span class="text-red-darken-3">總筆數：</span>
      {{ totalItems }}
      <span v-if="isShowTotalPages">
        <span class="text-red-darken-3">/ 總頁數：</span>
        {{ totalPages }}
      </span>

      <span v-if="isShowTotalAmount">
        <span class="text-red-darken-3">/ 總金額：</span>
        NT$ {{ thousandsFormatting(totalAmount) }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { thousandsFormatting } from '@/utils/format'

  withDefaults(defineProps<{
    page: number
    itemsPerPage: number
    totalPages: number
    totalItems: number
    totalAmount: number
    isShowTotalPages?: boolean
    isShowTotalAmount?: boolean
    itemsPerPageOptions?: number[]
  }>(), {
    itemsPerPageOptions: () => [10, 20, 50, 100],
  })

  defineEmits<{
    'update:page': [value: number]
    'update:itemsPerPage': [value: number]
  }>()
</script>
