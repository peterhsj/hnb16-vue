<template>
  <div>
    <!-- 會員資料編輯 -->
    <v-form ref="editFormRef">
      <v-dialog
        v-model="show"
        max-width="920"
        min-width="400"
        persistent
        scrollable
      >
        <v-card>
          <v-card-title class="px-6 py-3 bg-blue-darken-1">
            {{ props.editType === 'new' ? '新增' : '編輯' }} 會員-公司資料
          </v-card-title>
          <v-divider />
          <v-card-text class="overflow-y-auto" height="600">
            <p class="hnb__dialog--title">公司基本資料</p>
            <v-container fluid>
              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.receiptNo"
                    :class="[props.editType === 'new' ? 'hnb__textField--required' : 'hnb__textField--readonly']"
                    color="teal-darken-2"
                    density="compact"
                    label="統一編號"
                    :readonly="props.editType === 'edit'"
                    :required="props.editType === 'new'"
                    :rules="[v => props.editType === 'edit' || !!v || '統一編號為必填']"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-select
                    v-model="formData.categoryId"
                    :class="[props.editType === 'new' ? 'hnb__textField--required' : 'hnb__textField--readonly']"
                    color="teal-darken-2"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    :items="categoryList"
                    label="類別"
                    placeholder="請選擇類別"
                    :readonly="props.editType === 'edit'"
                    :required="props.editType === 'new'"
                    :rules="[v => props.editType === 'edit' || !!v || '類別為必填']"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12" lg="6" md="6">
                  <v-text-field
                    v-model="formData.companyName"
                    :class="[props.editType === 'new' ? 'hnb__textField--required' : 'hnb__textField--readonly']"
                    color="teal-darken-2"
                    density="compact"
                    label="公司名稱"
                    :readonly="props.editType === 'edit'"
                    :required="props.editType === 'new'"
                    :rules="[v => props.editType === 'edit' || !!v || '公司名稱為必填']"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="6" md="6">
                  <v-text-field
                    v-model="formData.companyNameEn"
                    color="teal-darken-2"
                    density="compact"
                    label="公司英文名稱"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    v-model="formData.address"
                    class="hnb__textField--required"
                    color="teal-darken-2"
                    density="compact"
                    label="地址"
                    required
                    :rules="[v => !!v || '地址為必填']"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    v-model="formData.addressEn"
                    color="teal-darken-2"
                    density="compact"
                    label="英文地址"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    v-model="formData.registeredAddress"
                    color="teal-darken-2"
                    density="compact"
                    hint="( 若異於地址欄才需填 )"
                    label="註冊地址"
                    persistent-hint
                    variant="outlined"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.phone"
                    color="teal-darken-2"
                    density="compact"
                    label="電話"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.fax"
                    color="teal-darken-2"
                    density="compact"
                    label="傳真"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.principalName"
                    color="teal-darken-2"
                    density="compact"
                    label="負責人姓名"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.principalPhone"
                    color="teal-darken-2"
                    density="compact"
                    label="負責人電話"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-container>
            <p class="hnb__dialog--title">公司聯絡人資料</p>
            <v-container fluid>
              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.contactName"
                    color="teal-darken-2"
                    density="compact"
                    label="聯絡人姓名"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.contactPhone"
                    color="teal-darken-2"
                    density="compact"
                    label="聯絡人電話"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.contactFax"
                    color="teal-darken-2"
                    density="compact"
                    label="聯絡人傳真"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="6" md="6">
                  <v-text-field
                    v-model="formData.contactMobile"
                    color="teal-darken-2"
                    density="compact"
                    label="聯絡人行動電話"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" lg="6" md="6">
                  <v-text-field
                    v-model="formData.contactEmail"
                    color="teal-darken-2"
                    density="compact"
                    label="聯絡人電子信箱"
                    :rules="[
                      v => !v || /.+@.+\..+/.test(v) || '請輸入有效的電子信箱',
                    ]"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-container>
            <p class="hnb__dialog--title">其他資料</p>
            <v-container fluid>
              <!-- <v-row>
                <v-col cols="12">
                  <v-switch
                    v-model="formData.useInvoiceInterestCalculation"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    label="使用發票利息試算"
                    variant="outlined"
                  />
                </v-col>
              </v-row> -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-card
                    class="mx-auto mb-4 hnb__stamp-card"
                    flat
                    variant="outlined"
                  >
                    <v-card-item class="pa-0">
                      <v-card-title class="text-center text-subtitle-1 bg-teal-lighten-3 py-2">
                        目前的發票章圖檔
                      </v-card-title>
                    </v-card-item>

                    <v-card-text class="py-0 d-flex align-center">
                      <v-row>
                        <v-col
                          v-if="!formData.invoiceStamp"
                          class="text-center"
                          cols="12"
                        >
                          <p class="text-subtitle-1 text-teal-darken-2">
                            尚未上傳發票章圖檔
                          </p>
                        </v-col>
                        <v-col
                          v-else
                          cols="12"
                        >
                          <v-img
                            aspect-ratio="1"
                            contain
                            max-height="150px"
                            :src="formData.invoiceStamp"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-row class="align-start">
                    <v-col cols="12" md="9">
                      <v-file-input
                        v-model="invoiceStampFile"
                        accept="image/*"
                        clearable
                        color="teal-darken-2"
                        density="compact"
                        hide-details="auto"
                        hint="檔案大小不能超過 15 KB"
                        label="發票章圖檔"
                        persistent-hint
                        prepend-icon="mdi-file-image"
                        :rules="[v => !v || v.size < 15360 || '檔案大小不能超過 15 KB']"
                        show-size
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-btn
                        block
                        color="teal-darken-2"
                        :disabled="!invoiceStampFile"
                        height="40"
                        @click="uploadInvoiceStamp"
                      >
                        上傳
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card
                    class="mx-auto mb-4 hnb__stamp-card"
                    flat
                    variant="outlined"
                  >
                    <v-card-item class="pa-0">
                      <v-card-title class="text-center text-subtitle-1 bg-teal-lighten-3 py-2">
                        目前的公司LOGO圖檔
                      </v-card-title>
                    </v-card-item>

                    <v-card-text class="py-0 d-flex align-center">
                      <v-row>
                        <v-col
                          v-if="!formData.companyLogo"
                          class="text-center"
                          cols="12"
                        >
                          <p class="text-subtitle-1 text-teal-darken-2">
                            尚未上傳公司LOGO圖檔
                          </p>
                        </v-col>
                        <v-col
                          v-else
                          cols="12"
                        >
                          <v-img
                            aspect-ratio="1"
                            contain
                            max-height="60px"
                            :src="formData.companyLogo"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-row class="align-start">
                    <v-col cols="12" md="9">
                      <v-file-input
                        v-model="companyLogoFile"
                        accept="image/*"
                        clearable
                        color="teal-darken-2"
                        density="compact"
                        hide-details="auto"
                        hint="檔案大小為 120*60 像素且不能超過 15 KB"
                        label="公司LOGO圖檔"
                        persistent-hint
                        prepend-icon="mdi-file-image"
                        :rules="[v => !v || v.size < 15360 || '檔案大小不能超過 15 KB']"
                        show-size
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-btn
                        block
                        color="teal-darken-2"
                        :disabled="!companyLogoFile"
                        height="40"
                        @click="uploadCompanyLogo"
                      >
                        上傳
                      </v-btn>
                    </v-col>
                  </v-row>
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
              @click.prevent="saveOrganizationInfo"
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
  import { storeToRefs } from 'pinia'
  import { reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { VForm } from 'vuetify/components'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface DataItem {
    companyId?: number // 公司 ID
    companyName?: string // 公司名稱
    companyNameEn?: string // 公司英文名稱
    receiptNo?: string // 統一編號
    address?: string // 地址
    addressEn?: string // 英文地址
    registeredAddress?: string // 註冊地址
    registeredAddressEn?: string // 英文註冊地址
    phone?: string // 電話
    fax?: string // 傳真
    principalName?: string // 負責人姓名
    principalPhone?: string // 負責人電話
    contactName?: string // 聯絡人姓名
    contactPhone?: string // 聯絡人電話
    contactFax?: string // 聯絡人傳真
    contactMobile?: string // 聯絡人行動電話
    contactEmail?: string // 聯絡人電子信箱
    invoiceStamp?: string // 發票章
    companyLogo?: string // 公司LOGO圖片
    categoryId?: number // 類別 ID
    categoryName?: string // 類別
    status?: number // 狀態
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

  interface ApiResponse<T = any> {
    code: number
    message?: string
    data?: T
    total?: number
  }

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

  // 儲存會員資料（新增或編輯）
  async function saveOrganizationInfo (): Promise<void> {
    // 驗證表單
    const { valid } = await editFormRef.value!.validate()
    if (!valid) {
      messageTitle.value = '訊息通知'
      message.value = `資料填寫不完整，請再檢查一次`
      messageStatus.value = 'alert'
      isConfirmBtn.value = false
      messageDialog.value = true
      return
    }

    console.log('儲存表單資料:', formData)
    const {
      companyId,
      companyName,
      companyNameEn,
      receiptNo,
      address,
      addressEn,
      registeredAddress,
      registeredAddressEn,
      phone,
      fax,
      principalName,
      principalPhone,
      contactName,
      contactPhone,
      contactFax,
      contactMobile,
      contactEmail,
      invoiceStamp,
      companyLogo,
      categoryId,
    } = formData
    const payload = {
      companyName,
      companyNameEn,
      receiptNo,
      address,
      addressEn,
      registeredAddress,
      registeredAddressEn,
      phone,
      fax,
      principalName,
      principalPhone,
      contactName,
      contactPhone,
      contactFax,
      contactMobile,
      contactEmail,
      invoiceStamp,
      companyLogo,
      categoryId,
    }
    loading.value = true
    const apiUrl = props.editType === 'new' ? '/api/organizationInfo/add' : `/api/organizationInfo/edit/${companyId}`
    try {
      if (userInfo.value.token) {
        const res = await api.post<ApiResponse>(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { message: resMessage } = data
        console.log('API 回應:', { message: resMessage })
        if (status === 200) {
          emits('on-save')
          show.value = false
          messageTitle.value = '訊息通知'
          message.value = resMessage || '儲存成功'
          messageStatus.value = 'success'
          isConfirmBtn.value = false
          messageDialog.value = true
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, saveOrganizationInfo, {
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

  interface ApiResponse<T = any> {
    code: number
    message?: string
    data?: T
  }

  // 取得類別列表
  const categoryList = ref<{ title: string, value: string }[]>([])
  async function fetchCategoryList (): Promise<void> {
    loading.value = true
    const apiUrl = '/api/category/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post<ApiResponse>(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: categoryData } = data
        // 更新表格數據
        if (status === 200) {
          categoryList.value = categoryData.map((item: { categoryId: string, category: string }) => ({
            title: item.category,
            value: item.categoryId,
          }))
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchCategoryList, {
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

  onMounted(async () => {
    await fetchCategoryList()
  })
</script>
