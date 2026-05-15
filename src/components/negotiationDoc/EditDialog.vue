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
      <v-form ref="editFormRef" @submit.prevent="saveData">
        <v-card-title class="px-6 text-subtitle-1 bg-blue-darken-2">
          編輯匯票資訊
        </v-card-title>

        <v-card-text class="d-flex align-center">
          <v-row class="mt-5">
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="editForm.draftNo"
                clearable
                color="teal-darken-2"
                density="compact"
                label="匯票號碼"
                placeholder="請輸入匯票號碼"
                required
                :rules="rules.draftNoRule"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
            >
              <v-date-input
                v-model="editForm.draftDueDate"
                append-inner-icon="fa:far fa-calendar-alt"
                bg-color="white"
                color="blue-darken-2"
                density="compact"
                label="匯票到期日"
                placeholder="範例：2026/01/01"
                prepend-icon=""
                required
                :rules="rules.draftDueDateRule"
                variant="outlined"
              />
            </v-col>
          </v-row>
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
            type="submit"
            variant="flat"
          >
            儲存
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
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
</template>
<script setup lang="ts">
  import { format } from 'date-fns'
  import { storeToRefs } from 'pinia'
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { VForm } from 'vuetify/components'
  import { api } from '@/api/axios'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const router = useRouter()
  const { handleApiError } = useApiErrorHandler()

  interface Props {
    editDialog?: boolean
    // draftNo?: string
    payload?: {
      id: string
      draftNo: string
      draftDueDate: string
    }
    // draftDueDate?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    editDialog: false,
  })

  const show = ref<boolean>(props.editDialog)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  interface EditItem {
    id: string
    draftNo: string
    draftDueDate: string // 匯票到期日
  }
  watch(
    () => props.editDialog,
    newVal => {
      show.value = newVal
      // 對話框打開時，更新表單值
      if (newVal) {
        editForm.value = { ...props.payload } as EditItem
        // 重置表單驗證狀態
        editFormRef.value?.resetValidation()
      }
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:editDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:editDialog': [boolean]
    'on-close': []
    'on-save': []
  }>()

  const loading = ref<boolean>(false)
  const editFormRef = ref<InstanceType<typeof VForm>>()
  const editForm = ref<EditItem>({ ...props.payload } as EditItem)

  interface Rules {
    draftNoRule: ((v: string) => boolean | string)[]
    draftDueDateRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    draftNoRule: [v => !!v || '請填寫匯票號碼'],
    draftDueDateRule: [v => !!v || '請填寫匯票到期日'],
  }

  // 儲存編輯後的資料
  async function saveData (): Promise<void> {
    const { valid } = await editFormRef.value?.validate() || { valid: false }
    if (!valid) return

    const { id, draftNo, draftDueDate } = editForm.value
    const payload = {
      id,
      draftNo,
      draftDueDate: format(new Date(draftDueDate), 'yyyy/MM/dd'),
    }
    console.log('儲存編輯後的資料', payload)
    loading.value = true

    const apiUrl = '/api/negotiationDoc/update'
    try {
      if (userInfo.value.token) {
        const res = await api.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: apiData, message: apiMessage } = data

        console.log('API 回應:', { apiData, apiMessage })
        // 更新表格數據
        if (status === 200) {
          emit('on-save')
          emit('on-close')
          show.value = false
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, saveData, {
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
    processStatus.value = ''
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
