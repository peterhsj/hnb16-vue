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

      <!-- 客戶所屬分行異動 -->
      <div class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            客戶所屬分行異動
          </h2>
        </div>

        <SetCustomerBranchList />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import SetCustomerBranchList from '@/components/setCustomerBranch/SetCustomerBranchList.vue'
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '客戶管理作業' },
    { title: '客戶所屬分行異動', disabled: true },
  ]
</script>
