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

      <v-card-text class="d-flex flex-column align-center bg-grey-lighten-4">
        <CancelAppInfo
          :data="props.data"
          :is-show-deposit="props.isShowDeposit"
        />

        <div v-if="props.isShowDetail" class="v-col-sm-12 v-col-md-5 v-col-12">
          <!-- 下載 / 列印 / 版本選擇 -->
          <v-container class="" fluid>
            <v-row>
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

              <v-col class="text-center" cols="12">
                <span
                  class="mx-3 text-decoration-underline text-primary cursor-pointer"
                  @click.prevent="handleLcView('1')"
                >
                  版本 0
                </span>

                <span class="mx-1 text-grey">|</span>
                <span class="mx-3 font-weight-bold">版本 1 (目前版本)</span>
                <!-- 授信資料調整歷程卡片 -->
                <v-row class="pt-5" justify="center">
                  <v-col cols="12">
                    <v-card class="mx-auto border-sm bg-white" variant="outlined">
                      <v-card-title class="text-center text-red-darken-3 text-subtitle-1 font-weight-bold py-2">
                        授信資料調整歷程
                      </v-card-title>

                      <v-divider />

                      <v-list density="compact">
                        <v-list-item
                          v-for="item in credieHistoryList"
                          :key="item.value"
                          class="text-center"
                          color="teal-darken-1"
                          link
                          :title="item.title"
                          :value="item.value"
                          @click.prevent="handleHistoryView(item.value)"
                        />
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </div>

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
  import type { CancelAppData } from '@/types/cancelApp'
  import { ref, watch } from 'vue'
  interface Props {
    isShowDialog?: boolean
    cancelAppNo?: string
    isShowDeposit?: boolean
    isShowDetail?: boolean
    data?: CancelAppData
  }
  const props = withDefaults(defineProps<Props>(), {
    isShowDialog: false,
    cancelAppNo: '',
    isShowDeposit: false,
    isShowDetail: false,
    data: () => ({
      appNo: '',
      beneType: 'cds',
    }),
  })

  const emits = defineEmits<{
    'update:isShowDialog': [boolean]
    'on-close': []
    'open-lc-detail': [string]
    'on-show-history-view': [string]
  }>()

  const show = computed({
    get: () => props.isShowDialog,
    set: (value: boolean) => {
      emits('update:isShowDialog', value)
    },
  })

  const credieHistoryList = [
    {
      title: '第一版差異',
      value: '123456',
    },
  ]

  // 歷程資料查看
  function handleHistoryView (value: string): void {
    console.log('查看歷程資料', value)
    emits('on-show-history-view', value)
  }

  function downloadFile () {
    // 下載電子檔邏輯
    console.log('下載電子檔')
  }

  function printDoc () {
    window.print()
  }

  // 查看信用狀
  function handleLcView (value: string): void {
    emits('open-lc-detail', value)
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }
</script>
