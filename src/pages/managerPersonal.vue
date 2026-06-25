<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <!-- 個人設定 -->
      <div class="mt-4 mx-4">
        <h2 class="hnb16__title">
          個人設定
        </h2>

        <p class="mb-2">
          <span class="text-teal-darken-2">
            註：密碼如無修改請空白
          </span>
        </p>

        <v-card class="border-sm pa-4 pt-2 bg-grey-lighten-4" variant="outlined">
          <v-form ref="formRef">
            <div class="pt-4">
              <v-row class="align-center">
                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">角色選擇</div>
                  <span>分行管理員</span>
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">所屬分行</div>
                  <span>高雄分行</span>
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">用戶帳號</div>
                  <span>hn7007</span>
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">用戶姓名</div>

                  <v-text-field
                    v-model="form.userName"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">用戶密碼</div>

                  <v-text-field
                    v-model="form.password"
                    :append-inner-icon="isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    :type="isShowPass ? 'text' : 'password'"
                    variant="outlined"
                    @click:append-inner="isShowPass = !isShowPass"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">密碼修改</div>

                  <v-text-field
                    v-model="form.newPassword"
                    :append-inner-icon="isShowNewPass ? 'mdi-eye' : 'mdi-eye-off'"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    :type="isShowNewPass ? 'text' : 'password'"
                    variant="outlined"
                    @click:append-inner="isShowNewPass = !isShowNewPass"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">密碼確認</div>

                  <v-text-field
                    v-model="form.confirmPassword"
                    :append-inner-icon="isShowConfirmPass ? 'mdi-eye' : 'mdi-eye-off'"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    :rules="rules.confirmPassword"
                    :type="isShowConfirmPass ? 'text' : 'password'"
                    variant="outlined"
                    @click:append-inner="isShowConfirmPass = !isShowConfirmPass"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">電子郵件</div>

                  <v-text-field
                    v-model="form.email"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">連絡電話</div>

                  <v-text-field
                    v-model="form.phone"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">作業群組</div>

                  <v-data-table
                    class="table-sm hnb__table bg-white w-90"
                    color="blue-darken-2"
                    density="compact"
                    :headers="tableHeaders"
                    hide-default-footer
                    item-value="senNo"
                    :items="tableItems"
                    :loading="isLoading"
                  >
                    <template #item.isApp="{ item }">
                      <v-chip
                        v-if="item.isApp"
                        class="ma-0 font-weight-bold"
                        :color="item.isApp ? 'green' : 'red'"
                        size="small"
                      >
                        {{ item.isApp ? 'V' : '-' }}
                      </v-chip>
                    </template>

                    <template #item.isNotify="{ item }">
                      <v-chip
                        v-if="item.isNotify"
                        class="ma-0 font-weight-bold"
                        :color="item.isNotify ? 'green' : 'red'"
                        size="small"
                      >
                        {{ item.isNotify ? 'V' : '-' }}
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">權限</div>
                  <span>主要審核者</span>
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">代理者帳號</div>
                  <span>CCXXK</span>
                </v-col>

                <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
                  <div class="font-weight-medium text-no-wrap hnb__form-label w-10">啟動代理</div>
                  <span>Yes</span>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card>

        <v-row class="my-2">
          <v-col class="d-flex justify-center" cols="12">
            <v-btn
              class="hnb__btn--cancel mx-1"
              @click="resetForm"
            >
              重設
            </v-btn>

            <v-btn
              class="hnb__btn--default mx-1"
              @click="sendForm"
            >
              確定
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :dialog-width="400"
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
  import type { ListItem } from '@/types/managerPersonal'
  import type { DataTableHeader } from 'vuetify'
  import { onMounted, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { getDatacList } from '@/api/managerPersonal'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

  const { handleApiError } = useApiErrorHandler()

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '會員管理作業' },
    { title: '個人設定', disabled: true },
  ]

  const form = reactive({
    userName: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    email: '',
    phone: '',
  })
  const formRef = ref<InstanceType<typeof VForm>>()
  const isShowPass = ref(false)
  const isShowNewPass = ref(false)
  const isShowConfirmPass = ref(false)
  // const searchFormRef = ref<InstanceType<typeof VForm>>()
  const userId = ref<string>('')
  const tableItems = ref<ListItem[]>([])
  const isLoading = ref(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const tableHeaders: DataTableHeader[] = [
    // { title: '編號', key: 'senNo', align: 'center', sortable: false, nowrap: true, width: 80 },
    { title: '分行', key: 'branch', align: 'center', sortable: false, nowrap: true },
    { title: '開狀', key: 'isApp', align: 'center', sortable: false, nowrap: true },
    { title: '通知', key: 'isNotify', align: 'center', sortable: false, nowrap: true },
    { title: '審核群組', key: 'reviewGroup', align: 'center', sortable: false, nowrap: true },
  ]
  const rules = {
    confirmPassword: [
      (v: string) => v === '' || v === form.newPassword || '密碼確認不一致',
    ],
  }

  // 取得列表資料
  async function fetchDataList () {
    const payload = {
      userId: userId.value,
    }
    console.log('Fetching list with payload:', payload)
    isLoading.value = true
    try {
      const res = await getDatacList(payload)
      console.log('API response:', res)
      const { status, data: { items: sourceData } } = res
      if (status === 200) {
        tableItems.value = sourceData || []
      }
    } catch (error: any) {
      await handleApiError(error, fetchDataList, {
        messageTitle,
        message,
        messageStatus,
        isConfirmBtn,
        messageDialog,
      })
    } finally {
      isLoading.value = false
    }
  }

  function resetForm (): void {
    formRef.value?.reset()
  }

  function sendForm (): void {
    console.log('送出表單', form)
    messageDialog.value = true
    messageTitle.value = '作業訊息'
    message.value = '作業已完成'
    messageStatus.value = 'success'
    isConfirmBtn.value = false
  }

  onMounted(() => {
    fetchDataList()
  })

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
