<template>
  <v-overlay class="align-center justify-center" :model-value="props.overlay" transition="fade-transition">
    <v-progress-circular
      v-if="props.overlay"
      class="me-3"
      color="teal-darken-2"
      indeterminate
      size="50"
      width="8"
    />

    <span class="text-h6 text-teal-darken-3">資料處理中，請稍後...</span>
  </v-overlay>
</template>
<script lang="ts" setup>
  interface Props {
    overlay?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    overlay: false,
  })
</script>
