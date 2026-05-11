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
              <LcApp />
            </v-tabs-window-item>

            <!-- 修狀 -->
            <v-tabs-window-item value="amendApp">
              <AmendApp />
            </v-tabs-window-item>

            <!-- 註銷 -->
            <v-tabs-window-item value="cancelApp">
              <CancelApp />
            </v-tabs-window-item>

            <!-- 押匯 -->
            <v-tabs-window-item value="draftApp">
              <DraftApp />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
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

</script>
