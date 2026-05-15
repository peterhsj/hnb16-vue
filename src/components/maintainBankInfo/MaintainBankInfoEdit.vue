<template>
  <div>
    <!-- 銀行資料編輯 -->
    <v-form ref="editFormRef" @submit.prevent="onSave">
      <v-dialog
        v-model="show"
        max-width="920"
        min-width="400"
        persistent
        scrollable
      >
        <v-card>
          <v-card-title class="px-6 py-3 bg-blue-darken-1">
            {{ props.editType === 'new' ? '新增' : '編輯' }} 銀行資料
          </v-card-title>

          <v-divider />

          <v-card-text class="overflow-y-auto" height="600">
            <v-container fluid>
              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.bankId"
                    :class="[props.editType === 'new' ? 'hnb__textField--required' : 'hnb__textField--readonly']"
                    color="teal-darken-2"
                    density="compact"
                    label="銀行代碼"
                    :readonly="props.editType === 'edit'"
                    :required="props.editType === 'new'"
                    :rules="[v => props.editType === 'edit' || !!v || '銀行代碼為必填']"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="pb-0" cols="12" lg="6" md="6">
                  <v-text-field
                    v-model="formData.bankName"
                    class="hnb__textField--required"
                    color="teal-darken-2"
                    density="compact"
                    label="銀行名稱"
                    required
                    :rules="[v => !!v || '銀行名稱為必填']"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider />

          <v-card-actions class="py-4 px-6">
            <v-spacer />

            <v-btn
              class="text-white"
              color="blue-grey-lighten-3"
              variant="flat"
              @click="onClose"
            >
              取消
            </v-btn>

            <v-btn
              color="light-blue-darken-2"
              variant="flat"
              @click.prevent="onSave"
            >
              儲存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
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
  import { reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import { api } from '@/api/axios'

  interface DataItem {
    bankId?: string // 銀行代碼
    bankName?: string // 銀行名稱
    status?: boolean // 狀態
  }
  interface Props {
    editDialog?: boolean
    editType?: string
    data?: DataItem
  }
  const props = withDefaults(defineProps<Props>(), {
    editDialog: false,
    editType: 'new',
    data: Object as () => DataItem,
  })

  const show = ref<boolean>(props.editDialog)
  watch(
    () => props.editDialog,
    newValue => {
      show.value = newValue
      console.log('editDialog 變化:', newValue)
    })
  watch(
    () => show.value,
    newValue => {
      emits('update:editDialog', newValue)
    })

  const emits = defineEmits<{
    'update:editDialog': [boolean]
    'on-close': []
    'on-save': []
  }>()

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const editFormRef = ref<InstanceType<typeof VForm> | null>(null)

  const formData = reactive<DataItem>({ ...props.data })
  const invoiceStampFile = ref<File | null>(null)
  const companyLogoFile = ref<File | null>(null)

  // 監聽 formData 變化，當有查詢條件時重新載入資料
  watch(
    () => props.data,
    newValue => {
      // 檢查是否有任何查詢條件
      const hasSearchCriteria = Object.keys(newValue || {}).length > 0
      if (hasSearchCriteria) {
        Object.assign(formData, newValue as DataItem)
      }
    },
    { deep: true })

  const loading = ref<boolean>(false)

  // 上傳發票章
  async function uploadInvoiceStamp (): Promise<void> {
    if (!invoiceStampFile.value) return
    // 在此處實現上傳發票章的邏輯，例如呼叫 API 上傳檔案
    console.log('上傳發票章檔案:', invoiceStampFile.value)
  }

  // 上傳公司LOGO
  async function uploadCompanyLogo (): Promise<void> {
    if (!companyLogoFile.value) return
    // 在此處實現上傳公司LOGO的邏輯，例如呼叫 API 上傳檔案
    console.log('上傳公司LOGO檔案:', companyLogoFile.value)
  }

  // 儲存表單
  async function onSave (): Promise<void> {
    // 驗證表單
    const { valid } = await editFormRef.value!.validate()
    if (!valid) {
      messageTitle.value = '訊息通知'
      message.value = `表單驗證失敗`
      messageStatus.value = 'alert'
      isConfirmBtn.value = false
      messageDialog.value = true
      return
    }

    console.log('儲存表單資料:', formData)
    // const payload = {
    //   ...formData,
    // }
    // loading.value = true
    // const apiUrl = props.editType === 'new' ? '/api/organizationInfo/create' : '/api/organizationInfo/update'
    // try {
    //   // 使用 axios POST 請求
    //   const res = await api.post(apiUrl, payload)
    //   const { code, message } = res.data

    //   console.log('API 回應:', { code, message, payload })
    //   if (code === 200) {
    //     emits('on-save')
    //     show.value = false
    //   }
    // } catch (error) {
    //   console.error('API 請求失敗:', error)
    // } finally {
    //   loading.value = false
    // }
    emits('on-save')
    show.value = false
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
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
