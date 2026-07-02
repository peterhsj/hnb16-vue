<template>
  <v-app-bar
    v-if="userStore.isAuthenticated"
    color="white"
    elevation="3"
    height="70"
    prominent
  >
    <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer" />

    <div>
      <v-img
        alt="HNB Logo"
        class="d-inline-flex ml-3"
        src="/images/logo-hncb.png"
        width="175"
      />
    </div>

    <v-toolbar-title class="hnb16__logo">國內信用狀系統</v-toolbar-title>
    <v-spacer />

    <div class="d-none d-md-flex d-lg-flex align-center">
      <span class="text-body-2 text-blue-grey-darken-1">
        {{ roleName }} {{ userInfo.name }} 您好，歡迎使用本系統
      </span>

      <v-divider
        class="mx-3"
        color="black"
        inset
        thickness="2"
        vertical
      />

      <a class="mx-2 hnb__text--link" href="#" @click.prevent="todoListHandler">
        待辦事項
      </a>

      <a class="mx-2 hnb__text--link" href="#" @click.prevent="infoHandler">
        訊息匣
      </a>

      <v-btn
        class="mx-4 px-4 hnb__btn--red"
        variant="flat"
        @click="handleLogout()"
      >
        <v-icon class="me-2" icon="mdi-logout" size="16" />
        登出
      </v-btn>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-if="userStore.isAuthenticated"
    v-model="drawer"
    class="hnb__drawer"
    color="grey-lighten-2"
    elevation="4"
    :permanent="mdAndUp"
    :temporary="!mdAndUp"
    width="275"
  >
    <v-list v-model:opened="open" class="pa-0">
      <!-- 第一層選單 -->
      <template
        v-for="item in menu"
        :key="item.value"
      >
        <!-- 有第二層選單的項目 -->
        <v-divider />

        <v-list-group
          v-if="item.subMenu"
          v-model="item.value"
          class="hnb__menu"
          :class="[open.includes(item.value) ? 'hnb__menu--open' : '']"
          density="compact"
          :value="item.value"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              class="hnb__menu--title"
              :value="item.value"
            >
              <div class="d-flex align-center">
                <!-- <v-icon class="mr-2" :icon="'mdi-atom-variant'" size="16" /> -->
                <span class="font-weight-medium">{{ item.text }}</span>
              </div>
            </v-list-item>
          </template>
          <!-- 第二層選單 -->
          <!-- <v-divider /> -->

          <template v-for="subItem in item.subMenu" :key="subItem.value">
            <!-- 有第三層選單的項目 -->

            <v-list-group
              v-if="subItem.secMenu"
              class="hnb__sec-menu mx-1"
              :class="[open.includes(subItem.value) ? 'hnb__sec-menu--open' : '']"
              :value="subItem.value"
            >
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  class="border-t-sm"
                >
                  <div class="d-flex align-start">
                    <!-- <v-icon class="mr-2" :icon="'mdi-pause-box-outline'" size="16" /> -->
                    <span class="text-body-2">{{ subItem.text }}</span>
                  </div>
                </v-list-item>
              </template>
              <!-- 第三層選單 -->
              <v-divider />

              <v-list-item
                v-for="secItem in subItem.secMenu"
                :key="secItem.value"
                :active="currentItem === secItem.value"
                class="hnb__third-menu"
                :class="[currentItem === secItem.value ? 'hnb__third-menu--sub' : 'text-blue-grey-darken-1']"
                min-height="44px"
                :value="secItem.value"
                @click="selectedHandler(secItem.value)"
              >
                <div class="d-flex align-start">
                  <!-- <v-icon class="mr-2 mt-1" :icon="'mdi-checkbox-blank'" size="12" /> -->
                  <span class="text-body-2">{{ secItem.text }}</span>
                </div>
              </v-list-item>
            </v-list-group>

            <v-divider v-if="subItem.secMenu" />

            <!-- 沒有第三層選單的項目 -->
            <v-list-item
              v-else
              class="hnb__sec-menu"
              :class="[currentItem === subItem.value ? 'hnb__singleItem--sub' : 'text-blue-grey-darken-1']"
              link
              :value="subItem.value"
              @click="selectedHandler(subItem.value)"
            >
              <div class="d-flex align-start">
                <!-- <v-icon class="mr-2" :icon="'mdi-pause-box-outline'" size="16" /> -->
                <span class="text-body-2">{{ subItem.text }}</span>
              </div>
            </v-list-item>
          </template>
        </v-list-group>
        <!-- 沒有第二層選單的項目 -->
        <v-list-item
          v-else
          :active="currentItem === item.value"
          class="v-list-group__header"
          :class="[currentItem === item.value ? 'hnb__singleItem--open' : 'hnb__singleItem']"
          link
          :value="item.value"
          @click="selectedHandler(item.value)"
        >

          <div class="d-flex align-center">
            <v-icon class="mr-2" :icon="'mdi-nature'" size="16" />
            <span class="font-weight-medium">{{ item.text }}</span>
          </div>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>

  <CommonOverlay :overlay="loading" />
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
  import type { MenuItem, MenuPathResult } from '@/plugins/menu'
  import { storeToRefs } from 'pinia'
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { logout } from '@/api/auth'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { menuByRole } from '@/plugins/menu'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const router = useRouter()
  const { mdAndUp } = useDisplay()
  const drawer = ref(mdAndUp.value)
  const { userInfo } = storeToRefs(userStore)
  const { handleApiError } = useApiErrorHandler()
  const loading = ref<boolean>(false)

  // 依照角色動態取得選單
  const menu = computed(() => {
    console.log('使用者資訊:', userInfo.value.roleName)
    const role = userInfo.value.roleName || 'BH'
    return menuByRole[role] ?? menuByRole.BH
  })

  // 取得職稱
  const roleName = computed((): string => {
    const role = userInfo.value.roleName || ''
    switch (role) {
      case 'BH': {
        return '經辦'
      }
      case 'BS': {
        return '主管'
      }
      case 'SM': {
        return '系統管理員'
      }
      case 'MB': {
        return '總行'
      }
      case 'BM': {
        return '分行管理員'
      }
      default: {
        return ''
      }
    }
  })

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)

  watch(mdAndUp, (value: boolean) => {
    drawer.value = value
  })

  const open = ref<string[]>([]) // 展開的選單項目值列表
  const currentItem = ref<string | null>(null) // 當前選項
  const mainMenu = ref<string | null>(null) // 第一層選單
  const currentSecMenu = ref<string | null>(null) // 第二層選單

  // 選單項目選擇處理函式
  function selectedHandler (value: string): void {
    nextTick(() => {
      // console.log('選擇項目:', open.value, value)
      if (open.value.length === 0) {
        if (value === 'home') {
          mainMenu.value = 'home'
          router.push('/')
        } else {
          mainMenu.value = value
          router.push(value)
        }
        mainMenu.value = value
      } else {
        if (open.value.length === 1) {
          mainMenu.value = open.value[0] || null
        } else {
          mainMenu.value = open.value[1] || null
          currentSecMenu.value = open.value[0] || null
        }
        router.push(value)
      }
      currentItem.value = value
    })
  }

  // 根據選單項目值尋找對應的主選單和子選單
  function findMenuPath (targetValue: string, menuItems: MenuItem[] = menu.value || [], parentMain: string | null = null, parentSub: string | null = null): MenuPathResult | null {
    for (const item of menuItems) {
      // 如果當前項目匹配
      if (item.value === targetValue) {
        return {
          mainMenu: parentMain || item.value,
          subMenu: parentSub,
        }
      }

      // 如果有子選單，遞迴搜尋
      if (item.subMenu) {
        for (const subItem of item.subMenu) {
          if (subItem.value === targetValue) {
            return {
              mainMenu: item.value,
              subMenu: null,
            }
          }

          // 如果有第三層選單，遞迴搜尋
          if (subItem.secMenu) {
            for (const secItem of subItem.secMenu) {
              if (secItem.value === targetValue) {
                return {
                  mainMenu: item.value,
                  subMenu: subItem.value,
                }
              }
            }
          }
        }
      }
    }
    return null
  }

  // 登出
  async function handleLogout (): Promise<void> {
    interface Payload {
      account: string
    }
    const payload: Payload = { account: userInfo.value.account }

    loading.value = true
    try {
      if (userInfo.value.token) {
        const res = await logout(payload)
        const { status } = res
        if (status === 200) {
          // 清除 localStorage 中的登入資訊
          userStore.signOut()
          // 導向到 login 頁面
          router.push('/login')
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error: any) {
      await handleApiError(error, handleLogout, {
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

  // 初始化選單狀態
  function initMenuState (): void {
    const currentPath = router.currentRoute.value.path
    // console.log('當前路由:', currentPath)
    if (currentPath === '/') {
      currentItem.value = 'home'
      mainMenu.value = 'home'
      currentSecMenu.value = ''
    } else {
      const pathValue = currentPath.slice(1)
      currentItem.value = pathValue

      const foundPath = findMenuPath(pathValue)
      if (foundPath) {
        mainMenu.value = foundPath.mainMenu || pathValue
        currentSecMenu.value = foundPath.subMenu || ''
        if (foundPath.mainMenu) {
          open.value = foundPath.subMenu ? [foundPath.subMenu, foundPath.mainMenu] : [foundPath.mainMenu]
        }
        // console.log('自動展開選單:', {
        //   主選單: foundPath.mainMenu,
        //   子選單: foundPath.subMenu,
        //   當前頁面: pathValue,
        // })
      } else {
        mainMenu.value = pathValue
        currentSecMenu.value = ''
        open.value = []
      }
    }
  }

  watch(
    () => router.currentRoute.value.path,
    () => {
      initMenuState()
    },
    { immediate: true })

  function todoListHandler (): void {
    open.value = []
    router.push('/')
  }

  function infoHandler (): void {
    open.value = []
    router.push('/info')
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
