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

      <div>
        <h2 class="mx-4 hnb16__title">查詢受益人資料維護</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <v-row class="ma-0">
              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <!-- <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">交易類型</div> -->

                <v-radio-group
                  v-model="searchForm.importType"
                  class="mt-2"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details="auto"
                  inline
                >
                  <v-radio
                    class="me-4"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                    style="flex: none;"
                    value="fpc"
                  >
                    <template #label>
                      台塑 e 化集團
                    </template>
                  </v-radio>

                  <v-radio
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                    style="flex: none;"
                    value="cds"
                  >
                    <template #label>
                      CDS 客戶受益人
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  class="hnb__btn--cancel mx-1"
                  @click="resetForm"
                >
                  重設
                </v-btn>

                <v-btn
                  class="hnb__btn--default mx-1"
                  :disabled="!searchEnabled"
                  type="submit"
                >
                  確定
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <!-- 受益人資料清冊 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            受益人資料清冊
          </h2>

          <div>
            <v-btn
              class="hnb__btn--orange mx-1"
              prepend-icon="mdi-plus"
              size="small"
              variant="flat"
              @click="onEdit({ item: createInitialEditForm(), type: 'new' })"
            >
              新增
            </v-btn>
          </div>
        </div>

        <ManagerBeneficiaryList
          :bene-type="beneType"
          @on-edit="onEdit"
        />
      </div>
    </v-container>

    <EditManagerBeneficiaryDialog
      v-model:is-edit-dialog-open="isEditDialogOpen"
      :bene-type="searchForm.importType"
      :data-item="selectedItem"
      :edit-type="editType"
      @on-close="isEditDialogOpen = false"
      @on-save="saveHandler"
    />
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
  import type { ListItem, QueryFormPayload } from '@/types/managerBeneficiary'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { createInitialEditForm, createInitialQueryForm } from '@/types/managerBeneficiary'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '會員管理作業' },
    { title: '受益人資料維護', disabled: true },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  // 編輯
  const beneType = ref<string>('')
  const editType = ref<string>('') // 'new' or 'edit'
  const isEditDialogOpen = ref<boolean>(false)
  const selectedItem = ref<ListItem>({
    serNo: 0,
    compId: '',
    compName: '',
    managerName: '',
    managerTitle: '',
    address: '',
    phone: '',
    email: '',
    beneficiaryDepartment: '',
    confirmStatus: false,
  })

  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })

  const searchEnabled = computed(() => {
    return searchForm.importType !== null
  })

  function resetForm (): void {
    searchFormRef.value?.reset()
    isShowList.value = false
  }

  function sendSearchForm (): void {
    beneType.value = searchForm.importType || ''
    console.log('送出表單', beneType.value)
    isShowList.value = true
  }

  function onEdit ({ item, type }: { item: ListItem, type: string }): void {
    console.log('編輯', { item, type })
    editType.value = type
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  // saveHandler
  function saveHandler (): void {
    isEditDialogOpen.value = false
    console.log('儲存資料')
    // 在這裡執行儲存操作，例如呼叫 API 儲存資料
    // 儲存後重新取得列表資料
    messageTitle.value = '作業訊息'
    message.value = `作業已完成`
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
    // fetchLcAppList()
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
