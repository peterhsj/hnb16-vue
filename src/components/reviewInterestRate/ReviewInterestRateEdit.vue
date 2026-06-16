<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">
      利率約定(改貸)
    </h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-card-text class="bg-grey-lighten-4">
          <v-table
            class="hnb__table hnb__table--vertical w-100"
            density="compact"
            striped="odd"
          >
            <tbody>
              <tr>
                <td>
                  <div class="hnb__line--indent">
                    1. 國內信用狀利率約定書，其中依本信用狀所墊付之本次押匯金額 <span class="text-red-darken-3">1,000,000</span> 元， 本公司申請借款 新台幣 壹仟萬元整，並同意按下列定價之指標其中之一，按月計付利息。
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  2.改貸之利率約定：
                  <v-radio-group
                    v-model="formData.pricingBenchmark"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                    inline
                  >
                    <div class="d-flex align-center text-body-2">
                      <v-radio
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                        style="flex: none;"
                        value="01"
                      />

                      <div class="d-flex flex-column">
                        <div class="d-flex align-center my-1">
                          <span class="text-no-wrap mx-1">按貴行之基準利率加碼年率</span>

                          <v-text-field
                            v-model="formData.basisRate"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            style="flex: none; width: 120px;"
                            variant="outlined"
                            @click.stop
                          />

                          <span class="text-no-wrap mx-1">% 計息，</span>
                          <span class="text-no-wrap mx-1">嗣後貴行基準利率每</span>

                          <v-select
                            v-model="formData.monthlyAdjust"
                            class="mx-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...MONTHLY_OPTIONS]"
                            style="width: 80px"
                            variant="outlined"
                          />

                          <span class="text-no-wrap mx-1">個月調整時隨同調整，加碼幅度不變。</span>
                        </div>

                      </div>
                    </div>

                    <v-divider class="my-1" />

                    <div class="d-flex align-center text-body-2">
                      <v-radio
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                        style="flex: none;"
                        value="02"
                      />

                      <div class="d-flex flex-column">
                        <div class="d-flex align-center my-1">
                          <span class="text-no-wrap mx-1">固定利率，按年率</span>

                          <v-text-field
                            v-model="formData.yearlyRate"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            style="flex: none; width: 80px;"
                            variant="outlined"
                            @click.stop
                          />

                          <span class="text-no-wrap mx-1">% 計息。</span>
                        </div>
                      </div>
                    </div>

                    <v-divider class="my-1" />

                    <div class="d-flex align-center text-body-2">
                      <v-radio
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                        style="flex: none;"
                        value="03"
                      />

                      <div class="d-flex flex-column">
                        <div class="d-flex align-center my-1">
                          <span class="text-no-wrap mx-1">按貴行之貨幣市場</span>

                          <v-select
                            v-model="formData.currentBenchmark"
                            class="mx-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...CURRENT_BENCHMARK_OPTIONS]"
                            style="width: 190px"
                            variant="outlined"
                          />

                          <v-select
                            v-model="formData.basisDayRate"
                            class="mx-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...BASIS_DAY_RATE_OPTIONS]"
                            style="width: 120px"
                            variant="outlined"
                          />

                          <span class="text-no-wrap mx-1">天期均價利率</span>

                          <v-select
                            v-model="formData.yard"
                            class="mx-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...YARD_OPTIONS]"
                            style="width: 80px"
                            variant="outlined"
                          />

                          <span class="text-no-wrap mx-1">碼</span>

                          <v-text-field
                            v-model="formData.rate2"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            style="flex: none; width: 80px;"
                            variant="outlined"
                            @click.stop
                          />

                          <span class="text-no-wrap mx-1">% 計息，</span>
                        </div>

                        <div class="d-flex align-center my-1">
                          <span class="text-no-wrap mx-1">嗣後以貸放日後每滿</span>

                          <v-select
                            v-model="formData.monthlyAdjust"
                            class="mx-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...MONTHLY_OPTIONS]"
                            style="width: 80px"
                            variant="outlined"
                          />

                          <span class="text-no-wrap mx-1">個月之相對日為利率變動調整日，自調整日起隨同調整，加減碼幅度不變。</span>
                        </div>
                      </div>
                    </div>

                    <v-divider class="my-1" />

                    <div class="d-flex align-center text-body-2">
                      <v-radio
                        v-model="formData.pricingBenchmark"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                        style="flex: none;"
                        value="04"
                      />

                      <div class="d-flex flex-column">
                        <div class="d-flex align-center my-1">
                          <span class="text-no-wrap mx-1">其他：</span>

                          <v-select
                            v-model="formData.otherReason"
                            class="mx-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...OTHER_REASON_OPTIONS]"
                            style="width: 200px"
                            variant="outlined"
                          />
                        </div>
                      </div>
                    </div>
                  </v-radio-group>
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
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            關閉
          </v-btn>

          <v-btn
            class="hnb__btn--orange mx-1 my-2"
            @click="onPreview"
          >
            預覽
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1 my-2"
            type="submit"
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

  const emit = defineEmits<{
    'on-submit': []
    'on-cancel': []
  }>()

  const MONTHLY_OPTIONS = [
    { title: '1', value: '01' },
    { title: '2', value: '02' },
    { title: '3', value: '03' },
    { title: '4', value: '04' },
  ]
  const BASIS_DAY_RATE_OPTIONS = [
    { title: '1', value: '01' },
    { title: '2', value: '02' },
    { title: '20', value: '20' },
    { title: '100', value: '100' },
  ]
  const YARD_OPTIONS = [
    { title: '1', value: '01' },
    { title: '2', value: '02' },
    { title: '3', value: '03' },
    { title: '4', value: '04' },
  ]
  const CURRENT_BENCHMARK_OPTIONS = [
    { title: '1 個月定期存款利率', value: '01' },
    { title: '3 個月定期存款利率', value: '02' },
    { title: '6 個月定期存款利率', value: '03' },
    { title: '1 年定期存款利率', value: '04' },
  ]
  const OTHER_REASON_OPTIONS = [
    { title: '利率市場化', value: '01' },
    { title: '其他', value: '02' },
  ]

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

  function onSubmit (): void {
    console.log('Submit payload:', formData.value)
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

  function onClose (): void {
    console.log('on-close')
  }

  function onPreview (): void {
    console.log('查看利率約定書:')
    rateAgreementDialog.value = true
    lcNo.value = '123'
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
