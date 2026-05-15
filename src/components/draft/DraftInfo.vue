<template>
  <v-card class="rounded-0" flat width="100%">
    <v-card-title class="px-6 text-subtitle-1 bg-blue-darken-2">
      匯票資訊
    </v-card-title>

    <v-card-text
      class="d-flex align-start"
      style="max-height: calc(100vh - 97px); overflow-y: auto;"
    >
      <!-- 無資料時顯示 -->
      <v-card v-if="!loading && !draftInfo" class="mx-auto my-3 w-100" color="grey-lighten-4" flat>
        <v-card-text class="text-center py-12">
          <v-icon color="grey-lighten-1" icon="mdi-file-document-alert-outline" size="64" />
          <p class="text-h6 text-orange-darken-2 mt-4">尚無資料</p>
        </v-card-text>
      </v-card>

      <v-container v-else class="hnb__print" fluid>
        <v-card class="w-100" flat>
          <v-tabs
            v-model="currentTab"
          >
            <v-tab
              v-for="tab in draftList"
              :key="tab.value"
              class="mr-1"
              :class="[tab.value === currentTab ? 'bg-blue-lighten-4' : 'bg-blue-grey-lighten-5 text-blue-grey-darken-2']"
              :color="tab.value === currentTab ? 'blue-darken-4' : ''"
              :value="tab.value"
            >
              {{ tab.title }}
            </v-tab>
          </v-tabs>

          <v-divider />

          <v-tabs-window v-model="currentTab">
            <v-tabs-window-item
              v-for="tab in draftList"
              :key="tab.value"
              :value="tab.value"
            >
              <v-card flat>
                <!-- <v-card-title class="my-2 text-light-blue-darken-3">{{ tab.title }}</v-card-title> -->
                <v-card-text>
                  <DraftFront v-if="currentTab === 'draftFront'" />
                  <DraftBack v-if="currentTab === 'draftBack'" />
                  <DraftApplication v-if="currentTab === 'draftApplication'" />
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>

        <invoiceList class="draft-list-print" />
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

      <v-btn
        color="teal-lighten-1"
        prepend-icon="mdi-printer"
        variant="flat"
        @click="printHandler"
      >
        列印
      </v-btn>
    </v-card-actions>
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
    />
  </v-card>
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
    draftId?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    draftId: '',
  })

  const isSearching = ref<boolean>(false)

  // 監聽 draftId 變化，自動重新獲取資料
  watch(
    () => props.draftId,
    newVal => {
      if (newVal) {
        fetchDraftInfo()
        isSearching.value = true
      }
    },
  )

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  const loading = ref<boolean>(false)

  interface DraftItem {
    title: string
    value: string
  }
  const draftList: DraftItem[] = [
    {
      title: '匯票正面',
      value: 'draftFront',
    },
    {
      title: '匯票反面',
      value: 'draftBack',

    },
    {
      title: '匯票申請書',
      value: 'draftApplication',
    },
  ]

  const currentTab = ref<string>('draftFront')
  onMounted(() => {
    // fetchDraftInfo()
  })
  // 匯票資訊
  interface DraftInfo {
    draftId: number // 匯票資料庫主鍵 ID
    draftNo?: string // 匯票號碼
    status?: number // 匯票狀態碼
    importDate?: string // 匯票匯入日期（yyyy/MM/dd）
    downloadFlag?: number // 是否已下載旗標
    negoDate?: string // 押匯日期（yyyy/MM/dd），優先取 NegoDate，若為 null 則取 shipmentDate
    shipmentDate?: string // 裝船日期（yyyy/MM/dd）
    amount?: number // 匯票金額
    amountInChinese?: string // 金額中文大寫
    itemName?: string // 貨品名稱，若無則為空字串
    itemQuantity?: number // 貨品數量（可為 null）
    itemSubtotal?: number // 貨品小計（可為 null）
    applicantAddr?: string // 申請人地址，若無則為空字串
    depositAccount?: string // 存款帳號
    negoReason?: string // 押匯原因，值同 itemName

  }
  // 信用狀資訊
  interface LcInfo {
    lcNo: string // 信用狀號碼
    lcDateOfIssue?: string // 信用狀開狀日期（yyyy/MM/dd）
    dateOfIssue?: string // 開狀日（yyyy/MM/dd），值同 lcDateOfIssue
    dateOfExpiry?: string // 信用狀到期日（yyyy/MM/dd）
    lcImportDate?: string // 信用狀匯入日期（yyyy/MM/dd）
    lcAmount?: number // 信用狀金額
    lcType?: string // 信用狀類型
    availableAmount?: number // 信用狀可用金額
    applicantReceiptNo?: string // 申請人統一編號
    shipmentNoLaterThen?: string // 最遲裝船日（yyyy/MM/dd）
    dueDays?: number // 到期天數 = lc.dueDays + negoDraft.adjustUsance（可為 null）
  }
  // 銀行資訊
  interface BankInfo {
    issuingBank?: string // 開狀銀行代碼
    issuingBankId?: string // 開狀銀行代碼，值同 issuingBank
    issuingBankName?: string // 開狀銀行名稱 + 分行名稱
    advisingBank?: string // 押匯銀行代碼
    advisingBankName?: string // 付款銀行名稱 + 分行名稱
    notifyingBank?: string // 通知銀行代碼
    notifyingBankName?: string // 通知銀行名稱 + 分行名稱
  }
  // 受益人資訊
  interface BeneficiaryInfo {
    beneficiaryId: number // 受益人資料庫 ID
    beneficiaryName?: string // 受益人名稱
    beneficiaryReceiptNo?: string // 受益人統一編號
    beneficiaryAddr?: string // 受益人地址

  }
  // 押匯組織（Seller）
  interface SellerInfo {
    companyId: number // 押匯組織公司 ID
    companyName?: string // 押匯組織公司名稱
    receiptNo?: string // 押匯組織統一編號
    companyAddr?: string // 押匯組織地址
  }
  // 印鑑資訊
  interface SealInfo {
    frontSign?: string // 正面印鑑資訊
    backSign?: string // 背面印鑑資訊
  }

  const bankInfo = ref<BankInfo | null>(null)
  const beneficiaryInfo = ref<BeneficiaryInfo | null>(null)
  const draftInfo = ref<DraftInfo | null>(null)
  const lcInfo = ref<LcInfo | null>(null)
  const sealInfo = ref<SealInfo | null>(null)
  const sellerInfo = ref<SellerInfo | null>(null)

  // 取得匯票資訊
  async function fetchDraftInfo (): Promise<void> {
    if (isSearching.value) {
      return
    }

    const payload = {
      draftId: props.draftId,
    }
    loading.value = true
    const apiUrl = '/api/draftInfo/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data: { data: draftData } } = res
        // const { bankInfo, beneficiaryInfo, draftInfo, lcInfo, sealInfo, sellerInfo } = draftData

        // console.log('API 回應:', { code, draftData })
        // 更新表格數據
        if (status === 200) {
          bankInfo.value = draftData.bankInfo
          beneficiaryInfo.value = draftData.beneficiaryInfo
          draftInfo.value = draftData.draftInfo
          lcInfo.value = draftData.lcInfo
          sealInfo.value = draftData.sealInfo
          sellerInfo.value = draftData.sellerInfo
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchDraftInfo, {
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

  function printHandler (): void {
    window.print()
  }

  function onClose (): void {
    window.close()
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>

<style scoped>
@media print {
  /* 設定列印背景為白色 */
  * {
    background-color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 隱藏對話框背景和其他元素 */
  /* :deep(.v-overlay__scrim),
  :deep(.v-dialog) {
    position: static !important;
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    box-shadow: none !important;
  } */

  :deep(.v-card) {
    box-shadow: none !important;
    max-width: 100% !important;
  }

  /* 隱藏不需要列印的元素 */
  :deep(.v-card-title),
  :deep(.v-card-actions),
  :deep(.v-divider),
  :deep(.v-tabs) {
    display: none !important;
  }

  /* 重置 v-card-text 的樣式以適應列印 */
  :deep(.v-card-text) {
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
  }

  /* 確保列印內容可見 */
  .hnb__print {
    display: block !important;
    width: 100% !important;
  }

  /* DraftList 前面分頁 */
  .draft-list-print {
    break-before: page;
  }

  /* 隱藏 tabs-window 的容器 */
  /* :deep(.v-tabs-window) {
    display: none !important;
  } */
}
</style>
