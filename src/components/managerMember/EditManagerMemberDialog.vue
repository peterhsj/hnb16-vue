<template>
  <v-dialog
    v-model="show"
    persistent
    width="700"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>{{ props.editType === 'new' ? '新增' : '編輯' }}系統會員資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="saveData">
        <v-card-text class="d-flex align-center bg-grey-lighten-4">
          <v-row class="align-center">
            <v-col class="text-body-2 text-teal-darken-3" cols="12">
              註：密碼如無修改請空白
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">角色選擇</div>

              <v-select
                v-model="form.userRole"
                class="mx-1"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                item-title="title"
                item-value="value"
                :items="[...ROLE_OPTIONS]"
                style="width: 80px"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">所屬分行</div>

              <div class="d-flex align-center ga-2 w-100">
                <div class="w-45 pa-2">
                  <span class="text-caption text-teal-darken-2">可選擇分行</span>

                  <v-list
                    v-model:selected="canSelected"
                    class="pa-1 border-sm"
                    color="teal-darken-2"
                    select-strategy="leaf"
                    style="height: 200px; overflow-y: auto;"
                  >
                    <v-list-item
                      v-for="item in CAN_SELECTED_ITEMS"
                      :key="item.id"
                      density="compact"
                      :value="item.id"
                    >
                      <span class="text-body-2">{{ item.title }}</span>
                    </v-list-item>
                  </v-list>
                </div>

                <div class="text-center w-10">
                  <v-btn
                    class="hnb__btn--default mx-1 my-2"
                    min-width="35"
                    width="35"
                    @click="getSelectedBranches()"
                  >
                    <v-icon icon="mdi-chevron-right" size="24" />
                  </v-btn>

                  <v-btn
                    class="hnb__btn--default mx-1 my-2"
                    min-width="35"
                    width="35"
                    @click="discardSelectedBranches()"
                  >
                    <v-icon icon="mdi-chevron-left" size="24" />
                  </v-btn>

                </div>

                <div class="w-45 pa-2">
                  <span class="text-caption text-teal-darken-2">已選擇分行</span>

                  <v-list
                    v-model:selected="selectedBranches"
                    class="pa-1 border-sm"
                    color="teal-darken-2"
                    select-strategy="leaf"
                    style="height: 200px; overflow-y: auto;"
                  >
                    <v-list-item
                      v-for="item in BRANCH_SELECTED_ITEMS"
                      :key="item.id"
                      density="compact"
                      :value="item.id"
                    >
                      <span class="text-body-2">{{ item.title }}</span>
                    </v-list-item>
                  </v-list>
                </div>
              </div>
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">經辦/主管</div>

              <v-radio-group
                v-model="form.userRole2"
                color="cyan-darken-3"
                density="compact"
                hide-details="auto"
                inline
              >
                <v-radio
                  label="主管"
                  value="admin"
                />

                <v-radio
                  label="經辦"
                  value="user"
                />
              </v-radio-group>
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">用戶帳號</div>

              <v-text-field
                v-model="form.userAccount"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">用戶姓名</div>

              <v-text-field
                v-model="form.userName"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">用戶密碼</div>

              <v-text-field
                v-model="form.userPassword"
                :append-inner-icon="isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                :type="isShowPass ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="isShowPass = !isShowPass"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">密碼確認</div>

              <v-text-field
                v-model="userPasswordConfirm"
                :append-inner-icon="isShowConfirmPass ? 'mdi-eye' : 'mdi-eye-off'"
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
              <div class="font-weight-medium text-no-wrap hnb__form-label">電子信箱</div>

              <v-text-field
                v-model="form.email"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">聯絡電話</div>

              <v-text-field
                v-model="form.phone"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            取消
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1 my-2"
            type="submit"
          >
            確定
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import type { FormPayload, ListItem } from '@/types/managerMember'
  import { computed, ref } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    isEditDialogOpen?: boolean
    editType?: string
    dataItem?: ListItem
  }
  const props = withDefaults(defineProps<Props>(), {
    isEditDialogOpen: false,
    editType: 'new',
    dataItem: () => ({
      userAccount: '',
      branchName: '',
      branchCode: '',
      userRole: '',
    }),
  })

  const emits = defineEmits<{
    'update:isEditDialogOpen': [boolean]
    'on-save': []
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isEditDialogOpen,
    set: (value: boolean) => {
      emits('update:isEditDialogOpen', value)
    },
  })

  const ROLE_OPTIONS = [
    { title: '總行', value: 'admin' },
    { title: '分行管理員', value: 'user' },
    { title: '分行主管', value: 'supervisor' },
    { title: '分行經辦', value: 'clerk' },
  ]

  const BANCH_OPTIONS = [
    { id: '001', title: '0001 台北分行' },
    { id: '002', title: '0002 南海分行' },
    { id: '003', title: '0003 台中分行' },
    { id: '004', title: '0004 高雄分行' },
    { id: '005', title: '0005 中山分行' },
    { id: '006', title: '0006 信義分行' },
  ]
  interface BranchItem {
    id: string
    title: string
  }

  const CAN_SELECTED_ITEMS = ref<BranchItem[]>([])
  const BRANCH_SELECTED_ITEMS = ref<BranchItem[]>([])
  const canSelected = ref<string[]>([])
  const selectedBranches = ref<string[]>([])
  const isShowPass = ref(false)
  const isShowConfirmPass = ref(false)

  const form = ref<FormPayload>({
    userName: '',
    userRole: '',
    userRole2: '',
    userPassword: '',
    userAccount: '',
    branchCode: [],
    email: '',
    phone: '',
  })

  const userPasswordConfirm = ref<string>('')
  const rules = {
    confirmPassword: [
      (v: string) => v === '' || v === form.value.userPassword || '密碼確認不一致',
    ],
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function saveData (): void {
    if (formRef.value?.validate()) {
      // 在這裡處理表單提交邏輯
      console.log('表單資料:', form.value)
    }
    emits('on-save')
  }

  function getSelectedBranches (): void {
    // 在這裡處理獲取選中的分行邏輯
    console.log('可選分行:', canSelected.value)
    // 將選中的分行加入已選擇分行列表
    const selectedItems = BANCH_OPTIONS.filter(item => canSelected.value.includes(item.id))
    // selectedBranches.value = selectedItems.map(item => item.id)
    BRANCH_SELECTED_ITEMS.value = selectedItems
    // 從可選擇分行列表中移除已選擇的分行
    CAN_SELECTED_ITEMS.value = BANCH_OPTIONS.filter(item => !canSelected.value.includes(item.id))
  }

  function discardSelectedBranches (): void {
    // 在這裡處理放棄選中的分行邏輯
    console.log('已選分行:', selectedBranches.value)
    // 將已選擇分行移回可選擇分行列表
    const discardedItems = BANCH_OPTIONS.filter(item => selectedBranches.value.includes(item.id))
    CAN_SELECTED_ITEMS.value = [...CAN_SELECTED_ITEMS.value, ...discardedItems]
    canSelected.value = []
    // 從已選擇分行列表中移除已放棄的
    BRANCH_SELECTED_ITEMS.value = BRANCH_SELECTED_ITEMS.value.filter(item => !selectedBranches.value.includes(item.id))
    selectedBranches.value = []
  }

  onMounted(() => {
    // 初始化可選擇分行列表
    CAN_SELECTED_ITEMS.value = BANCH_OPTIONS
  })
</script>
