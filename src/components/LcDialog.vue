<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      max-width="400"
      min-width="300"
    >
      <v-card-title class="px-6 text-subtitle-1 bg-blue-darken-2">
        信用狀資訊
      </v-card-title>
      <v-card-text class="d-flex align-center">
        <!-- 無資料時顯示 -->
        <v-card v-if="!loading && !lcInfo" class="mx-auto my-3" color="grey-lighten-4" flat>
          <v-card-text class="text-center py-12">
            <v-icon color="grey-lighten-1" icon="mdi-file-document-alert-outline" size="64" />
            <p class="text-h6 text-orange-darken-2 mt-4">尚無資料</p>
          </v-card-text>
        </v-card>
        <v-container v-else class="pa-0" fluid>
          <v-row dense>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              買受人統編：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.buyerTaxId }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              信用狀號碼：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.lcNumber }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              開狀銀行代號：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.issuingBank }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              付款銀行代號：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.payingBank }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              通知銀行代號：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.notifyBank }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              總金額 ( NT$ )：
            </v-col>
            <v-col class="text-end" cols="7">
              {{ lcInfo.lcAmount ? `NT$ ${lcInfo.lcAmount}` : '' }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              最後交貨日：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.lastDeliveryDate }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              有效期限：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.expiryDate }}
            </v-col>
            <v-col class="text-teal-darken-2 text-end" cols="5">
              信用狀天期：
            </v-col>
            <v-col cols="7">
              {{ lcInfo.Usance }}
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />

        <v-btn
          class="text-white"
          color="blue-grey-lighten-3"
          variant="flat"
          @click="onClose"
        >
          關閉
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
    />
  </v-dialog>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface Props {
    lcDialog?: boolean
    lcId?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    lcDialog: false,
    lcId: '',
  })

  const show = ref<boolean>(props.lcDialog)
  watch(
    () => props.lcDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:lcDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:lcDialog': [boolean]
    'on-close': []
  }>()

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  const loading = ref<boolean>(false)

  interface LcInfo {
    lcId: string
    buyerTaxId: string // 買受人統編
    lcNumber: string // 信用狀號碼
    issuingBank: string // 開狀銀行代號
    payingBank: string // 付款銀行代號
    notifyBank: string // 通知銀行代號
    lcAmount: string // 總金額(NT$)
    lastDeliveryDate: string // 最後交貨日
    expiryDate: string // 有效期限
    Usance: string // 信用狀天期
  }
  const lcInfo = ref<LcInfo>({
    lcId: '',
    buyerTaxId: '',
    lcNumber: '',
    issuingBank: '',
    payingBank: '',
    notifyBank: '',
    lcAmount: '',
    lastDeliveryDate: '',
    expiryDate: '',
    Usance: '',
  })

  onMounted(() => {
    fetchLcInfo()
  })

  // 取得 L/C 資訊
  async function fetchLcInfo (): Promise<void> {
    const payload = {
      lcId: props.lcId,
    }
    loading.value = true
    const apiUrl = '/api/lcInfo/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: apiData } = data

        // console.log('API 回應:', { code, data })
        // 更新表格數據
        if (status === 200) {
          lcInfo.value = apiData
          console.log('信用狀資訊:', lcInfo.value)
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchLcInfo, {
        messageTitle,
        message,
        messageStatus,
        isConfirmBtn,
        messageDialog,
      })
    } finally {
      loading.value = false
    }
  }

  function onClose (): void {
    show.value = false
    emit('on-close')
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
