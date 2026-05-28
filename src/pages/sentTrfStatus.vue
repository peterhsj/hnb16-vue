<template>
  <div>
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
                      <v-col class="d-flex align-center ga-4 mb-6" cols="12" lg="4" md="6">
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

                      <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">押匯日期</div>

                        <v-date-input
                          v-model="searchForm.draftDateStart"
                          append-inner-icon="mdi-calendar"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'criteria'"
                          placeholder="起日"
                          prepend-icon=""
                          :rules="rules.draftDateStartRule"
                          variant="outlined"
                        />

                        <div class="text-body-1 font-weight-medium pt-2">~</div>

                        <v-date-input
                          v-model="searchForm.draftDateEnd"
                          append-inner-icon="mdi-calendar"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'criteria'"
                          placeholder="訖日"
                          prepend-icon=""
                          :rules="rules.draftDateEndRule"
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
    </v-container>
  </div>

  <!-- 傳送已轉帳狀態清冊 -->
  <div v-if="isShowList" class="mt-4 mx-4">
    <h2 class="hnb16__title">
      傳送已轉帳狀態清冊
    </h2>

    <sentTrfStatusList :form-data="propsFormData" @on-edit="handleEdit" />

  </div>
</template>

<script setup lang="ts">
  import { isAfter, isBefore } from 'date-fns'
  import { computed, reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import { createInitialQueryForm, type DraftData, type QueryFormPayload } from '@/types/sentTrfStatus'
  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '傳送已轉帳狀態', to: '/sentTrfStatus' },
  ]

  const currentView = ref('search')
  const isEdit = ref(false)
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })
  const draftLcData = ref<DraftData>({ draftNo: '' })

  watch(() => searchForm.queryMode, newType => {
    searchFormRef.value?.reset()
    searchForm.queryMode = newType
  })

  const searchEnabled = computed(() => searchForm.queryMode !== '')

  interface Rules {
    draftDateStartRule: ((v: string) => boolean | string)[]
    draftDateEndRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    draftDateStartRule: [v => {
      if (!v || !searchForm.draftDateEnd) return true

      const start = new Date(v)
      const end = new Date(searchForm.draftDateEnd)
      if (!start || !end) return true
      return !isAfter(start, end) || '起始日期不能晚於結束日期'
    }],
    draftDateEndRule: [v => {
      if (!v || !searchForm.draftDateStart) return true

      const end = new Date(v)
      const start = new Date(searchForm.draftDateStart)
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

  // 編輯匯票資料
  function handleEdit (payload: { draftNo: string }): void {
    console.log('編輯事件觸發，接收到 payload:', payload)
    draftLcData.value = { draftNo: payload.draftNo }
    // 開啟 Dialog，並傳遞 draftNo
  }

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return
    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '傳送已轉帳狀態') {
        isEdit.value = false
        isShowList.value = false
        currentView.value = 'search'
      }
    }
  }
</script>
