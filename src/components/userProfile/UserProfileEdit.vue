<template>
  <div>
    <!-- 人員資料編輯 -->
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
            {{ props.editType === 'new' ? '新增' : '編輯' }} 人員資料
          </v-card-title>

          <v-divider />

          <v-card-text class="overflow-y-auto" height="600">
            <p class="hnb__dialog--title">基本設定</p>

            <v-container fluid>
              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-select
                    v-model="formData.companyId"
                    class="hnb__textField--readonly"
                    color="teal-darken-2"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    :items="companyList"
                    label="所屬單位"
                    placeholder="請選擇所屬單位"
                    readonly
                    variant="outlined"
                  />
                </v-col>

                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-select
                    v-model="formData.categoryId"
                    class="hnb__textField--readonly"
                    color="teal-darken-2"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    :items="categoryList"
                    label="類別"
                    placeholder="請選擇類別"
                    readonly
                    variant="outlined"
                  />
                </v-col>

                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-select
                    v-model="formData.userRoleId"
                    class="hnb__textField--required"
                    color="teal-darken-2"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    :items="userRoleList"
                    label="人員角色"
                    placeholder="請選擇人員角色"
                    required
                    :rules="rules.userRoleIdRule"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="pb-0" cols="12">
                  <v-select
                    v-model="formData.notification"
                    chips
                    closable-chips
                    color="teal-darken-2"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    :items="notificationList"
                    label="通知訊息"
                    multiple
                    placeholder="請選擇通知訊息"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-container>

            <p class="hnb__dialog--title">個人資料</p>

            <v-container fluid>
              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.name"
                    :class="[props.editType === 'new' ? 'hnb__textField--required' : 'hnb__textField--readonly']"
                    color="teal-darken-2"
                    density="compact"
                    label="姓名"
                    :readonly="props.editType === 'edit'"
                    :required="props.editType === 'new'"
                    :rules="rules.nameRule"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.title"
                    color="teal-darken-2"
                    density="compact"
                    label="職稱"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.userId"
                    :class="[props.editType === 'new' ? 'hnb__textField--required' : 'hnb__textField--readonly']"
                    color="teal-darken-2"
                    density="compact"
                    label="帳號"
                    :readonly="props.editType === 'edit'"
                    :required="props.editType === 'new'"
                    :rules="rules.userIdRule"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="formData.password"
                    :append-inner-icon="isShow ? 'mdi-eye-off': 'mdi-eye'"
                    autocomplete="new-password"
                    class="hnb__textField--required"
                    color="teal-darken-2"
                    density="compact"
                    label="密碼"
                    readonly
                    :required="props.editType === 'new'"
                    :rules="rules.passwordRule"
                    :type="isShow ? 'text' : 'password'"
                    variant="outlined"
                    @click:append-inner="isShow = !isShow"
                    @focus="$event.target.removeAttribute('readonly')"
                  />
                </v-col>

                <v-col class="pb-0" cols="12" lg="4" md="4">
                  <v-text-field
                    v-model="password2"
                    :append-inner-icon="isShow2 ? 'mdi-eye-off': 'mdi-eye'"
                    autocomplete="new-password"
                    class="hnb__textField--required"
                    color="teal-darken-2"
                    density="compact"
                    label="密碼確認"
                    readonly
                    :required="props.editType === 'new'"
                    :rules="rules.passwordConfirmRule"
                    :type="isShow2 ? 'text' : 'password'"
                    variant="outlined"
                    @click:append-inner="isShow2 = !isShow2"
                    @focus="$event.target.removeAttribute('readonly')"
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
                    v-model="formData.mobile"
                    class="hnb__textField--required"
                    color="teal-darken-2"
                    density="compact"
                    label="行動電話"
                    required
                    :rules="rules.mobileRule"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="pb-0" cols="12" lg="6" md="6">
                  <v-text-field
                    v-model="formData.email"
                    class="hnb__textField--required"
                    color="teal-darken-2"
                    density="compact"
                    label="電子信箱"
                    required
                    :rules="rules.emailRule"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col class="pb-0 text-no-wrap" cols="12" lg="4" md="4">
                  <span>設定使用者憑證</span>

                  <v-btn
                    class="text-white ms-3"
                    color="light-blue-darken-1"
                    variant="flat"
                    @click.prevent="SetCertificate"
                  >
                    設定憑證
                  </v-btn>
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
  import { storeToRefs } from 'pinia'
  import { onMounted, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { VForm } from 'vuetify/components'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { notificationList } from '@/plugins/menu'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface DataItem {
    userId?: string
    name?: string
    phone?: string // 電話
    fax?: string // 傳真
    mobile?: string // 行動電話
    email?: string // 電子信箱
    title?: string // 職稱
    status?: boolean // 狀態
    password?: string // 密碼
    companyId?: string // 所屬單位 ID
    companyName?: string // 所屬單位
    categoryId?: string // 類別 ID
    userRoleId?: string // 人員角色 ID
    userRole?: string // 人員角色
    categoryName?: string // 類別
    notification?: string[] // 通知選項
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
  const password2 = ref<string | null>(null)
  const isShow = ref<boolean>(false)
  const isShow2 = ref<boolean>(false)

  interface Rules {
    companyRule: ((v: string) => boolean | string)[]
    userRoleIdRule: ((v: string) => boolean | string)[]
    categoryRule: ((v: string) => boolean | string)[]
    nameRule: ((v: string) => boolean | string)[]
    userIdRule: ((v: string) => boolean | string)[]
    passwordRule: ((v: string) => boolean | string)[]
    passwordConfirmRule: ((v: string) => boolean | string)[]
    emailRule: ((v: string) => boolean | string)[]
    mobileRule: ((v: string) => boolean | string)[]

  }
  const rules: Rules = {
    companyRule: [v => props.editType === 'edit' || !!v || '請選擇所屬單位'],
    userRoleIdRule: [v => !!v || '請選擇人員角色'],
    categoryRule: [v => !!v || '請選擇類別'],
    nameRule: [v => props.editType === 'edit' || !!v || '請輸入姓名'],
    userIdRule: [v => props.editType === 'edit' || !!v || '請輸入帳號'],
    passwordRule: [v => props.editType === 'new' ? (!!v || '請輸入密碼') : true],
    passwordConfirmRule: [
      v => props.editType === 'new' ? (!!v || '請輸入密碼確認') : true,
      v => !v || v === formData.password || '密碼確認不一致',
    ],
    mobileRule: [v => !!v || '請輸入行動電話'],
    emailRule: [
      v => !!v || '請輸入電子信箱',
      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || '電子信箱格式不正確'],
  }

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
  interface ApiResponse {
    code: number
    message: string
    data?: any
  }

  // 儲存表單
  async function onSave (): Promise<void> {
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
    const payload = {
      ...formData,
    }
    loading.value = true
    const apiUrl = props.editType === 'new' ? '/api/userProfile/add' : '/api/userProfile/edit'
    try {
      if (userInfo.value.token) {
        const res = await api.post<ApiResponse>(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { message: resMessage } = data

        console.log('API 回應:', { status, message: resMessage, payload })
        if (status === 200) {
          emits('on-save')
          show.value = false
          messageTitle.value = '訊息通知'
          message.value = resMessage
          messageStatus.value = 'success'
          isConfirmBtn.value = false
          messageDialog.value = true
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, onSave, {
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

  // 設定使用者憑證
  function SetCertificate (): void {
    messageTitle.value = '訊息通知'
    message.value = '設定使用者憑證功能尚未實作' // 這裡可以替換成實際的功能
    messageStatus.value = 'info'
    isConfirmBtn.value = false
    messageDialog.value = true
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

  // 獲取類別列表
  const categoryList = ref<{ title: string, value: string }[]>([])
  async function fetchCategoryList (): Promise<void> {
    loading.value = true
    const apiUrl = '/api/category/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: apiData, message: apiMessage } = data

        console.log('API 回應:', { apiData, apiMessage })
        // 更新表單數據
        if (status === 200) {
          categoryList.value = apiData.map((item: { categoryId: string, categoryName: string }) => ({
            title: item.categoryName,
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

  // 獲取角色列表
  const userRoleList = ref<{ title: string, value: string }[]>([])
  async function fetchRuleList (): Promise<void> {
    loading.value = true
    const apiUrl = '/api/userRole/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: apiData, message: apiMessage } = data

        console.log('API 回應:', { status, apiData, apiMessage })
        // 更新表單數據
        if (status === 200) {
          userRoleList.value = apiData.map((item: { roleId: string, roleName: string }) => ({
            title: item.roleName,
            value: item.roleId,
          }))
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchRuleList, {
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

  // 獲取公司列表
  const companyList = ref<{ title: string, value: string }[]>([])
  async function fetchOrganizationInfoList (): Promise<void> {
    // 查全部
    loading.value = true
    const apiUrl = '/api/organizationInfo/list'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, {}, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: apiData, message: apiMessage } = data

        console.log('API 回應:', { status, apiData, apiMessage })
        // 更新表單數據
        if (status === 200) {
          companyList.value = apiData.map((item: { companyId: string, companyName: string }) => ({
            title: item.companyName,
            value: item.companyId,
          }))
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, fetchOrganizationInfoList, {
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

  onMounted(() => {
    Promise.all([
      fetchCategoryList(),
      fetchRuleList(),
      fetchOrganizationInfoList(),
    ])
  })
</script>
