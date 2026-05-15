<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">填寫開狀申請書</h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-card-text class="bg-grey-lighten-4 pa-3">
        <v-form ref="lcFormRef" @submit.prevent="onSubmit">

          <div class="text-center mb-4">
            <div class="text-h6 font-weight-medium">
              開發國內不可撤銷信用狀申請書
            </div>

            <div class="text-body-1">
              {{ headerDate }}
            </div>
          </div>
          <!-- ===== 主表格 ===== -->
          <v-table class="table-sm hnb__table-v bg-white" density="compact">
            <tbody>
              <tr>
                <td class="lc-td" colspan="2">
                  <p class="font-weight-bold mb-2">
                    華南商業銀行 台北分行 台鋻
                  </p>

                  <ol class="lc-ol mb-0 text-body-2">
                    <li v-for="(t, i) in introItems" :key="i">
                      {{ t }}
                    </li>
                  </ol>
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  申請人：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.applicantName"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  申請人統一編號：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-text-field
                      v-model="form.applicantTaxId"
                      density="compact"
                      hide-details="auto"
                      maxlength="8"
                      style="max-width: 200px"
                      variant="outlined"
                    />

                    <v-btn
                      class="text-none"
                      color="primary"
                      size="small"
                      variant="tonal"
                      @click="lookupApplicant"
                    >
                      查詢
                    </v-btn>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  申請人聯絡人姓名：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.contactName"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  申請人聯絡人電話：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.contactPhone"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  金額：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-nowrap">新台幣</span>

                    <v-text-field
                      v-model="form.amount"
                      class="flex-grow-1"
                      density="compact"
                      hide-details="auto"
                      style="min-width: 120px"
                      variant="outlined"
                    />

                    <span class="text-nowrap">元整</span>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  有效期限至：<br>
                  <span class="text-caption">（未填者自開狀日三個月視為最後有效期限）</span>
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.expiryDate"
                    density="compact"
                    hide-details="auto"
                    prepend-inner-icon="mdi-calendar"
                    style="max-width: 220px"
                    type="datetime-local"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  通知銀行：（如有需要指定銀行時請填上）
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="form.noticeBank"
                    clearable
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...FPC_NOTICE_BANK_ITEMS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  受益人：
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="form.beneCorp"
                    class="mb-2"
                    clearable
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...FPC_BENE_ITEMS]"
                    placeholder="請選擇受益人名稱"
                    variant="outlined"
                  />

                  <div class="d-flex align-center ga-2 mb-2">
                    <span class="text-nowrap text-end" style="width: 80px">統一編號：</span>

                    <v-text-field
                      density="compact"
                      hide-details="auto"
                      :model-value="selectedBene?.taxId ?? ''"
                      readonly
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center ga-2">
                    <span class="text-nowrap text-end" style="width: 80px">名稱：</span>

                    <v-text-field
                      density="compact"
                      hide-details="auto"
                      :model-value="selectedBene?.corpName ?? ''"
                      readonly
                      variant="outlined"
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  受益人之負責人：
                </th>

                <td class="lc-td">
                  {{ selectedBene?.managerName || '—' }}
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  負責人職稱：
                </th>

                <td class="lc-td">
                  {{ selectedBene?.managerTitle || '—' }}
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  受益人地址：
                </th>

                <td class="lc-td">
                  {{ selectedBene?.address || '—' }}
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  受益人電話：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.benePhone"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  受益人電子信箱：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.beneEmail"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  受益人事業部：
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="form.department"
                    clearable
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...FPC_DEPT_ITEMS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  客戶編號：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.customerNo"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  本信用狀可由上開受益人在不超過上開金額範圍內，依本信用狀規定條件簽發匯票洽請洽兌/付款：
                </td>
              </tr>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  一、匯票之條件：
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  甲、付款人：
                </th>

                <td class="lc-td">
                  {{ payerBankLabel }}
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide align-top" scope="row">
                  乙、付款期限：
                </th>

                <td class="lc-td">
                  <v-radio-group
                    v-model="form.paymentKind"
                    density="compact"
                    hide-details="auto"
                  >
                    <v-radio label="見票即付。" value="sight" />

                    <v-radio value="fixed">
                      <template #label>
                        <span>以「定日付款」方式填寫到期日，其到期日為：</span>
                      </template>
                    </v-radio>
                  </v-radio-group>

                  <div v-if="form.paymentKind === 'fixed'" class="ml-4 mt-2">
                    <v-radio-group
                      v-model="form.fixedExpiryBasis"
                      density="compact"
                      hide-details="auto"
                    >
                      <v-radio label="匯票發票日" value="draft_invoice" />
                      <v-radio label="統一發票日" value="unified_invoice" />
                    </v-radio-group>

                    <div class="d-flex align-center ga-2 flex-wrap mt-2">
                      <span>起算</span>

                      <v-text-field
                        v-model="form.fixedDaysWithin"
                        density="compact"
                        hide-details="auto"
                        style="max-width: 72px"
                        variant="outlined"
                      />

                      <span>天內。</span>
                    </div>

                    <div class="d-flex align-center ga-2 flex-wrap mt-3">
                      <v-checkbox
                        v-model="form.useNamedDueDate"
                        density="compact"
                        hide-details
                        label="指定期日為"
                      />

                      <v-text-field
                        v-model="form.namedDueDate"
                        density="compact"
                        :disabled="!form.useNamedDueDate"
                        hide-details="auto"
                        prepend-inner-icon="mdi-calendar"
                        style="max-width: 220px"
                        type="datetime-local"
                        variant="outlined"
                      />
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row">
                  丙、金額：
                </th>

                <td class="lc-td text-body-2">
                  須與相關發票上所列開金額一致或依照本信用狀其他指示。
                </td>
              </tr>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  二、應檢附之單證如下：
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide" scope="row" />

                <td class="lc-td">
                  <div class="text-body-2 mb-2">
                    1. 匯票承兌/付款申請書乙份。
                  </div>

                  <div class="d-flex align-center flex-wrap ga-2 mb-2">
                    <span>2.</span>

                    <v-radio-group
                      v-model="form.invoiceDocKind"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="發票" value="invoice" />
                      <v-radio label="或統一發票" value="unified" />
                    </v-radio-group>
                  </div>

                  <div class="mb-2">
                    <div class="mb-1">
                      3. 其他（請註明）：
                    </div>

                    <v-textarea
                      v-model="form.otherDocumentsNote"
                      density="compact"
                      hide-details="auto"
                      rows="3"
                      variant="outlined"
                    />
                  </div>

                  <div>
                    <div class="mb-1">
                      4. 上項單據應載明申請人向受益人購買下列產品：
                    </div>

                    <v-textarea
                      v-model="form.productDescriptionNote"
                      density="compact"
                      hide-details="auto"
                      rows="3"
                      variant="outlined"
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <th class="lc-th-wide align-top" scope="row">
                  特別指示：
                </th>

                <td class="lc-td text-body-2">
                  <p>1. 匯票及匯票付款申請書使用受益人所訂格式，由受益人單獨簽章或使用數位憑證有效。</p>
                  <p>2. 貨物可以分批交貨。</p>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>3. 最後交貨日期：</span>

                    <v-text-field
                      v-model="form.lastDeliveryDate"
                      density="compact"
                      hide-details="auto"
                      prepend-inner-icon="mdi-calendar"
                      style="max-width: 220px"
                      type="datetime-local"
                      variant="outlined"
                    />

                    <span>（未填者自開狀日起三個月視為最後交貨日，惟不得超過信用狀有效日期）。</span>
                  </div>

                  <p>4. 發票日期早於開狀日期可以接受。</p>
                  <p>5. 發票金額大於開狀金額或匯票金額可以接受。</p>
                  <p>6. 以受益人所屬分公司或分廠名義開立之發票押匯可以接受。</p>
                  <p>7. 本信狀適用 eUCP2.0 版。</p>
                  <p>8. 允許受益人以匯票、匯票付款申請書及發票電子檔方式押匯。</p>
                  <p>9. 押匯電子文件透過網址: HTTPS://ecrm.fpg.com.tw 提示。</p>

                  <div class="d-flex align-center ga-2 my-2">
                    <span>10. 遠期信用狀利息：</span>

                    <v-checkbox
                      v-model="form.usanceInterestBuyer"
                      density="compact"
                      hide-details
                      label="買方負擔"
                    />
                  </div>

                  <div class="my-2">
                    <div class="mb-1">
                      11. 其他：
                    </div>

                    <v-textarea
                      v-model="form.otherSpecialTerms"
                      density="compact"
                      hide-details="auto"
                      placeholder="~ 其他特別指示條款 ~"
                      rows="3"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>12. 限定押匯日期：自</span>

                    <v-text-field
                      v-model="form.draftStartDate"
                      density="compact"
                      hide-details="auto"
                      prepend-inner-icon="mdi-calendar"
                      style="max-width: 220px"
                      type="datetime-local"
                      variant="outlined"
                    />

                    <span>起始可押匯。（未填寫者視為未限定押匯日期）</span>
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>13. 發票起始開立日期：</span>

                    <v-text-field
                      v-model="form.invoiceStartDate"
                      density="compact"
                      hide-details="auto"
                      prepend-inner-icon="mdi-calendar"
                      style="max-width: 220px"
                      type="datetime-local"
                      variant="outlined"
                    />

                    <span>。（以統一發票日起算匯票到其日期者，請填寫此項，未填寫者視為未限制發票開立日期）</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td class="lc-td text-body-2" colspan="2">
                  <p class="mb-2">
                    <span class="font-weight-bold">利率約款：</span>
                    貴行依本申請書開發信用狀所墊付之款項，申請人同意按貴我雙方所訂之利率訂價指標，按月計付利息。
                  </p>

                  <ol class="lc-ol mb-2">
                    <li class="mb-2">
                      <div class="d-flex align-center flex-wrap ga-2">
                        <v-checkbox
                          v-model="form.rateBaseChecked"
                          density="compact"
                          hide-details
                        />

                        <span>基準利率 加碼年率</span>

                        <v-text-field
                          v-model="form.rateBaseSpread"
                          density="compact"
                          :disabled="!form.rateBaseChecked"
                          hide-details="auto"
                          style="max-width: 72px"
                          variant="outlined"
                        />

                        <span>% 計付利息，如貴行利率調整時亦隨同調整。</span>
                      </div>
                    </li>

                    <li>
                      <div class="d-flex align-center flex-wrap ga-2">
                        <v-checkbox
                          v-model="form.rateFixedChecked"
                          density="compact"
                          hide-details
                        />

                        <span>年率</span>

                        <v-text-field
                          v-model="form.rateFixedPercent"
                          density="compact"
                          :disabled="!form.rateFixedChecked"
                          hide-details="auto"
                          style="max-width: 72px"
                          variant="outlined"
                        />

                        <span>% 固定計息。</span>
                      </div>
                    </li>
                  </ol>

                  <p class="mb-2">
                    <span class="font-weight-bold">新臺幣短期放款計期方式：</span>
                    按日計息，以每年365天為利息計算基礎，逢閏年時亦同。利率=本金餘額×年利率×1/365×計息天數。
                  </p>

                  <p class="font-weight-bold mb-1">
                    手續費約款：
                  </p>

                  <ol class="hnb__list--ol">
                    <li>
                      貴行依本申請書開發「利息及承兌手續費由賣方負擔」之遠期信用狀，如於信用狀有效期限屆滿而受益人未向貴行辦理承兌或申請人申請註銷信用狀時，申請人同意依開狀金額，視信用狀有效期限以三個月為一期(未滿三個月者視為一期)，按年率
                      0.1% 補繳開狀手續費。
                    </li>

                    <li>
                      貴行依本申請書開發「利息由買方負擔」之遠期信用狀，如有下列情形之ㄧ者，申請人同意依押匯金額及信用狀有效期限（三個月為一期，未滿三個月者視為一期），按年率 0.1%
                      補繳開狀手續費，最低金額為新台幣 1,000 元：<br>
                      (1)受益人押匯後，申請人立即還款而未向貴行借款者。<br>
                      (2)申請人提前清償借款，其利息加計原開狀手續費（分批押匯改貸，以第一筆押匯金額計算）合計低於新台幣 1,000 元者。
                    </li>
                  </ol>
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
  import type { FpcBeneOption, LcAppData, LcFpcApplicationPayload } from '@/types/lcFpcApplication'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    createInitialLcFpcForm,
    FPC_BENE_ITEMS,
    FPC_DEPT_ITEMS,
    FPC_NOTICE_BANK_ITEMS,
  } from '@/types/lcFpcApplication'

  const props = defineProps<({
    formData: LcAppData
  })>()

  const lcFormRef = ref<InstanceType<typeof VForm> | null>(null)
  const form = reactive<LcFpcApplicationPayload>({
    applicantName: '',
    applicantTaxId: '12345678',
    contactName: '',
    contactPhone: '',
    amount: '',
    expiryDate: '',
    noticeBank: null,
    beneCorp: null,
    benePhone: '',
    beneEmail: '',
    department: null,
    customerNo: '',
    paymentKind: null,
    fixedExpiryBasis: null,
    fixedDaysWithin: '',
    useNamedDueDate: false,
    namedDueDate: '',
    invoiceDocKind: null,
    otherDocumentsNote: '',
    productDescriptionNote: '',
    lastDeliveryDate: '',
    otherSpecialTerms: '',
    usanceInterestBuyer: false,
    draftStartDate: '',
    invoiceStartDate: '',
    rateBaseChecked: false,
    rateBaseSpread: '',
    rateFixedChecked: false,
    rateFixedPercent: '',
  })
  const selectedBene = computed<FpcBeneOption | null>(() => {
    const v = form.beneCorp
    if (!v) return null
    return FPC_BENE_ITEMS.find(b => b.value === v) ?? null
  })

  const headerDate = '114 年 5 月 10 日'
  const payerBankLabel = '華南商業銀行 台北分行'

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
          ...createInitialLcFpcForm(),
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

  const introItems = [
    '茲請　貴行准照前訂委任開發國內信用狀契約之約定依下開條件開發信用狀。',
    '本信用狀規定如有未盡事宜適用國際商會所訂現行「信用狀統一慣例與實務」之規定。',
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
