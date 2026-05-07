<template>
  <v-overlay class="align-center justify-center" :model-value="props.overlay" transition="fade-transition">
    <v-progress-circular
      v-if="props.overlay"
      color="teal-darken-2"
      indeterminate
      size="60"
      width="8"
    />
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
