<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">
      利率約定(改貸)
    </h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-form ref="formRef">
        <v-card-text class="bg-grey-lighten-4">
          <div class="text-body-2 mb-1">申請日期：2026/05/10</div>

          <v-table
            class="hnb__table hnb__table--vertical w-100"
            density="compact"
            striped="odd"
          >
            <tbody>
              <tr>
                <td>
                  <div class="hnb__line--indent ms-1">
                    1. 國內信用狀利率約定書，其中依本信用狀所墊付之本次押匯金額 <span class="text-red-darken-3">1,000,000</span> 元， 本公司申請借款 新台幣 壹仟萬元整，並同意按下列定價之指標其中之一，按月計付利息。
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="mb-1">2. 改貸之利率約定：</div>

                  <div class="d-flex align-center text-body-2 my-2 ms-2">
                    <span class="mx-1"><v-icon :icon="formData.pricingBenchmark === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /></span>

                    <div>
                      <span class="text-no-wrap mx-1">按貴行之基準利率加碼年率</span>
                      0.0100000
                      <span class="text-no-wrap mx-1">% 計息，</span>
                      <span class="text-no-wrap mx-1">嗣後貴行基準利率每</span>
                      1
                      <span class="text-no-wrap mx-1">個月調整時隨同調整，加碼幅度不變。</span>
                    </div>
                  </div>

                  <div class="d-flex align-center text-body-2 my-2 ms-2">
                    <span class="mx-1"><v-icon :icon="formData.pricingBenchmark === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /></span>

                    <div class="d-flex flex-column">
                      <div class="d-flex align-center">
                        <span class="text-no-wrap mx-1">固定利率，按年率</span>
                        --
                        <span class="text-no-wrap mx-1">% 計息。</span>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-center text-body-2 my-2 ms-2">
                    <span class="mx-1"><v-icon :icon="formData.pricingBenchmark === '03' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /></span>

                    <div>
                      <span class="text-no-wrap mx-1">按貴行之貨幣市場</span>
                      --
                      --
                      <span class="text-no-wrap mx-1">天期均價利率</span>
                      --
                      <span class="text-no-wrap mx-1">碼</span>
                      --
                      <span class="text-no-wrap mx-1">% 計息，</span>

                      <span class="text-no-wrap mx-1">嗣後以貸放日後每滿</span>
                      --
                      <span class="text-no-wrap mx-1">個月之相對日為利率變動調整日，自調整日起隨同調整，加減碼幅度不變。</span>
                    </div>
                  </div>

                  <div class="d-flex align-center text-body-2 my-2 ms-2">
                    <span class="mx-1"><v-icon :icon="formData.pricingBenchmark === '04' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /></span>

                    <div class="d-flex flex-column">
                      <div class="d-flex align-center">
                        <span class="text-no-wrap mx-1">其他：</span>

                        --
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  3.信用狀主要內容：
                  <v-table class="mt-2 hnb__table hnb__table--vertical w-100" density="compact">
                    <tbody>
                      <tr>
                        <th class="hnb__tbhd2 text-end w-20">
                          開狀行
                        </th>

                        <td>
                          華南銀行南門分行
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          開狀日期
                        </th>

                        <td>
                          民國 114 年 07 月 01 日
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          開狀申請人
                        </th>

                        <td>
                          鼎力金屬工業股份有限公司
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          信用狀受益人
                        </th>

                        <td>
                          乙股份有限公司
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          信用狀號碼
                        </th>

                        <td>
                          132654
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          信用狀金額
                        </th>

                        <td>
                          新台幣 壹仟萬元整
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          本次押匯日期
                        </th>

                        <td>
                          民國 114 年 07 月 01 日
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          本次押匯金額
                        </th>

                        <td>
                          新台幣 壹仟萬元整
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          利率改貸確認日期
                        </th>

                        <td>
                          N/A
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>
            </tbody>
          </v-table>

          <div class="mt-4 text-center mx-auto">
            <div class="d-inline-flex align-center justify-center">
              <v-radio-group
                v-model="reviewForm.reviewStatus"
                color="cyan-darken-3"
                density="compact"
                hide-details="auto"
                inline
              >
                <v-radio value="approve">
                  <template #label>
                    <span class="text-body-2">核准</span>
                  </template>
                </v-radio>

                <v-radio class="ms-4" value="reject">
                  <template #label>
                    <span class="text-body-2">拒絕 / 拒絕原因：</span>

                    <v-select
                      v-model="reviewForm.rejectReason"
                      clearable
                      color="teal-darken-2"
                      density="compact"
                      :disabled="reviewForm.reviewStatus !== 'reject'"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...REJECT_REASON_ITEMS]"
                      placeholder="請選擇"
                      variant="outlined"
                      width="200px"
                    />
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn class="hnb__btn--cancel mx-1" @click="confirmCancel">
            取消
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1"
            :disabled="reviewForm.reviewStatus === '' || (reviewForm.reviewStatus === 'reject' && reviewForm.rejectReason === '')"
            @click="handlerReview"
          >
            確定
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>
    </v-card>

    <!-- 共用 Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :dialog-width="messageWidth"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />

    <!-- 利率約定書 Dialog -->
    <RateAgreementDialog
      v-model:rate-agreement-dialog="rateAgreementDialog"
      :lc-no="lcNo"
      @on-close="rateAgreementDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  // import {
  //   createInitialDraftLcForm,
  //   type DraftLcData,
  //   type DraftLcPayload,
  // } from '@/types/draftApp'

  // const props = defineProps<{
  //   formData: DraftLcData
  // }>()

  const REJECT_REASON_ITEMS = [
    { title: '拒絕原因 1', value: 'r1' },
    { title: '拒絕原因 2', value: 'r2' },
    { title: '拒絕原因 3', value: 'r3' },
    { title: '拒絕原因 4', value: 'r4' },
  ]

  const emit = defineEmits<{
    'on-submit': []
    'on-cancel': []
  }>()

  const reviewForm = ref({
    reviewStatus: '',
    rejectReason: null,
  })
  const lcFormRef = ref<InstanceType<typeof VForm> | null>(null)

  // 共用表單物件
  const formData = ref({
    rateType: '01',
    pricingBenchmark: '01',
    basisRate: '',
    monthlyAdjust: '01',
    yearlyRate: '',
    currentBenchmark: '01',
    basisDayRate: '',
    yard: '',
    rate2: '',
    otherReason: '01',
    guaranteeCondition: '01',
    riskCategory: '01',

  })

  // 利率約定書 Dialog
  const rateAgreementDialog = ref(false)
  const lcNo = ref('')

  // ── 共用狀態 ──────────────────────────────────────────────────────────────
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const messageWidth = ref<string>('600px')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  // ── 監聽 formData 以初始化 / 重設表單 ─────────────────────────────────────
  // watch(
  //   () => props.formData,
  //   newData => {
  //     if (newData.appNo) {
  //       lcFormRef.value?.reset()
  //       Object.assign(formData.value, createInitialDraftLcForm())
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

  // 主管送出審核
  function handlerReview (): void {
    console.log('Submit payload:', reviewForm.value)
    try {
      if (reviewForm.value.reviewStatus === 'approve') {
        messageTitle.value = '作業訊息'
        message.value = `<p><span class="font-weight-bold">匯票號碼：</span> <span class="text-blue-grey-darken-4">H97000001</span></p>
          <p><span class="font-weight-bold">審核動作：</span> <span class="text-blue-grey-darken-4">核准</span></p>
          <p><span class="font-weight-bold">審核結果：</span> <span class="text-blue-grey-darken-4">審核完成</span></p>`
        messageStatus.value = 'success'
        messageWidth.value = '600px'
        isConfirmBtn.value = false
        messageDialog.value = true
        processStatus.value = 'success'
      } else if (reviewForm.value.reviewStatus === 'reject') {
        messageTitle.value = '作業訊息'
        message.value = `<p><span class="font-weight-bold">匯票號碼：</span> <span class="text-blue-grey-darken-4">H97000001</span></p>
          <p><span class="font-weight-bold">審核動作：</span> <span class="text-blue-grey-darken-4">退回經辦：王建明退回測試</span></p>
          <p><span class="font-weight-bold">審核結果：</span> <span class="text-blue-grey-darken-4">審核未完成</span></p>`
        messageStatus.value = 'error'
        messageWidth.value = '600px'
        isConfirmBtn.value = false
        messageDialog.value = true
        processStatus.value = 'reject'
      }
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
