<template>
  <v-dialog
    v-model="show"
    persistent
    width="900"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>作業訊息</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="d-flex align-center bg-grey-lighten-4">
        <div>
          <ol class="hnb__list--ol">
            <li class="mb-2">1. 若註銷「未過期」信用狀，<span class="text-red">請務必確認已取得受益人同意書</span>，若未取得逕予註銷，恐遭受益人訴諸法律求償。</li>
            <li class="mb-2">2. 若<span class="text-red">「電子信用狀」</span>內容有誤 ( 受益人為<span class="text-red">中鋼</span>集團、<span class="text-red">台塑</span>集團、<span class="text-red">華新麗華</span>、<span class="text-red">奇美</span>集團、<span class="text-red">東和鋼鐵</span>等 )，<span class="text-red">請以修狀方式修正，切勿隨意以先註銷再重新開狀之方式辦理。</span></li>
            <li class="mb-2">3. 若註銷「電子信用狀」後，<span class="text-red">將無法執行當日更正交易</span>。</li>

            <li class="mb-2 d-flex align-center">
              4. 輸入本次欲註銷之信用狀號碼：
              <v-text-field
                v-model="lcNo"
                class="ml-2"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                variant="outlined"
              />
            </li>
          </ol>
        </div>
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
          class="hnb__btn--default mx-1 my-2"
          @click="confirm"
        >
          確定
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue'
  interface Props {
    messageDialog?: boolean
    messageTitle?: string
    message?: string
    messageStatus?: string
    isCancelBtn?: boolean
    isConfirmBtn?: boolean
    dialogWidth?: number | string
  }
  const props = withDefaults(defineProps<Props>(), {
    messageDialog: false,
    messageTitle: '提示',
    message: '',
    messageStatus: '',
    isCancelBtn: true,
    isConfirmBtn: false,
    dialogWidth: 'auto',
  })

  const emits = defineEmits<{
    'update:messageDialog': [boolean]
    'send-confirm': []
    'on-close': []
  }>()

  const show = computed({
    get: () => props.messageDialog,
    set: (value: boolean) => {
      emits('update:messageDialog', value)
    },
  })

  const lcNo = ref<string>('')

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function confirm (): void {
    emits('send-confirm')
    show.value = false
  }
</script>
