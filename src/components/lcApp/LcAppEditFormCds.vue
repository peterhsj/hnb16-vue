<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">填寫開狀申請書</h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-card-text class="bg-grey-lighten-4 pa-3">
        <v-form ref="lcFormRef" @submit.prevent="onSubmit">

          <!-- ===== 主表格 ===== -->
          <v-table class="table-sm hnb__table-v bg-white" density="compact">
            <tbody>
              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  開狀銀行：
                </th>

                <td class="lc-td">
                  {{ issuingBankLabel }}
                </td>

                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  通知銀行：
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="form.noticeBank"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...NOTICE_BANK_ITEMS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  信用狀別：
                </th>

                <td class="lc-td">
                  <v-radio-group
                    v-model="form.lcType"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                    inline
                  >
                    <v-radio label="即期" value="sight" />
                    <v-radio label="遠期" value="usance" />
                  </v-radio-group>
                </td>

                <th class="text-end" scope="row">
                  付款銀行：
                </th>

                <td class="lc-td">
                  {{ paymentBankLabel }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  金額：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center flex-wrap ga-2">
                    <v-select
                      v-model="form.currency"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...CURRENCY_OPTIONS]"
                      style="max-width: 120px"
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="form.amount"
                      class="flex-grow-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      style="min-width: 120px"
                      variant="outlined"
                    />

                    <span class="text-no-wrap">元整</span>
                  </div>
                </td>

                <th class="text-end text-no-wrap" scope="row">
                  有效期限：
                </th>

                <td class="lc-td">
                  <v-date-input
                    v-model="form.expiryDate"
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

              <tr>
                <th class="text-end" scope="row">
                  受益人名稱：
                </th>

                <td class="lc-td" colspan="3">
                  {{ beneficiaryName }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人地址：
                </th>

                <td class="lc-td" colspan="3">
                  {{ beneficiaryAddress }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人Email：
                </th>

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="form.beneEmail"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人電話：
                </th>

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="form.benePhone"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  申請人：
                </th>

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="form.applicantName"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  申請人統一編號：
                </th>

                <td class="lc-td" colspan="3">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-text-field
                      v-model="form.applicantTaxId"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      maxlength="8"
                      style="max-width: 200px"
                      variant="outlined"
                    />

                    <v-btn
                      class="hnb__btn--default"
                      @click="lookupApplicant"
                    >
                      查詢
                    </v-btn>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  申請人地址：
                </th>

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="form.applicantAddress"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  付款期限：
                </th>

                <td class="lc-td" colspan="3">
                  {{ paymentTermsText }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  貨物名稱：
                </th>

                <td class="lc-td" colspan="3">
                  <v-textarea
                    v-model="form.goodsDescription"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    rows="3"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  電子押匯之特別指示條款：
                </th>

                <td class="lc-td" colspan="3">
                  <v-radio-group
                    v-model="form.electronicNote"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                  >
                    <v-radio value="csc">
                      <template #label>
                        <span class="font-weight-bold">中鋼之電子押匯特別指示條款</span>
                      </template>
                    </v-radio>

                    <div class="ml-4 mb-4">
                      <ol class="hnb__list--ol text-body-1">
                        <li v-for="(line, i) in cscClauses" :key="i">
                          {{ line }}
                        </li>
                      </ol>
                    </div>

                    <v-radio value="custom">
                      <template #label>
                        <span class="font-weight-bold">或自行填寫電子押匯特別指示條款</span>
                      </template>
                    </v-radio>
                  </v-radio-group>

                  <div class="mt-2 ml-5">
                    <v-textarea
                      v-model="form.customElectronicNote"
                      color="teal-darken-2"
                      density="compact"
                      :disabled="!customNoteEditable"
                      hide-details="auto"
                      rows="7"
                      variant="outlined"
                    />
                  </div>

                  <div class="mt-4">
                    <div class="font-weight-bold mb-2">
                      檢附單據：
                    </div>

                    <v-checkbox
                      v-model="form.deliverPaymentRequest"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                      label="匯票付款申請書乙份"
                    />

                    <v-checkbox
                      v-model="form.deliverInvoice"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                      label="統一發票"
                    />

                    <v-checkbox
                      v-model="form.deliverOther"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                      label="其他"
                    />

                    <v-textarea
                      v-model="form.deliverOtherDetail"
                      class="mt-2"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      rows="3"
                      variant="outlined"
                    />
                  </div>

                  <div class="mt-4 d-inline-flex align-center">
                    <span class="font-weight-bold">特別指示條款：</span>
                    <span class="ml-1">分批交貨：</span>

                    <v-radio-group
                      v-model="form.partialShipment"
                      class=" ml-2"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="可以" value="allowed" />
                      <v-radio label="不可以" value="not_allowed" />
                    </v-radio-group>

                    <span class="text-body-2">（未填者視為得分批交貨）。</span>
                  </div>

                  <div class="mt-3 d-flex flex-wrap align-center ga-2">
                    <span class="font-weight-bold text-no-wrap">最後交貨日期：</span>

                    <v-date-input
                      v-model="form.lastDeliveryDate"
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

                    <span class="text-body-2">（未填者自開狀日起三個月視為最後交貨日）。</span>
                  </div>

                  <div class="mt-4">
                    <div class="font-weight-bold mb-2">
                      其他：
                    </div>

                    <v-textarea
                      v-model="form.otherSpecialTerms"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="~ 其他特別指示條款 ~"
                      rows="3"
                      variant="outlined"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- 底部按鈕列 -->
          <div class="d-flex flex-wrap justify-center align-center ga-2 mt-6">
            <v-btn class="hnb__btn--cancel mx-1" @click="confirmCancel">
              取消
            </v-btn>

            <v-btn class="hnb__btn--orange mx-1" @click="openPreview">
              預覽
            </v-btn>

            <v-divider class="mx-2 d-none d-md-flex" vertical />

            <v-btn class="hnb__btn--cancel mx-1" @click="resetForm">
              重設
            </v-btn>

            <v-btn class="hnb__btn--default mx-1" type="submit">
              確定
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 預覽開狀申請書 App Dialog -->
    <AppDialog
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />
    <!-- Prompt Dialog -->
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
  import type { LcAppData, LcCdsApplicationPayload } from '@/types/lcCdsApplication'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    createInitialLcCdsForm,
    CURRENCY_OPTIONS,
    DEFAULT_CUSTOM_ELECTRONIC_NOTE,
    NOTICE_BANK_ITEMS,
  } from '@/types/lcCdsApplication'

  const props = defineProps<{
    formData: LcAppData
  }>()

  const lcFormRef = ref<InstanceType<typeof VForm> | null>(null)
  const form = reactive<LcCdsApplicationPayload>({
    noticeBank: null,
    lcType: null,
    currency: 'TWD',
    amount: '',
    expiryDate: '',
    beneEmail: '',
    benePhone: '',
    applicantName: '',
    applicantTaxId: '',
    applicantAddress: '',
    goodsDescription: '',
    electronicNote: null,
    customElectronicNote: DEFAULT_CUSTOM_ELECTRONIC_NOTE,
    deliverPaymentRequest: false,
    deliverInvoice: false,
    deliverOther: false,
    deliverOtherDetail: '',
    partialShipment: '',
    lastDeliveryDate: '',
    otherSpecialTerms: '',
  })

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')
  // App Dialog
  const appDialog = ref(false)
  const appNo = ref<string>('')

  const customNoteEditable = computed(() => form.electronicNote === 'custom')

  const issuingBankLabel = '華南商業銀行 高雄分行'
  const paymentBankLabel = '華南商業銀行 高雄分行'
  const beneficiaryName = '中國鋼鐵股份有限公司'
  const beneficiaryAddress = '高雄市小港區中鋼路1號'
  const paymentTermsText = '見票即付。'

  const emit = defineEmits<{
    'on-submit': []
    'on-cancel': []
  }>()

  watch(
    () => props.formData,
    newData => {
      console.log('Received formData prop:', newData)
      const { type, appNo } = newData as LcAppData

      if (type === 'edit' && appNo) {
        // 模擬從 API 取得資料並填入表單
        Object.assign(form, {
          ...createInitialLcCdsForm(),
        })
      } else if (type === 'new') {
        lcFormRef.value?.reset()
      }
    },
    { immediate: true },
  )

  function resetForm (): void {
    lcFormRef.value?.reset()
  }

  function lookupApplicant (): void {
    console.log('查詢申請人資料：此為原型畫面，尚未串接後端 API。')
  }

  function openPreview (): void {
    appDialog.value = true
  }

  function confirmCancel (): void {
    // cancelDialog.value = true
    messageTitle.value = '訊息通知'
    message.value = '確定要離開填寫畫面？未儲存的資料將遺失。'
    messageStatus.value = 'alert'
    processStatus.value = 'cancel'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function onSubmit (): void {
    console.log('Submit payload:', form)
    try {
      emit('on-submit')
    } catch (error) {
      console.error('Error emitting submit event:', error)
    }
  }

  const cscClauses = [
    '1. 賣方所提供鋼品之一部或全部，可能產自中國鋼鐵股份有限公司或中龍鋼鐵股份有限公司(下稱中龍公司)，視實際出貨狀況而定。如產自中龍公司，賣方就其鋼品品質，負賣方責任，至如約定價格，各交易條件及優惠措施均不受影響。',
    '2. 匯票及匯票付款申請書使用中鋼格式，由受益人單獨簽章或使用數位憑證有效。',
    '3. 貨物可以分批交貨。',
    '4. 貨物明細以發票為準。',
    '5. 發票金額大於匯票金額及發票內容備註「受託代銷」字樣可以接受。',
    '6. 本信用狀適用 eUCP2.0 版。',
    '7. 允許受益人以匯票、匯票付款申請書及發票電子檔(包含電子發票證明聯等)方式押匯，另「受益人完整提示通知」得附加於匯票付款申請書之最後。',
    '8. 押匯電子文件透過網址：HTTPS://CDSLC.UXCDS.COM/CDSLC/ 提示。',
  ] as const

  // 確認 message
  function messageConfirm (): void {
    if (processStatus.value === 'cancel') {
      emit('on-cancel')
    }
    messageDialog.value = false
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 離開 App Dialog
  function appDialogClose (): void {
    appDialog.value = false
    appNo.value = ''
  }
</script>
