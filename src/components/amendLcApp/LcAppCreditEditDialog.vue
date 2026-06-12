<template>
  <v-dialog
    v-model="show"
    persistent
    width="1100"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>開狀申請書-授信資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <LcAppCreditEditForm
        :app-no="props.appNo"
        :is-show-preview="props.isShowPreview"
        @on-close="handleClose"
        @on-save="handleSave"
      />

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface Props {
    isLcAppCreditEditDialog?: boolean
    isShowPreview?: boolean
    appNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isLcAppCreditEditDialog: false,
    isShowPreview: false,
    appNo: '',
  })

  const show = ref<boolean>(props.isLcAppCreditEditDialog)
  watch(
    () => props.isLcAppCreditEditDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:isLcAppCreditEditDialog', newVal)
    },
  )

  const emits = defineEmits<{
    'update:isLcAppCreditEditDialog': [boolean]
    'on-close': []
    'on-save': []
  }>()

  const formData = ref({
    pricingBenchmark: null, // 定價指標
    basisRate: '', // 加碼年率
    monthlyAdjust: '01', // 每月調整
    yearlyRate: '', // 固定年利率
    currentBenchmark: '01', // 貨幣市場基準
    basisDayRate: '', // 天期均價利率
    yard: '', // 碼
    rate2: '', // 第二利率
    isAuth: true, // 是否有授權扣帳
    cleanChecked: true, // 是否已確實洗錢防制檢核
    otherReason: null, // 其他定價指標原因
    loanAccount: '', // 放款戶號
    openLoanApprovalNo: '', // 開狀放款核號
    acceptanceLoanApprovalNo: '', // 承兌放款核號
    loanManagerId: '', // 貸放經理人ID
    reviewManagerIdA: '', // 徵審主管 ID-A
    reviewManagerIdB: '', // 徵審主管 ID-B
    openingFee: '', // 開狀手續費
    isStampTaxDeducted: false, // 開狀手續費是否扣印花稅
    acceptanceFee: '', // 承兌手續費
    isAcceptanceFeeStampTaxDeducted: false, // 承兌手續費是否扣印花稅
    depositMarginRate: '', // 存入保證金比率
    guaranteeDeposit: '', // 保證金
    batchNumber: '', // 批次案號
    noticeNo: '', // 信保通知單編號
    cashAmount: '', // 現金金額
    checkAccount1: '', // 支票存款帳號 1
    checkNumber1: '', // 支票號碼 1
    checkAmount1: '', // 金額 1
    checkAccount2: '', // 支票存款帳號 2
    checkNumber2: '', // 支票號碼 2
    checkAmount2: '', // 金額 2
    savingsAccount: '', // 活期存款帳號
    amount1: '', // 第 1 張取款條金額
    amount2: '', // 第 2 張取款條金額
    transferAccount: '', // 轉出會計科目
    transferSerialNumber: '', // 轉出銷帳序號
    transferAmount: '', // 轉出科目金額
    transferSummary: '', // 轉出科目摘要
    guaranteeCondition: null, // 擔保條件
    guaranteeConditionRemark: '', // 擔保條件備註說明
    riskCategoryOne: null, // 風險類別一
    riskCategoryTwo: null, // 風險類別二
    riskCategoryThree: null, // 風險類別三
    riskCategoryFour: null, // 風險類別四
    riskCategoryOnePercentage: '', // 風險類別一百分比
    riskCategoryTwoPercentage: '', // 風險類別二百分比
    riskCategoryThreePercentage: '', // 風險類別三百分比
    riskCategoryFourPercentage: '', // 風險類別四百分比
  })

  function handleClose (): void {
    onClose()
  }

  function handleSave (): void {
    onSave()
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function onSave (): void {
    console.log('儲存')
    // TODO: 儲存邏輯

    emits('on-save')
    show.value = false
  }
</script>
