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
          編輯角色資訊
        </v-card-title>
        <v-card-text class="d-flex align-center">
          <v-row class="mt-5">
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="editForm.roleName"
                clearable
                color="teal-darken-2"
                density="compact"
                label="角色名稱"
                placeholder="請輸入角色名稱"
                required
                :rules="rules.roleNameRule"
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
  }
  const props = withDefaults(defineProps<Props>(), {
    editDialog: false,
  })

  const emits = defineEmits<{
    'update:editDialog': [boolean]
    'on-close': []
    'on-save': []
  }>()

  const show = ref<boolean>(props.editDialog)
  watch(
    () => props.editDialog,
    newVal => {
      show.value = newVal
      // 對話框打開時，更新表單值
      if (newVal) {
        show.value = newVal
      }
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:editDialog', newVal)
    },
  )

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const loading = ref<boolean>(false)

  const editFormRef = ref<InstanceType<typeof VForm>>()

  interface EditItem {
    roleName: string
  }
  const editForm = ref<EditItem>({
    roleName: '',
  })

  interface Rules {
    roleNameRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    roleNameRule: [v => !!v || '請填寫角色名稱'],
  }

  interface ApiResponse<T = any> {
    code: number
    message?: string
    data?: T
  }

  // 儲存編輯後的資料
  async function saveData (): Promise<void> {
    const { valid } = await editFormRef.value?.validate() || { valid: false }
    if (!valid) return

    const payload = {
      roleName: editForm.value.roleName,
    }
    console.log('儲存編輯後的資料', payload)
    loading.value = true

    const apiUrl = '/api/userRole/add'
    try {
      if (userInfo.value.token) {
        const res = await api.post<ApiResponse>(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${userInfo.value.token}`,
          },
        })
        const { status, data } = res
        const { data: responseData } = data

        console.log('API 回應:', { status, responseData })
        // 更新表格數據
        if (status === 200) {
          // 儲存成功，關閉對話框並通知父組件
          show.value = false
          emits('on-save')
          emits('on-close')
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
    emits('on-close')
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }
</script>
