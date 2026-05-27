<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">
      註銷申請 / 切結書
    </h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-card-text class="bg-grey-lighten-4 pa-3">
        <v-form ref="lcFormRef" @submit.prevent="onSubmit">
          <!-- 銀行抬頭 -->
          <v-container fluid>
            <v-row align="center" no-gutters>
              <v-col class="hnb__bankName text-center" cols="12">
                華南商業銀行
              </v-col>

              <v-col class="py-1 text-center" cols="12">
                <span class="hnb__bankName">
                  信用狀註銷申請書 / 認證單
                </span>
              </v-col>

              <v-col class="py-1 text-center" cols="12">
                中華民國 114 年 5 月 10 日
              </v-col>
            </v-row>
          </v-container>

          <v-table class="table-sm hnb__table bg-white" density="compact">
            <tbody>
              <tr>
                <td>
                  <p class="ma-4">茲請　貴行註銷下列信用狀，其未用餘額，受益人已不再利用，嗣後倘因該信用狀之受益人仍有出貨及押匯等情事，以致發生任何糾紛並使 貴行遭受損失時，一經 貴行通知，本公司當即依照前所提及之開發國內不可撤銷信用狀申請書及其他相關約定事項，負責清償，絕不拖延。</p>
                  <p class="text-end me-4">單位：新台幣元</p>
                  <!-- ================================================================
                      表格
                  ================================================================ -->
                  <v-table class="table-sm hnb__table bg-white ma-4" color="blue-darken-2" density="compact">
                    <thead>
                      <tr>
                        <th class="text-center">信用狀號碼</th>
                        <th class="text-center">申請人</th>
                        <th class="text-center">受益人</th>
                        <th class="text-end">信用狀金額</th>
                        <th class="text-end">未押匯金額</th>
                        <th class="text-center">信用狀到期日</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td class="text-center">008LLCt2</td>
                        <td class="text-center">林大華</td>
                        <td class="text-center">網際測試股份有限公司</td>
                        <td class="text-end">NT$ 500,000</td>
                        <td class="text-end">NT$ 200,000</td>
                        <td class="text-center">民國 114 年 05 月 26 日</td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>
            </tbody>
          </v-table>
          <!-- ===== 共用底部按鈕列 ===== -->
          <div class="d-flex flex-wrap justify-center align-center ga-2 mt-6">
            <v-btn class="hnb__btn--cancel mx-1" @click="confirmCancel">
              取消
            </v-btn>

            <v-btn class="hnb__btn--default mx-1" type="submit">
              確定
            </v-btn>
          </div>
        </v-form>
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
  import { reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    createInitialDraftLcForm,
    type DraftLcData,
    type DraftLcPayload,
  } from '@/types/draftApp'

  const props = defineProps<{
    formData: DraftLcData
  }>()

  const emit = defineEmits<{
    'on-submit': []
    'on-cancel': []
  }>()

  const lcFormRef = ref<InstanceType<typeof VForm> | null>(null)

  // 共用表單物件
  const form = reactive<DraftLcPayload>(createInitialDraftLcForm())

  // ── 共用狀態 ──────────────────────────────────────────────────────────────
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const CancelAppEditDialog = ref<boolean>(false)

  // ── 監聽 formData 以初始化 / 重設表單 ─────────────────────────────────────
  watch(
    () => props.formData,
    newData => {
      if (newData.appNo) {
        lcFormRef.value?.reset()
        Object.assign(form, createInitialDraftLcForm())
      }
    },
    { immediate: true },
  )

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
      CancelAppEditDialog.value = true
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
