<template>
  <div>
    <!-- 匯票資訊 -->
    <!-- 無資料時顯示 -->
    <v-card v-if="!loading && !draftInfo" class="mx-auto my-3 w-100" color="grey-lighten-4" flat>
      <v-card-text class="text-center py-12">
        <v-icon color="grey-lighten-1" icon="mdi-file-document-alert-outline" size="64" />
        <p class="text-h6 text-orange-darken-2 mt-4">尚無資料</p>
      </v-card-text>
    </v-card>

    <v-container v-else class="ifslc__print" fluid>
      <v-card class="w-100" color="grey-lighten-4" flat>
        <v-tabs
          v-model="currentTab"
          class="hnb__tab"
        >
          <v-tab
            v-for="tab in draftList"
            :key="tab.value"
            class="mr-1"
            :class="{ 'active-tab': currentTab === tab.value }"
            :value="tab.value"
          >
            {{ tab.title }}
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="currentTab">
          <v-tabs-window-item
            v-for="tab in draftList"
            :key="tab.value"
            :value="tab.value"
          >
            <v-card class="hnb__card--bordered bg-grey-lighten-4" flat>
              <!-- <v-card-title class="my-2 text-light-blue-darken-3">{{ tab.title }}</v-card-title> -->
              <v-card-text>
                <DraftPage v-if="currentTab === 'draftPage'" />
                <DraftApplication v-if="currentTab === 'draftApplication'" />
                <InvoiceList v-if="currentTab === 'invoiceList'" />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>

    </v-container>
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
    />
  </div>
</template>

<script setup lang="ts">
  import type { BankInfo, BeneficiaryInfo, DraftInfo, LcInfo, SealInfo, SellerInfo } from '@/types/draftDetail'
  import { ref, watch } from 'vue'
  import { getDraftDetailList } from '@/api/draftDetail'

  interface Props {
    draftNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    draftNo: '',
  })

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  interface DraftItem {
    title: string
    value: string
  }
  const draftList: DraftItem[] = [
    {
      title: '匯票正反面',
      value: 'draftPage',
    },
    {
      title: '匯票申請書',
      value: 'draftApplication',
    },
    {
      title: '發票清冊',
      value: 'invoiceList',
    },
  ]
  const currentTab = ref<string>('draftPage')

  const loading = ref<boolean>(false)
  const isSearching = ref<boolean>(false)
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
      draftNo: props.draftNo,
    }
    loading.value = true
    // const apiUrl = '/api/draftInfo/list'
    console.log('draftNo 變化:', payload.draftNo)
    try {
      // if (userInfo.value.token) {

      const res = await getDraftDetailList(payload)
      // {
      //   headers: {
      //     Authorization: `Bearer ${userInfo.value.token}`,
      //   },
      // }
      // )
      const { code, data } = res.data
      console.log('API 回應:', res.data)
      // const { bankInfo, beneficiaryInfo, draftInfo, lcInfo, sealInfo, sellerInfo } = data || {}

      // 更新表格數據
      if (code === 200) {
        bankInfo.value = data.bankInfo
        beneficiaryInfo.value = data.beneficiaryInfo
        draftInfo.value = data.draftInfo
        lcInfo.value = data.lcInfo
        sealInfo.value = data.sealInfo
        sellerInfo.value = data.sellerInfo
      }
    // } else {
      // router.push('/login')
      // return
    // }
    } catch (error: any) {
      console.error('API 錯誤:', error)
      // await handleApiError(error, fetchDraftInfo, {
      //   messageTitle,
      //   message,
      //   messageStatus,
      //   isConfirmBtn,
      //   messageDialog,
      // })
    } finally {
      loading.value = false
    }
  }

  // 監聽 draftNo 變化，自動重新獲取資料
  watch(
    () => props.draftNo,
    newVal => {
      if (newVal) {
        fetchDraftInfo()
        isSearching.value = true
      }
    },
    { immediate: true },
  )

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
