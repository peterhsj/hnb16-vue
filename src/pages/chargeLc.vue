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

      <!-- 補收開狀手續費 -->
      <div class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            補收開狀手續費 ( 押匯時開狀行作業 )
          </h2>
        </div>

        <ChargeLcList />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '補收開狀手續費作業' },
    { title: '補收開狀手續費', disabled: true },
  ]
</script>
