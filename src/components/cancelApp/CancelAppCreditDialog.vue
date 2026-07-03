<template>
  <v-dialog
    v-model="show"
    persistent
    width="800"
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

      <v-card-text class="d-flex flex-column align-center bg-grey-lighten-4">
        <CancelAppCreditInfo />

        <v-row>
          <v-col cols="12">
            <v-spacer />

            <v-btn
              class="ma-1 hnb__btn--default"
              prepend-icon="mdi-cloud-download"
              @click="downloadFile"
            >
              下載電子檔
            </v-btn>

            <v-btn
              class="ma-1 hnb__btn--orange"
              prepend-icon="mdi-printer"
              @click="printDoc"
            >
              列印
            </v-btn>

            <v-spacer />
          </v-col>
        </v-row>
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
  import { computed } from 'vue'
  interface Props {
    isShowCancelDialog?: boolean
    cancelAppNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isShowCancelDialog: false,
    cancelAppNo: '',
  })

  const emits = defineEmits<{
    'update:isShowCancelDialog': [boolean]
    'on-close': []
    'open-lc-detail': [string]
    'on-show-history-view': [string]
  }>()

  const show = computed({
    get: () => props.isShowCancelDialog,
    set: (value: boolean) => {
      emits('update:isShowCancelDialog', value)
    },
  })

  const data = {
    pricingBenchmark: '01',
  }

  function downloadFile () {
    // 下載電子檔邏輯
    console.log('下載電子檔')
  }

  function printDoc () {
    window.print()
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }
</script>
