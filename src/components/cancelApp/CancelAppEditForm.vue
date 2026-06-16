<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">
      註銷申請 / 切結書
    </h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-card-text class="bg-grey-lighten-4 pa-3">
        <CancelAppInfo
          :data="form"
          :is-show-deposit="false"
        />
        <!-- ===== 共用底部按鈕列 ===== -->
        <div class="d-flex flex-wrap justify-center align-center ga-2 mt-6">
          <v-btn class="hnb__btn--cancel mx-1" @click="confirmCancel">
            取消
          </v-btn>

          <v-btn class="hnb__btn--default mx-1" @click="onSubmit">
            確定
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <CancelAppEditPromptDialog
      v-model:message-dialog="CancelAppEditDialog"
      @on-close="CancelAppEditDialogClose"
      @send-confirm="sendConfirm"
    />

    <!-- 共用 Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />
  </div>
</template>

<script setup lang="ts">
  import type { CancelAppData } from '@/types/cancelApp'
  import { reactive, ref, watch } from 'vue'

  interface Props {
    isCdsExpired?: boolean // 是否為 CDS 過期案件
    formData?: CancelAppData
  }
  const props = withDefaults(defineProps<Props>(), {
    isCdsExpired: false,
  })

  const emit = defineEmits<{
    'on-submit': []
    'on-cancel': []
  }>()

  // 共用表單物件
  const form = reactive<CancelAppData>({
    beneType: '', // 受益人類型
    appNo: '', // 信用狀號碼
  })

  // ── 共用狀態 ──────────────────────────────────────────────────────────────
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const CancelAppEditDialog = ref<boolean>(false)

  // ── 監聽 formData 以初始化 / 重設表單 ─────────────────────────────────────
  // watch(
  //   () => props.formData,
  //   newData => {
  //     if (newData.appNo) {
  //       Object.assign(form, { ...newData })
  //     }
  //   },
  //   { immediate: true },
  // )

  // ── 共用函式 ──────────────────────────────────────────────────────────────
  function confirmCancel (): void {
    messageTitle.value = '訊息通知'
    message.value = '離開不會儲存此筆資料，<br />您確認要離開嗎？'
    messageStatus.value = 'alert'
    processStatus.value = 'cancel'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function onSubmit (): void {
    console.log('Submit payload:', form)
    try {
      if (props.isCdsExpired) {
        sendConfirm()
      } else {
        CancelAppEditDialog.value = true
      }
    } catch (error) {
      console.error('Error emitting submit event:', error)
    }
  }

  function sendConfirm (): void {
    messageTitle.value = '作業訊息'
    message.value = `作業已完成！<br />
您的申請書號碼為<br />
099700031161000861-A-011`
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
    processStatus.value = 'success'
  }

  function CancelAppEditDialogClose (): void {
    CancelAppEditDialog.value = false
  }

  function messageConfirm (): void {
    if (processStatus.value === 'cancel') emit('on-cancel')
    messageDialog.value = false
  }

  function messageClose (): void {
    if (processStatus.value === 'success') emit('on-submit')
    messageDialog.value = false
  }
</script>
