<script setup lang="ts">
  import { useMessage } from '@/composables/useMessage'

  const snackbar = useMessage()
</script>

<template>
  <v-app>
    <router-view />

    <!-- 全局消息提示 -->
    <v-snackbar
      v-model="snackbar.visible.value"
      :color="snackbar.color.value"
      location="top"
      :timeout="snackbar.timeout.value"
    >
      {{ snackbar.message.value }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar.visible.value = false"
        >
          關閉
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Microsoft JhengHei', 'PingFang TC', sans-serif;
}
</style>
