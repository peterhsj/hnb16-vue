<template>
  <div>
    <!-- 修改申請書 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div>
        <h2 class="mx-4 hnb16__title">選擇修改申請書填寫方式</h2>

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
                  <v-col class="px-0 pt-3 d-flex align-start" cols="auto">
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
                  <v-col class="px-0 pt-3 d-flex align-start" cols="auto">
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
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">申請人放款戶號</div>

                        <v-text-field
                          v-model="searchForm.applicantLoanAccount"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchForm.queryMode !== 'criteria'"
                          hide-details="auto"
                          variant="outlined"
                        />
                      </v-col>

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

      <!-- 信用狀修改申請書清冊 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <h2 class="hnb16__title">
          信用狀清冊 -
          {{ searchForm.beneType === 'cds' ? 'CDS' : searchForm.beneType === 'fpc' ? '台塑 e 化平台' : '企業' }}
        </h2>

        <AmendLcAppList :form-data="propsFormData" @on-edit="handleEdit" />

      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { AmendQueryFormPayload, BeneTypeOption } from '@/types/amendLcList'
  import { isAfter, isBefore } from 'date-fns'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    BENE_TYPE_ITEMS,
    createInitialAmendQueryForm,
    LC_STATUS_ITEMS,
  } from '@/types/amendLcList'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '申請作業' },
    { title: '修改申請書', disabled: true },
  ]

  const isEdit = ref(false)
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<AmendQueryFormPayload>(createInitialAmendQueryForm())
  const propsFormData = ref<AmendQueryFormPayload>({ ...searchForm })
  const amendLcAppData = ref<{ type: string, appNo: string, beneType: string } | null>(null)

  watch(() => searchForm.queryMode, newType => {
    searchFormRef.value?.reset()
    searchForm.queryMode = newType
  })
  const searchEnabled = computed(() => searchForm.queryMode !== '')
  const emit = defineEmits<{
    search: [AmendQueryFormPayload, BeneTypeOption]
    // reset: []
  }>()

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
    isShowList.value = false
  }

  function sendSearchForm (): void {
    // submitSearch()
    console.log('送出表單', searchForm)
    // const { beneficiaryType, beneficiary } = typeForm
    isShowList.value = true
    propsFormData.value = { ...searchForm }
  }

  // 編輯開狀申請書
  function handleEdit (payload: { type: string, appNo: string }): void {
    console.log('編輯事件觸發，接收到 payload:', payload)
    // 取得 appId
    amendLcAppData.value = { type: payload.type, appNo: payload.appNo, beneType: searchForm.beneType || '' }
    isShowList.value = false
    isEdit.value = true
  }
</script>
