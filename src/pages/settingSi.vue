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

      <h1 class="hnb16__title">設定客戶特別指示條款</h1>

      <v-card class="pa-6 mt-4" flat>
        <p class="text-blue-grey-darken-2">此功能頁面開發中...</p>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '特別指示條款設定作業' },
    { title: '設定客戶特別指示條款', disabled: true },
  ]
</script>
