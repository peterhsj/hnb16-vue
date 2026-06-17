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
        <v-row justify="center">
          <v-col cols="12">
            <div class="my-2">
              <span class="font-weight-bold">未退還保證金：</span> 55000.0
            </div>

            <div class="my-2">
              <span class="font-weight-bold">退還保證金：</span> 55000.0
            </div>

            <div class="d-flex my-2">
              <div class="font-weight-bold text-no-wrap">退還保證金方式：</div>

              <div>
                <div>
                  <v-icon :icon="data.pricingBenchmark === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                  入帳帳號：
                </div>

                <div class="d-flex my-2">
                  <div>
                    <v-icon :icon="data.pricingBenchmark === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    轉入科目：
                  </div>

                  <div>
                    <div class="d-flex">
                      <span class="font-weight-bold">轉入會計科目：</span>
                      13097-099：其他應收款-雜項
                    </div>

                    <div class="d-flex my-2">
                      <span class="font-weight-bold">轉入銷帳序號：</span>
                      --
                    </div>

                    <div class="d-flex my-2">
                      <span class="font-weight-bold">轉入科目金額：</span>
                      55000.0
                    </div>

                    <div class="d-flex my-2">
                      <span class="font-weight-bold">轉入科目摘要：</span>
                      信用狀保證金 網優
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col class="text-center" cols="12">
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
