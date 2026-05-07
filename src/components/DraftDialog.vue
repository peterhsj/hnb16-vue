<template>
  <v-dialog
    v-model="show"
    persistent
    scrollable
    width="auto"
  >
    <v-card
      min-width="600"
      width="800"
    >
      <v-card-title class="px-6 text-subtitle-1 bg-blue-darken-2">
        匯票資訊
      </v-card-title>
      <v-card-text
        class="d-flex align-start"
        style="max-height: 70vh; overflow-y: auto;"
      >
        <!-- 無資料時顯示 -->
        <v-card v-if="!loading && !draftInfo" class="mx-auto my-3" color="grey-lighten-4" flat>
          <v-card-text class="text-center py-12">
            <v-icon color="grey-lighten-1" icon="mdi-file-document-alert-outline" size="64" />
            <p class="text-h6 text-orange-darken-2 mt-4">尚無資料</p>
          </v-card-text>
        </v-card>
        <v-container v-else class="pa-0 hnb__print" fluid>
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
                  <v-card-text>
                    <DraftFront v-if="currentTab === 'draftFront'" />
                    <DraftBack v-if="currentTab === 'draftBack'" />
                    <DraftApplication v-if="currentTab === 'draftApplication'" />
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card>
          <InvoiceList />
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
      @prompt-confirm="messageConfirm"
    />
  </v-dialog>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface Props {
    draftDialog?: boolean
    draftId?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    draftDialog: false,
    draftId: '',
  })

  const show = ref<boolean>(props.draftDialog)
  watch(
    () => props.draftDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:draftDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:draftDialog': [boolean]
    'on-close': []
  }>()

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
    fetchDraftInfo()
  })

  const draftInfo = ref<any>(null)

  // 取得匯票資訊
  async function fetchDraftInfo (): Promise<void> {
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
        const { status, data } = res
        const { data: apiData } = data
        // console.log('API 回應:', { code, data })
        // 更新表格數據
        if (status === 200) {
          draftInfo.value = apiData
          console.log('匯票資訊:', draftInfo.value)
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

  function onClose (): void {
    show.value = false
    emit('on-close')
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>

<style scoped>
@media print {
  /* 隱藏對話框背景和其他元素 */
  :deep(.v-overlay__scrim),
  :deep(.v-dialog) {
    position: static !important;
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    box-shadow: none !important;
  }

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

  /* 隱藏 tabs-window 的容器 */
  :deep(.v-tabs-window) {
    display: none !important;
  }
}
</style>
