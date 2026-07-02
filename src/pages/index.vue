<template>
  <TodoList v-if="userStore.isAuthenticated" />
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const router = useRouter()
  onMounted(() => {
    // 如果isAuthenticated為 false，導向到 login 頁面
    if (!userStore.isAuthenticated) {
      router.push('/login')
    }
  })
</script>
