<template>
  <TodoList />
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
</script>
