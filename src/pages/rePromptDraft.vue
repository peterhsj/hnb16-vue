<template>
  <div>
    <!-- 查詢重新提示 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="currentView === 'search'">
        <h2 class="mx-4 hnb16__title">查詢重新提示</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <div class="py-1">
              <v-row class="ma-0">
                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人</div>

                  <v-select
                    v-model="searchForm.beneficiary"
                    bg-color="white"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...BENEFICIARY_ITEMS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">買受人統編</div>

                  <v-text-field
                    v-model="searchForm.buyerTaxId"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">押匯日期</div>

                  <v-date-input
                    v-model="searchForm.issueDateStart"
                    append-inner-icon="mdi-calendar"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
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
                    hide-details="auto"
                    placeholder="訖日"
                    prepend-icon=""
                    :rules="rules.issueDateEndRule"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">匯票號碼</div>

                  <v-text-field
                    v-model="searchForm.draftNo"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row class="ma-0">
                <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">開狀日期</div>

                  <v-date-input
                    v-model="searchForm.appDateStart"
                    append-inner-icon="mdi-calendar"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    placeholder="起日"
                    prepend-icon=""
                    :rules="rules.appDateStartRule"
                    variant="outlined"
                  />

                  <div class="text-body-1 font-weight-medium pt-2">~</div>

                  <v-date-input
                    v-model="searchForm.appDateEnd"
                    append-inner-icon="mdi-calendar"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    placeholder="訖日"
                    prepend-icon=""
                    :rules="rules.appDateEndRule"
                    variant="outlined"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">信用狀號碼</div>

                  <v-text-field
                    v-model="searchForm.lcNo"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </v-col>
              </v-row>
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
                  type="submit"
                >
                  確定
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <!-- 重新提示清冊 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            重新提示清冊
          </h2>
        </div>

        <RePromptDraftList :form-data="(propsFormData as any)" @on-edit="handleEdit" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { QueryFormPayload } from '@/types/rePromptDraft'
  import { isAfter, isBefore } from 'date-fns'
  import { reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import RePromptDraftList from '@/components/rePromptDraft/RePromptDraftList.vue'
  import {
    BENEFICIARY_ITEMS,
    createInitialQueryForm,
  } from '@/types/rePromptDraft'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '電子重新提示作業' },
    { title: '重新提示', disabled: true },
  ]

  const currentView = ref('search')
  const isEdit = ref(false)
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })

  interface Rules {
    issueDateStartRule: ((v: string) => boolean | string)[]
    issueDateEndRule: ((v: string) => boolean | string)[]
    appDateStartRule: ((v: string) => boolean | string)[]
    appDateEndRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
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
    appDateStartRule: [v => {
      if (!v || !searchForm.appDateEnd) return true

      const start = new Date(v)
      const end = new Date(searchForm.appDateEnd)
      if (!start || !end) return true
      return !isAfter(start, end) || '起始日期不能晚於結束日期'
    }],
    appDateEndRule: [v => {
      if (!v || !searchForm.appDateStart) return true

      const end = new Date(v)
      const start = new Date(searchForm.appDateStart)
      if (!start || !end) return true
      return !isBefore(end, start) || '結束日期不能早於起始日期'
    }],
  }

  function resetForm (): void {
    searchFormRef.value?.reset()
    isShowList.value = false
  }

  function sendSearchForm (): void {
    console.log('送出表單', searchForm)
    isShowList.value = true
    propsFormData.value = { ...searchForm }
  }

  // 編輯押匯申請書
  function handleEdit (payload: { appNo: string }): void {
    console.log('編輯事件觸發，接收到 payload:', payload)
    // draftLcData.value = { appNo: payload.appNo }
    currentView.value = ''
    isShowList.value = false
    isEdit.value = true
  }

  function closeEditForm (): void {
    isEdit.value = false
    isShowList.value = true
    currentView.value = 'search'
    searchFormRef.value?.reset()
  }

  function _submitEditForm (): void {
    // 送出編輯表單後的處理邏輯（例如刷新列表、顯示成功訊息等）
    console.log('編輯表單已送出，執行相關處理')
    // 這裡可以根據實際需求來決定是否要關閉編輯表單或是刷新列表等
    closeEditForm()
  }

  function _onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return
    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '利率約定(改貸)') {
        isEdit.value = false
        isShowList.value = false
        currentView.value = 'search'
        searchForm.beneficiary = '' // 重置受益人，強制使用者重新選擇
      }
    }
  }
</script>
