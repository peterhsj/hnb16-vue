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
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'

  interface Props {
    data: any
    isShowDeposit?: boolean
    isShowTable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isShowDeposit: false,
    isShowTable: false,
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
  const draftInfo = ref<DraftInfo | null>(null)

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
</script>
