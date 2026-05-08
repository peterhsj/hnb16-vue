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

      <h1 class="mx-4 hnb16__title">訊息匣</h1>

      <v-card class="mt-4 mx-4" flat>
        <v-tabs v-model="activeTab" class="hnb__tab">
          <v-tab
            v-for="tab in tabs"
            :key="tab.value"
            :class="{ 'active-tab': activeTab === tab.value }"
            :value="tab.value"
          >
            {{ tab.text }}
            <v-chip
              class="ml-2 px-1 hnb__chip--count"
              density="compact"
              label
              size="small"
            >
              {{ tab.count }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <v-card class="pa-4 pt-2 bg-blue-grey-lighten-5" color="grey-lighten-1" variant="outlined">
          <h2 class="hnb16__subtitle my-3">{{ currentTab }}作業</h2>

          <v-tabs-window v-model="activeTab">
            <!-- 開狀 -->
            <v-tabs-window-item value="lcApp">
              <v-data-table
                class="table-sm hnb__table bg-white"
                color="blue-darken-2"
                density="compact"
                :headers="lcAppHeaders"
                :items="lcAppItems"
                :items-per-page="lcAppPagination.itemsPerPage"
                :page="lcAppPagination.page"
                show-select
                sort-asc-icon="mdi-sort-ascending"
                sort-desc-icon="mdi-sort-descending"
                sort-icon="mdi-swap-vertical"
                striped="odd"
                @update:items-per-page="lcAppPagination.itemsPerPage = $event"
                @update:page="lcAppPagination.page = $event"
              />
            </v-tabs-window-item>

            <!-- 修狀 -->
            <v-tabs-window-item value="amendApp">
              <v-data-table
                class="table-sm hnb__table bg-white"
                density="compact"
                :headers="amendAppHeaders"
                :items="amendAppItems"
                :items-per-page="amendAppPagination.itemsPerPage"
                :page="amendAppPagination.page"
                @update:items-per-page="amendAppPagination.itemsPerPage = $event"
                @update:page="amendAppPagination.page = $event"
              />
            </v-tabs-window-item>

            <!-- 註銷 -->
            <v-tabs-window-item value="cancelApp">
              <v-data-table
                density="compact"
                :headers="cancelAppHeaders"
                :items="cancelAppItems"
                :items-per-page="cancelAppPagination.itemsPerPage"
                :page="cancelAppPagination.page"
                @update:items-per-page="cancelAppPagination.itemsPerPage = $event"
                @update:page="cancelAppPagination.page = $event"
              />
            </v-tabs-window-item>

            <!-- 押匯 -->
            <v-tabs-window-item value="draftApp">
              <v-data-table
                density="compact"
                :headers="draftAppHeaders"
                :items="draftAppItems"
                :items-per-page="draftAppPagination.itemsPerPage"
                :page="draftAppPagination.page"
                @update:items-per-page="draftAppPagination.itemsPerPage = $event"
                @update:page="draftAppPagination.page = $event"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import { computed, ref } from 'vue'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '訊息匣', disabled: true },
  ]

  const activeTab = ref('lcApp')
  const currentTab = computed(() => tabs.value.find(tab => tab.value === activeTab.value)?.text || '')

  const tabs = ref([
    { text: '開狀', value: 'lcApp', count: 10 },
    { text: '修狀', value: 'amendApp', count: 10 },
    { text: '註銷', value: 'cancelApp', count: 10 },
    { text: '押匯', value: 'draftApp', count: 10 },
  ])

  // 開狀
  const lcAppHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false },
    { title: '申請人', key: 'applicant', align: 'center', sortable: false },
    { title: '受益人', key: 'beneficiary', align: 'center', sortable: false },
    { title: '金額', key: 'amount', align: 'end', sortable: false },
    { title: '申請日期', key: 'applyDate', align: 'center', sortable: false },
    { title: '有效日期', key: 'expireDate', align: 'center', sortable: false },
    { title: '狀態', key: 'status', align: 'center', sortable: false },
  ]
  const lcAppItems = ref([
    { lcNo: 'LC2024001', applicant: '台灣電子', beneficiary: '上海科技', amount: '500,000', applyDate: '2024-01-10', expireDate: '2024-07-10', status: '待審核' },
    { lcNo: 'LC2024002', applicant: '聯合貿易', beneficiary: '廣州製造', amount: '320,000', applyDate: '2024-01-12', expireDate: '2024-08-12', status: '待審核' },
  ])
  const lcAppPagination = ref({ page: 1, itemsPerPage: 10 })

  // 修狀
  const amendAppHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false },
    { title: '修改次數', key: 'amendNo', align: 'center', sortable: false },
    { title: '申請人', key: 'applicant', align: 'center', sortable: false },
    { title: '申請日期', key: 'applyDate', align: 'center', sortable: false },
    { title: '修改原因', key: 'reason', align: 'center', sortable: false },
    { title: '狀態', key: 'status', align: 'center', sortable: false },
  ]
  const amendAppItems = ref([
    { lcNo: 'LC2024001', amendNo: '1', applicant: '台灣電子', applyDate: '2024-02-01', reason: '金額調整', status: '待審核' },
    { lcNo: 'LC2024003', amendNo: '2', applicant: '鴻海集團', applyDate: '2024-02-05', reason: '有效期延長', status: '待審核' },
    { lcNo: 'LC2024004', amendNo: '1', applicant: '南山人壽', applyDate: '2024-02-08', reason: '受益人變更', status: '待審核' },
  ])
  const amendAppPagination = ref({ page: 1, itemsPerPage: 10 })

  // 註銷
  const cancelAppHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false },
    { title: '申請人', key: 'applicant', align: 'center', sortable: false },
    { title: '申請日期', key: 'applyDate', align: 'center', sortable: false },
    { title: '註銷日期', key: 'cancelDate', align: 'center', sortable: false },
    { title: '註銷原因', key: 'reason', align: 'center', sortable: false },
    { title: '狀態', key: 'status', align: 'center', sortable: false },
  ]
  const cancelAppItems = ref([
    { lcNo: 'LC2024005', applicant: '東南亞貿易', applyDate: '2024-03-01', cancelDate: '2024-03-15', reason: '交易取消', status: '待審核' },
    { lcNo: 'LC2024006', applicant: '中華貿易', applyDate: '2024-03-03', cancelDate: '2024-03-20', reason: '合約終止', status: '待審核' },
    { lcNo: 'LC2024007', applicant: '泰山企業', applyDate: '2024-03-05', cancelDate: '2024-03-25', reason: '客戶要求', status: '待審核' },
  ])
  const cancelAppPagination = ref({ page: 1, itemsPerPage: 10 })

  // 押匯
  const draftAppHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false },
    { title: '押匯單號', key: 'draftNo', align: 'center', sortable: false },
    { title: '申請人', key: 'applicant', align: 'center', sortable: false },
    { title: '押匯金額', key: 'amount', align: 'end', sortable: false },
    { title: '申請日期', key: 'applyDate', align: 'center', sortable: false },
    { title: '狀態', key: 'status', align: 'center', sortable: false },
  ]
  const draftAppItems = ref([
    { lcNo: 'LC2024001', draftNo: 'DR2024001', applicant: '台灣電子', amount: '480,000', applyDate: '2024-04-01', status: '待審核' },
    { lcNo: 'LC2024002', draftNo: 'DR2024002', applicant: '聯合貿易', amount: '310,000', applyDate: '2024-04-03', status: '待審核' },
    { lcNo: 'LC2024008', draftNo: 'DR2024003', applicant: '大同公司', amount: '250,000', applyDate: '2024-04-05', status: '待審核' },
  ])
  const draftAppPagination = ref({ page: 1, itemsPerPage: 10 })
</script>
