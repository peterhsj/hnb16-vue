<template>
  <v-container fluid>
    <h1 class="mx-4 hnb16__title">待辦事項列表</h1>

    <v-card class="ma-4" color="grey-lighten-1" variant="outlined">
      <v-list class="py-0">
        <v-list-item
          v-for="item in todoItems"
          :key="item.value"
          class="hnb16__todo--item"
          @click="handleTodoClick(item)"
        >
          <template #title>
            <v-icon class="me-2" color="red-darken-1" icon="mdi-play-circle-outline" size="18" />
            <span class="text-body-2">{{ item.text }}</span>

            <v-chip
              class="ml-2 py-3 px-4"
              color="orange-accent-4"
              density="compact"
              size="small"
            >
              {{ item.count }} 筆
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  interface TodoItem {
    text: string
    count: number
    value: string
    subtitle?: string
  }

  const todoItems = ref<TodoItem[]>([
    { text: '開狀申請待審核', count: 2, value: 'reviewLcApp', subtitle: '編審作業 > 開狀申請書' },
    { text: '修改申請待審核', count: 3, value: 'reviewAmendApp', subtitle: '編審作業 > 修改申請書' },
    { text: '註銷申請待審核', count: 3, value: 'reviewCancelApp', subtitle: '編審作業 > 註銷申請/切結書' },
    { text: '押匯作業待審核', count: 3, value: 'reviewDraftApp', subtitle: '編審作業 > 押匯申請' },
    { text: '補收開狀手續費待審核', count: 3, value: 'chargeLc', subtitle: '補收開狀手續費作業' },
    { text: '利率改貸申請待審核', count: 3, value: 'reviewInterestRate', subtitle: '編審作業 > 利率約定(改貸)' },
    { text: '沖正及更正交易類作業', count: 3, value: 'chargeAmendLc', subtitle: '申請作業 > 當日沖正交易' },
  ])

  function handleTodoClick (item: TodoItem): void {
    router.push(`/${item.value}`)
  }
</script>
