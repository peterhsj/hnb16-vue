<template>
  <v-container class="hnb__login--wrapper" fluid>
    <v-row align="stretch" class="fill-height my-0">
      <v-col class="hnb__login--panel flex-column align-center justify-center">
        <div class="hnb__header mb-5">
          <div class="hnb__header--kicker">
            <v-img
              alt="HNB 華南銀行 Logo"
              class="d-inline-flex mr-2"
              :src="logoPng"
              width="200"
            />
          </div>

          <h2 class="hnb__header--title text-cyan-darken-3 text-center">國內信用狀系統</h2>
        </div>

        <v-sheet class="hnb__login--card" elevation="3">
          <v-form ref="loginFormRef" class="hnb__login--form" @submit.prevent="handleLogin">

            <v-text-field
              v-model="loginForm.userId"
              autocomplete="new-account"
              color="blue-darken-1"
              label="帳號"
              prepend-inner-icon="mdi-account"
              readonly
              required
              :rules="rules.userId"
              variant="outlined"
              @focus="$event.target.removeAttribute('readonly')"
            />

            <v-text-field
              v-model="loginForm.password"
              :append-inner-icon="isShowText ? 'mdi-eye-off': 'mdi-eye'"
              autocomplete="new-password"
              color="blue-darken-1"
              label="密碼"
              prepend-inner-icon="mdi-lock"
              readonly
              required
              :rules="rules.password"
              :type="isShowText ? 'text' : 'password'"
              variant="outlined"
              @click:append-inner="isShowText = !isShowText"
              @focus="$event.target.removeAttribute('readonly')"
            />

            <v-btn
              block
              class="hnb__login--button mt-0"
              :disabled="loading"
              size="large"
              type="submit"
            >
              登入
            </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>

    <CommonOverlay :overlay="loading" />

    <PromptDialog
      v-model:message-dialog="messageDialog"
      :dialog-width="messageWidth"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />
  </v-container>
</template>

<route lang="json">
{
  "meta": {
    "layout": "auth"
  }
}
</route>

<script setup lang="ts">
  import type { AuthType } from '@/composables/useMenu'
  import type { FormData } from '@/types/useLogin'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { VForm } from 'vuetify/components'
  import logoPng from '@/assets/images/logo-hncb.png'
  import { useAuthStore } from '@/stores/authStore'

  const router = useRouter()
  const authStore = useAuthStore()
  const loading = ref<boolean>(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageWidth = ref<string>('auto')
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  const loginFormRef = ref<InstanceType<typeof VForm> | null>(null)

  const loginForm = ref<FormData>({
    auth: 'BH',
    userId: '',
    password: '',
  })
  const isShowText = ref<boolean>(false)

  interface Rules {
    userId: ((v: string) => boolean | string)[]
    password: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    userId: [v => !!v || '請輸入帳號'],
    password: [v => !!v || '請輸入密碼'],
  }

  // 登入
  async function handleLogin (): Promise<void> {
    // 檢核欄位
    const { valid } = await loginFormRef.value?.validate() || { valid: false }
    if (!valid) return

    const { userId, password } = loginForm.value
    const payload: FormData = { userId, password }
    loading.value = true
    try {
      await authStore.login(payload)
      authStore.setAuthType(loginForm.value.auth as AuthType)
      router.push('/')
    } catch (error: any) {
      const errorMsg = error?.message || ''
      message.value = errorMsg.includes('401') ? '帳號或密碼錯誤，請確認後再輸入。' : '無法連接到伺服器，請稍後再試。'
      messageTitle.value = '登入失敗'
      messageStatus.value = 'alert'
      messageWidth.value = '500px'
      isConfirmBtn.value = false
      messageDialog.value = true
    } finally {
      loading.value = false
    }
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

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600&family=Playfair+Display:wght@600&display=swap');
</style>
