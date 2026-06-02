<template>
  <div>
    <!-- 查詢會計帳務分錄 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="currentView === 'search'">
        <h2 class="mx-4 hnb16__title">查詢會計帳務分錄</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <div class="py-1">
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
                      value="accountSummary"
                    />
                  </v-col>

                  <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                    <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">科目彙總查詢</div>
                    <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">日期</div>

                    <v-date-input
                      v-model="searchForm.searchDate"
                      append-inner-icon="mdi-calendar"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      :disabled="searchForm.queryMode !== 'journalEntry'"
                      hide-details="auto"
                      placeholder="請選擇日期"
                      prepend-icon=""
                      :rules="rules.searchDateRule"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                    <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">開狀銀行</div>

                    <v-select
                      v-model="searchForm.issuingBank"
                      bg-color="white"
                      clearable
                      color="teal-darken-2"
                      density="compact"
                      :disabled="searchForm.queryMode !== 'journalEntry'"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...ISSUING_BANK_ITEMS]"
                      placeholder="請選擇"
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
                      value="journalEntry"
                    />
                  </v-col>

                  <v-col class="pa-0">
                    <v-row align="center" class="flex-grow-1 ma-0">
                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">交易分錄</div>

                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">類別</div>

                        <v-select
                          v-model="searchForm.transactionType"
                          bg-color="white"
                          clearable
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'journalEntry'"
                          hide-details="auto"
                          item-title="title"
                          item-value="value"
                          :items="[...TRANSACTION_TYPE_ITEMS]"
                          placeholder="請選擇"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">日期</div>

                        <v-date-input
                          v-model="searchForm.searchDate"
                          append-inner-icon="mdi-calendar"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'journalEntry'"
                          hide-details="auto"
                          placeholder="請選擇日期"
                          prepend-icon=""
                          :rules="rules.searchDateRule"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">開狀銀行</div>

                        <v-select
                          v-model="searchForm.issuingBank"
                          bg-color="white"
                          clearable
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'journalEntry'"
                          hide-details="auto"
                          item-title="title"
                          item-value="value"
                          :items="[...ISSUING_BANK_ITEMS]"
                          placeholder="請選擇"
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

      <!-- 國內信用狀會計科目彙總明細 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            國內信用狀會計科目彙總明細
          </h2>

          <div>
            <v-btn
              class="hnb__btn--default mx-1"
              prepend-icon="mdi-download"
              size="small"
              variant="flat"
              @click="handleDownload"
            >
              下載電子檔
            </v-btn>

            <v-btn
              class="hnb__btn--orange mx-1"
              prepend-icon="mdi-printer"
              size="small"
              variant="flat"
              @click="handlePrint"
            >
              列印
            </v-btn>
          </div>
        </div>

        <QueryAccountList :form-data="(propsFormData as any)" @on-edit="handleEdit" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { QueryFormPayload } from '@/types/queryAccount'
  import { computed, reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    createInitialQueryForm,
    ISSUING_BANK_ITEMS,
    TRANSACTION_TYPE_ITEMS,
  } from '@/types/queryAccount'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '查詢作業' },
    { title: '會計帳務分錄', disabled: true },
  ]

  const currentView = ref('search')
  const isEdit = ref(false)
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })

  watch(() => searchForm.queryMode, newType => {
    searchFormRef.value?.reset()
    searchForm.queryMode = newType
  })

  const searchEnabled = computed(() => searchForm.queryMode !== '')

  const rules = {
    searchDateRule: [(v: string) => !!v || '請選擇日期'],
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
        searchForm.queryMode = '' // 重置查詢方式，強制使用者重新選擇
      }
    }
  }

  function handlePrint (): void {
    window.print()
  }

  function handleDownload (): void {
    console.log('下載電子檔')
  }
</script>
