<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      class="hnb__dialog"
      max-width="1200"
      min-width="300"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>開狀申請書</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">
        <LcAppInfo :bene-type="props.beneType" :data="data" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="hnb__btn--cancel my-2 mx-1"
          variant="flat"
          @click="onClose"
        >
          離開
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  interface Props {
    appDialog?: boolean
    appNo?: string
    beneType?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    appDialog: false,
    appNo: '',
    beneType: 'cds',
  })

  const show = ref<boolean>(props.appDialog)
  watch(
    () => props.appDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:appDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:appDialog': [boolean]
    'on-close': []
  }>()

  const data = {
    paymentMain: 'sight', // sight: 即期, fixed: 定日付款
    fixedExpiryBasis: 'draft_invoice', // draft_invoice: 匯票日期, unified_invoice: 統一發票日期
    useNamedDueDate: false, // 是否使用指定到期日
    namedDueDate: '', // 指定到期日
    invoiceKind: 'invoice', // invoice: 發票, unified: 統一發票
    lastDeliveryDate: '', // 最後交貨日期
    usanceInterestBuyer: false, // 遠期信用狀利息由買方負擔
    otherSpecialTerms: '', // 其他特別指示
    draftFormat: 'bank', // 匯票格式 bank: 銀行格式, beneficiary: 受益人格式
    partialShipment: 'allowed', // 分批交貨 allowed: 可以, not_allowed: 不可以
    discountInterest: 'buyer', // 匯票墊款/貼現利息 buyer: 買方負擔, seller: 賣方負擔
    feeBearer: 'buyer', // 承兌手續費負擔 buyer: 買方負擔, seller: 賣方負擔
    stampSingleParty: 'not_allowed', // 受益人押匯時，匯票承兌/付款申請書是否可以僅由受益人單方蓋章 allowed: 可以, not_allowed: 不可以
    draftStartDate: '', // 限定押匯日期起始日
    invoiceStartDate: '', // 發票起始開立日期
    fixedDaysWithin: null, // 定日付款起算天數
  }

  function onClose (): void {
    show.value = false
    emit('on-close')
  }
</script>
