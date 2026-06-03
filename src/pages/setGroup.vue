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

      <!-- 設定客戶群組 -->
      <div class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            設定客戶群組
          </h2>
        </div>

        <SetGroupList />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import SetGroupList from '@/components/setGroup/SetGroupList.vue'
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '客戶管理作業' },
    { title: '設定客戶群組', disabled: true },
  ]
</script>
