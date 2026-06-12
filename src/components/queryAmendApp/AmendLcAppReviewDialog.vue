<template>
  <v-dialog
    v-model="show"
    persistent
    width="1000"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>修改申請書</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef">
        <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">
          <AmendLcInfo :bene-type="beneType" :data="LcAppInfoData" />
          <!-- 下載 / 列印 -->
          <v-container class="" fluid>
            <v-row>
              <v-col class="text-center" cols="12">
                <v-btn
                  class="ma-1 hnb__btn--orange"
                  @click="handleCreditData('')"
                >
                  授信資料
                </v-btn>

                <span> | </span>

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
          </v-container>
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
      </v-form>
    </v-card>

    <!-- 開狀申請書-授信資料 Dialog -->
    <AmendLcAppCreditDialog
      v-model:is-lc-app-credit-dialog-open="isLcAppCreditDialogOpen"
      :amend-notice-no="amendNoticeNoValue"
      :is-show-history="isShowHistory"
      @on-close="lcAppCreditDialogClose"
      @on-show-history-view="handleHistoryView"
    />

    <!-- 查看授信歷程資料 Dialog -->
    <LcAppHistoryViewDialog
      v-model:is-history-dialog-open="isHistoryDialogOpen"
      :credit-no="creditNo"
      :is-show-history="isShowHistory"
      @on-close="historyDialogClose"
    />
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()
  const beneType = ref<string>('cds')
  const LcAppInfoData = ref<any>({
    amendAppNo: 'LC20240225001',
    lcAmount: 1_000_000,
    fee: 500,
  })

  const isLoading = ref<boolean>(false)

  // 授信資料 Dialog
  const isLcAppCreditDialogOpen = ref(false)
  const amendNoticeNoValue = ref<string>('')

  // 查看授信歷程資料 Dialog
  const isShowHistory = ref(true)
  const isHistoryDialogOpen = ref(false)
  const creditNo = ref<string>('') // 這裡可以根據實際情況設定 creditNo 的值

  interface Props {
    isAmendLcAppReviewDialog?: boolean
    amendAppNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isAmendLcAppReviewDialog: false,
    amendAppNo: '',
  })

  const show = ref<boolean>(props.isAmendLcAppReviewDialog)
  watch(
    () => props.isAmendLcAppReviewDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:isAmendLcAppReviewDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:isAmendLcAppReviewDialog': [boolean]
    'on-close': []
  }>()

  function downloadFile () {
    // 下載電子檔邏輯
    console.log('下載電子檔')
  }

  function printDoc () {
    window.print()
  }

  // 處理授信資料按鈕點擊事件
  function handleCreditData (amendNoticeNo: string): void {
    console.log('授信資料按鈕被點擊')
    amendNoticeNoValue.value = amendNoticeNo
    isLcAppCreditDialogOpen.value = true
    // 這裡可以加入實際的處理邏輯，例如跳轉到授信資料頁面或顯示相關資訊等
  }

  function lcAppCreditDialogClose (): void {
    isLcAppCreditDialogOpen.value = false
  }

  // 處理查看歷程資料事件
  function handleHistoryView (value: string): void {
    console.log('查看歷程資料', value)
    // 這裡可以加入實際的處理邏輯，例如根據傳入的值顯示歷程資料等
    isHistoryDialogOpen.value = true
    creditNo.value = value
  }

  // 查看歷程資料 Dialog 關閉事件
  function historyDialogClose (): void {
    isHistoryDialogOpen.value = false
    creditNo.value = ''
  }

  function onClose (): void {
    show.value = false
    emit('on-close')
  }
</script>
