<template>
  <div class="my-4">
    <!-- 無資料時顯示 -->
    <v-card v-if="!loading && items.length === 0" class="mx-auto my-3" color="grey-lighten-4" flat>
      <v-card-text class="text-center py-12">
        <v-icon color="grey-lighten-1" icon="mdi-file-document-alert-outline" size="64" />
        <p class="text-h6 text-orange-darken-2 mt-4">尚無資料</p>
      </v-card-text>
    </v-card>

    <v-data-table
      v-else
      class="hnb__table"
      color="grey-lighten-4"
      density="compact"
      fixed-header
      :headers="headers"
      hide-default-footer
      :items="items"
      :loading="loading"
      striped="even"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { api } from '@/api/axios'
  import { thousandsFormatting } from '@/utils/format'

  interface HeaderItem {
    id?: number
    title: string
    key: string
    sortable?: boolean
    nowrap?: boolean
    headerProps?: {
      class: string
    }
    align?: 'start' | 'end' | 'center' | undefined
  }
  const headers: HeaderItem[] = [
    { title: '發票號碼', key: 'invoiceNo', sortable: false, align: 'start', headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '發票金額 ( NT$ )', key: 'amount', sortable: false, align: 'end', headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '發票日期', key: 'date', sortable: false, align: 'center', headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '合約編號', key: 'contractNo', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
    { title: '提單編號', key: 'billOfLadingNo', sortable: false, align: 'start', nowrap: true, headerProps: { class: 'bg-blue-lighten-4' } },
  ]

  const loading = ref<boolean>(false)

  interface TableDataItem {
    id: string
    invoiceNo: string
    amount: number
    date: string
    contractNo: string
    billOfLadingNo: string
  }
  const items = ref<TableDataItem[]>([])

  interface ApiResponse<T = any> {
    code: number
    data: T
    total?: number
    message?: string
  }

  // 取得發票列表
  async function fetchDraftList (): Promise<void> {
    loading.value = true
    const apiUrl = '/api/draftList/list'
    try {
      // 使用 axios POST 請求
      const res = await api.post<ApiResponse>(apiUrl, {})
      const { code, data } = res.data

      // console.log('API 回應:', res.data)
      // 更新表格數據
      if (code === 200) {
        items.value = data.map((item: any) => ({
          id: item.id,
          invoiceNo: item.invoiceNo,
          amount: thousandsFormatting(item.amount),
          date: item.date,
          contractNo: item.contractNo,
          billOfLadingNo: item.billOfLadingNo,
        }))
      }
      console.log('處理後的數據:', items.value)
    } catch (error) {
      console.error('API 請求失敗:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchDraftList()
  })
</script>
