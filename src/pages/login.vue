<template>
  <v-container class="hnb__login--wrapper" fluid>
    <v-row align="stretch" class="fill-height my-0">
      <v-col class="hnb__login--panel flex-column align-center justify-center">
        <div class="hnb__header mb-5">
          <div class="hnb__header--kicker">
            <v-img
              alt="HNB 華南銀行 Logo"
              class="d-inline-flex mr-2"
              :src="`${BaseURL}/images/logo-hncb.png`"
              width="160"
            />
          </div>

          <h2 class="hnb__header--title text-cyan-darken-3">國內信用狀系統</h2>
          <!-- <p class="hnb__header--note">請選擇角色並輸入帳號資訊</p> -->
        </div>

        <v-sheet class="hnb__login--card" elevation="3">
          <v-form ref="loginFormRef" class="hnb__login--form" @submit.prevent="userLogin">
            <!-- <v-btn-toggle
              v-model="loginForm.auth"
              class="hnb__role--toggle"
              color="orange-darken-1"
              density="compact"
              mandatory
              rounded="pill"
            >
              <v-btn v-for="item in roles" :key="item.value" :value="item.value">
                {{ item.label }}
              </v-btn>
            </v-btn-toggle> -->

            <v-text-field
              v-model="loginForm.account"
              autocomplete="new-account"
              color="blue-darken-1"
              label="帳號"
              prepend-inner-icon="mdi-account"
              readonly
              required
              :rules="rules.account"
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

            <!-- <div class="hnb__captcha--row">
              <v-text-field
                v-model="captcha"
                autocomplete="one-time-code"
                class="hnb__captcha--input"
                color="blue-darken-1"
                density="compact"
                label="驗證碼"
                :rules="rules.captcha"
                variant="outlined"
              />

              <div class="hnb__captcha--box">
                <div aria-hidden="true" class="hnb__captcha--text">{{ captchaText }}</div>

                <v-btn
                  aria-label="重新產生驗證碼"
                  class="hnb__captcha--refresh"
                  color="secondary"
                  icon
                  size="small"
                  variant="text"
                  @click="refreshCaptcha"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </div>
            </div> -->

            <!-- <div class="hnb__login--actions">
              <v-spacer />
            </div> -->

            <v-btn
              block
              class="hnb__login--button mt-0"
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
    <!-- <SecurityDialog v-model:security-dialog="securityDialog" @on-close="securityDialog = false" />
    <PrivacyDialog v-model:privacy-dialog="privacyDialog" @on-close="privacyDialog = false" /> -->
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
  import type { FormData } from '@/types/auth'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { VForm } from 'vuetify/components'
  import { login } from '@/api/auth'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const userStore = useUserStore()
  const BaseURL = import.meta.env.VITE_BASE_URL
  const loading = ref<boolean>(false)
  // const securityDialog = ref<boolean>(false)
  // const privacyDialog = ref<boolean>(false)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  // const isAuthenticated = ref<boolean>(false)
  const loginFormRef = ref<InstanceType<typeof VForm> | null>(null)

  const loginForm = ref<FormData>({
    account: '',
    password: '',
  })
  // const captcha = ref<string>('')
  // // const remember = ref<boolean>(false)
  // const captchaText = ref<string>(makeCaptcha())
  const isShowText = ref<boolean>(false)

  interface Rules {
    account: ((v: string) => boolean | string)[]
    password: ((v: string) => boolean | string)[]
    // captcha: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    account: [v => !!v || '請輸入帳號'],
    password: [v => !!v || '請輸入密碼'],
    // captcha: [
    //   v => !!v || '請輸入驗證碼',
    //   v => v.toUpperCase() === captchaText.value || '驗證碼錯誤',
    // ],
  }

  // 產生 5 碼驗證碼，避免使用容易混淆的字元
  // function makeCaptcha (): string {
  //   const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  //   let text = ''
  //   for (let i = 0; i < 5; i += 1) {
  //     text += chars[Math.floor(Math.random() * chars.length)]
  //   }
  //   return text
  // }

  // 重新產生驗證碼並清空輸入
  // function refreshCaptcha (): void {
  //   captchaText.value = makeCaptcha()
  // }

  // interface ApiResponse<T = any> {
  //   code: number
  //   message: string
  //   data?: T
  // }

  // 登入
  async function userLogin (): Promise<void> {
    // 檢核欄位
    const { valid } = await loginFormRef.value?.validate() || { valid: false }
    if (!valid) return

    const { account, password } = loginForm.value

    interface Payload {
      account: string
      password: string
    }
    const payload: Payload = { account, password }

    loading.value = true
    // const apiUrl = '/api/auth/login'
    try {
      const res = await login(payload)
      const { status, data } = res
      const { data: resData } = data
      if (status === 200) {
        // 登入成功後存儲 token、更新使用者狀態等
        userStore.signIn(resData)
        router.push('/')
      }
    } catch (error: any) {
      const res = error?.response
      const { data } = res || {}
      // 'HTTP 狀態碼: res.status
      // '響應資料:' res.data
      // '業務錯誤碼:' res.data?.code
      // '錯誤訊息:' res.data?.message
      // '響應標頭:' res.headers
      if (data?.code === 404) {
        messageTitle.value = '登入失敗'
        message.value = data?.message || '帳號或密碼錯誤，請確認後再輸入。'
        messageStatus.value = 'alert'
        isConfirmBtn.value = false
        messageDialog.value = true
      } else {
        messageTitle.value = '登入失敗'
        message.value = '無法連接到伺服器，請稍後再試。'
        messageStatus.value = 'alert'
        isConfirmBtn.value = false
        messageDialog.value = true
      }
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
