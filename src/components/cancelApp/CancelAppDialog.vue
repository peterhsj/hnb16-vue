<template>
  <v-dialog
    v-model="show"
    persistent
    width="1200"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>註銷申請 / 切結書</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="d-flex align-center bg-grey-lighten-4">
        <CancelAppInfo :data="props.data" :is-show-deposit="props.isShowDeposit" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="hnb__btn--cancel mx-1 my-2"
          @click="onClose"
        >
          關閉
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  interface Props {
    isShowDialog?: boolean
    cancelAppNo?: string
    isShowDeposit?: boolean
    data?: any
  }
  const props = withDefaults(defineProps<Props>(), {
    isShowDialog: false,
    cancelAppNo: '',
    isShowDeposit: false,
    data: {},
  })

  const show = ref<boolean>(props.isShowDialog)
  watch(
    () => props.isShowDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:isShowDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:isShowDialog': [boolean]
    'on-close': []
  }>()

  function onClose (): void {
    show.value = false
    emit('on-close')
  }
</script>
