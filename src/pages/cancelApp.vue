<template>
  <div>
    <!-- 註銷申請/切結書 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #item="{ item }">
            <v-breadcrumbs-item
              :disabled="Boolean(item.disabled)"
              :title="item.title"
              :to="item.title === '申請作業' ? '' : item.to"
              @click="onBreadcrumbClick(item)"
            />
          </template>

          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="currentView === 'search'">
        <h2 class="mx-4 hnb16__title">請選擇查詢方式</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <v-row class="ma-0">
              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <div class="ms-7 text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人類別</div>

                <v-select
                  v-model="searchForm.beneType"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="[...BENE_TYPE_ITEMS]"
                  placeholder="請選擇受益人類別"
                  :rules="rules.beneTypeRule"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-divider class="my-1" />

            <div class="d-flex py-1">
              <v-radio-group
                v-model="searchForm.queryMode"
                hide-details="auto"
              >
                <v-row class="ma-0">
                  <v-col class="px-0 pt-4 d-flex align-start" cols="auto">
                    <v-radio
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      value="lcNo"
                    />
                  </v-col>

                  <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                    <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">信用狀號碼</div>

                    <v-text-field
                      v-model="searchForm.lcNo"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      :disabled="searchForm.queryMode !== 'lcNo'"
                      hide-details
                      variant="outlined"
                    />
                  </v-col>
                </v-row>

                <v-divider class="my-1" />

                <v-row class="ma-0">
                  <v-col class="px-0 pt-4 d-flex align-start" cols="auto">
                    <v-radio
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      value="criteria"
                    />
                  </v-col>

                  <v-col class="pa-0">
                    <v-row align="center" class="flex-grow-1 ma-0">
                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人統編</div>

                        <v-text-field
                          v-model="searchForm.beneficiaryTaxId"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'criteria'"
                          hide-details="auto"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">信用狀狀態</div>

                        <v-select
                          v-model="searchForm.lcStatus"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'criteria'"
                          hide-details="auto"
                          item-title="title"
                          item-value="value"
                          :items="[...LC_STATUS_ITEMS]"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">開狀日期</div>

                        <v-date-input
                          v-model="searchForm.issueDateStart"
                          append-inner-icon="mdi-calendar"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'criteria'"
                          placeholder="起日"
                          prepend-icon=""
                          :rules="rules.issueDateStartRule"
                          variant="outlined"
                        />

                        <div class="text-body-1 font-weight-medium pt-2">~</div>

                        <v-date-input
                          v-model="searchForm.issueDateEnd"
                          append-inner-icon="mdi-calendar"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'criteria'"
                          placeholder="訖日"
                          prepend-icon=""
                          :rules="rules.issueDateEndRule"
                          variant="outlined"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-radio-group>
            </div>

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

      <!-- 註銷申請/切結書清冊 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <h2 class="hnb16__title">
          信用狀清冊 -
          {{ currentBeneType === 'cds' ? 'CDS' : currentBeneType === 'fpc' ? '台塑 e 化平台' : '臨櫃' }}
        </h2>

        <CancelAppList :form-data="propsFormData" @on-edit="handleEdit" />

      </div>

      <!-- 填寫註銷申請/切結書 -->
      <div v-if="isEdit">
        <CancelAppEditForm
          :form-data="cancleAppData"
          @on-cancel="closeEditForm"
          @on-submit="submitEditForm"
        />
      </div>
    </v-container>
    <!-- Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :is-cancel-btn="isCancelBtn"
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
  import type { BeneTypeOption, CancelAppData, CancelAppFormPayload } from '@/types/cancelApp'
  import { isAfter, isBefore } from 'date-fns'
  import { computed, reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    BENE_TYPE_ITEMS,
    createInitialCancelAppForm,
    LC_STATUS_ITEMS,
  } from '@/types/cancelApp'

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '註銷申請/切結書', to: '/cancelApp' },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isCancelBtn = ref<boolean>(false)
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')
  // const processStatus = ref<{ action: string, status: number }>({
  //   action: '',
  //   status: 0,
  // })

  const currentView = ref('search')
  const isEdit = ref(false)
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<CancelAppFormPayload>(createInitialCancelAppForm())
  const propsFormData = ref<CancelAppFormPayload>({ ...searchForm })
  const currentBeneType = ref<BeneTypeOption>('cds')
  const cancleAppData = ref<CancelAppData>({ appNo: '', beneType: '' })

  watch(() => searchForm.queryMode, newType => {
    const currentBeneType = searchForm.beneType || 'cds'
    searchFormRef.value?.reset()
    searchForm.beneType = currentBeneType
    searchForm.queryMode = newType
  })
  const searchEnabled = computed(() => searchForm.queryMode !== '')
  // const emit = defineEmits<{
  //   search: [CancelAppFormPayload, BeneTypeOption]
  //   // reset: []
  // }>()

  interface Rules {
    beneTypeRule: ((v: BeneTypeOption | null) => boolean | string)[]
    issueDateStartRule: ((v: string) => boolean | string)[]
    issueDateEndRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    beneTypeRule: [v => !!v || '請選擇受益人類別'],
    issueDateStartRule: [v => {
      if (!v || !searchForm.issueDateEnd) return true

      const start = new Date(v)
      const end = new Date(searchForm.issueDateEnd)
      if (!start || !end) return true
      return !isAfter(start, end) || '起始日期不能晚於結束日期'
    }],
    issueDateEndRule: [v => {
      if (!v || !searchForm.issueDateStart) return true

      const end = new Date(v)
      const start = new Date(searchForm.issueDateStart)
      if (!start || !end) return true
      return !isBefore(end, start) || '結束日期不能早於起始日期'
    }],
  }

  function resetForm (): void {
    searchFormRef.value?.reset()
    searchForm.beneType = null
    isShowList.value = false
  }

  function sendSearchForm (): void {
    console.log('送出表單', searchForm)
    currentBeneType.value = searchForm.beneType || 'cds'
    isShowList.value = true
    propsFormData.value = { ...searchForm }
  }

  // 編輯開狀申請書
  function handleEdit (payload: { appNo: string, beneType: string }): void {
    console.log('編輯事件觸發，接收到 payload:', payload)
    // 取得 appId
    cancleAppData.value = { appNo: payload.appNo, beneType: payload.beneType }
    if (payload.beneType === 'fpc') {
      messageTitle.value = '作業訊息'
      message.value = `注意：欲註銷未過期信狀餘額，<br />
請先取得受益人之同意書。`
      messageStatus.value = 'alert'
      isCancelBtn.value = false
      isConfirmBtn.value = true
      messageDialog.value = true
      processStatus.value = 'editAlert'
    } else {
      currentView.value = ''
      isShowList.value = false
      isEdit.value = true
    }
  }

  function closeEditForm (): void {
    isEdit.value = false
    isShowList.value = true
    currentView.value = 'search'
    searchFormRef.value?.reset()
    // typeForm.beneficiaryType = null
    // typeForm.beneficiary = null
    // typeForm.inputType = null
  }

  function submitEditForm (): void {
    // 送出編輯表單後的處理邏輯（例如刷新列表、顯示成功訊息等）
    console.log('編輯表單已送出，執行相關處理')
    // 這裡可以根據實際需求來決定是否要關閉編輯表單或是刷新列表等
    closeEditForm()
  }

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return

    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '註銷申請/切結書') {
        isEdit.value = false
        isShowList.value = false
        currentView.value = 'search'
        searchForm.beneType = null
        searchForm.queryMode = ''
      }
    }
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    if (processStatus.value === 'editAlert') {
      currentView.value = ''
      isShowList.value = false
      isEdit.value = true
    }
    messageDialog.value = false
  }
</script>
