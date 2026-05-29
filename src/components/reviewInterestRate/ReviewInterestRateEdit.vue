<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">
      利率約定(改貸)
    </h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-card-text class="bg-grey-lighten-4 pa-3">
        <v-form ref="lcFormRef" @submit.prevent="onSubmit">

          <!-- ================================================================
              表格
          ================================================================ -->
          <v-table class="table-sm hnb__table-v bg-white" density="compact">
            <tbody>
              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  信用狀號碼：
                </th>

                <td class="lc-td">
                  099700024161000861
                </td>

                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  信用狀可用餘額：
                </th>

                <td class="lc-td text-end">
                  NT$ 200,000
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  受益人名稱：
                </th>

                <td class="lc-td">
                  網際測試股份有限公司
                </td>

                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  押匯/承兌金額：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.negotiationAmount"
                    class="flex-grow-1"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    style="min-width: 120px"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  押匯/承兌日期：
                </th>

                <td class="lc-td">
                  2025/11/10
                </td>

                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  匯票到期日：
                </th>

                <td class="lc-td">
                  2025/11/10
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  匯票發票日：
                </th>

                <td class="lc-td" colspan="3">
                  <v-date-input
                    v-model="form.draftIssueDate"
                    append-inner-icon="mdi-calendar"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    placeholder="例：2026/01/01"
                    prepend-icon=""
                    style="max-width: 220px"
                    variant="outlined"
                  />
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
      messageTitle.value = '作業訊息'
      message.value = `作業已完成！<br />
您的申請書號碼為<br />
099700031161000861-A-011`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
      processStatus.value = 'success'
    } catch (error) {
      console.error('Error emitting submit event:', error)
    }
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
