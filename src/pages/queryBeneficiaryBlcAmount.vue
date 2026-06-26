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
        <h2 class="mx-4 hnb16__title">查詢受益人分行信用狀暨押匯筆數金額</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <!-- <div class="py-1"> -->
            <v-row class="ma-0">
              <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">開狀日期</div>

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

              <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">押匯日期</div>

                <v-date-input
                  v-model="searchForm.draftDateStart"
                  append-inner-icon="mdi-calendar"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
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
                  hide-details="auto"
                  placeholder="訖日"
                  prepend-icon=""
                  :rules="rules.draftDateEndRule"
                  variant="outlined"
                />
              </v-col>

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
            </v-row>
            <!-- </div> -->

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

      <!-- 受益人分行信用狀暨押匯筆數金額明細表 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            受益人分行信用狀暨押匯筆數金額明細表
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

        <QueryBeneficiaryBlcAmountList :form-data="propsFormData" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { QueryFormPayload } from '@/types/queryBeneficiaryBlcAmount'
  import { isAfter, isBefore } from 'date-fns'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { createInitialQueryForm } from '@/types/queryBeneficiaryBlcAmount'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '查詢作業' },
    { title: '受益人分行信用狀暨押匯筆數金額', disabled: true },
  ]

  const BENEFICIARY_ITEMS = [
    { type: 'subheader', title: '群組受益人' },
    { title: 'CDS 客戶', value: 'cds' },
    { title: '台塑 e 化集團', value: 'fpc' },
    { type: 'subheader', title: '單一受益人' },
    { title: '75708007 台灣塑膠工業股份有限公司', value: '75708007' },
    { title: '85236974 泰西企業股份有限公司', value: '85236974' },
    { title: '56751230 海鮮爭先股份有限公司', value: '56751230' },
  ]

  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })

  const searchEnabled = computed(() => {
    return searchForm.issueDateStart !== '' || searchForm.issueDateEnd !== '' || searchForm.draftDateStart !== '' || searchForm.draftDateEnd !== '' || searchForm.beneficiary !== ''
  })

  interface Rules {
    issueDateStartRule: ((v: string) => boolean | string)[]
    issueDateEndRule: ((v: string) => boolean | string)[]
    draftDateStartRule: ((v: string) => boolean | string)[]
    draftDateEndRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    issueDateStartRule: [v => {
      if (!v || !searchForm.issueDateEnd) return true

      const start = new Date(v)
      const end = new Date(searchForm.issueDateEnd)
      if (!start || !end) return true
      return !isAfter(start, end) || '開狀起始日期不能晚於結束日期'
    }],
    issueDateEndRule: [v => {
      if (!v || !searchForm.issueDateStart) return true

      const end = new Date(v)
      const start = new Date(searchForm.issueDateStart)
      if (!start || !end) return true
      return !isBefore(end, start) || '開狀結束日期不能早於起始日期'
    }],
    draftDateStartRule: [v => {
      if (!v || !searchForm.draftDateEnd) return true

      const start = new Date(v)
      const end = new Date(searchForm.draftDateEnd)
      if (!start || !end) return true
      return !isAfter(start, end) || '押匯起始日期不能晚於押匯結束日期'
    }],
    draftDateEndRule: [v => {
      if (!v || !searchForm.draftDateStart) return true

      const end = new Date(v)
      const start = new Date(searchForm.draftDateStart)
      if (!start || !end) return true
      return !isBefore(end, start) || '押匯結束日期不能早於押匯起始日期'
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

  function handlePrint (): void {
    window.print()
  }

  function handleDownload (): void {
    console.log('下載電子檔')
  }
</script>
