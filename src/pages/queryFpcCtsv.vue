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
        <h2 class="mx-4 hnb16__title">查詢台塑網通訊傳輸排程檢視</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <v-row class="ma-0">
              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">交易類型</div>

                <v-select
                  v-model="searchForm.transactionType"
                  bg-color="white"
                  clearable
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="[...TRANSACTION_TYPE_ITEMS]"
                  placeholder="請選擇"
                  variant="outlined"
                />
              </v-col>

              <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">交易期間</div>

                <v-date-input
                  v-model="searchForm.transactionDateStart"
                  append-inner-icon="mdi-calendar"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  placeholder="起日"
                  prepend-icon=""
                  :rules="rules.transactionDateStartRule"
                  variant="outlined"
                />

                <div class="text-body-1 font-weight-medium pt-2">~</div>

                <v-date-input
                  v-model="searchForm.transactionDateEnd"
                  append-inner-icon="mdi-calendar"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  placeholder="訖日"
                  prepend-icon=""
                  :rules="rules.transactionDateEndRule"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-space-between" cols="12">
                <div class="py-1 text-body-2 text-red-darken-2">
                  注意：查詢期間只能為一年內
                </div>

                <div>
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
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <!-- 台塑網通訊傳輸排程檢視清冊 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            台塑網通訊傳輸排程檢視清冊
          </h2>

          <!-- <div>
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
          </div> -->
        </div>

        <QueryFpcCtsvList :form-data="propsFormData" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { isAfter, isBefore } from 'date-fns'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { type QueryFormPayload, TRANSACTION_TYPE_ITEMS } from '@/types/queryFpcCtsv'
  import { createInitialQueryForm } from '@/types/queryFpcCtsv'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '查詢作業' },
    { title: '台塑網通訊傳輸排程檢視', disabled: true },
  ]

  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })

  const searchEnabled = computed(() => {
    return searchForm.transactionDateStart !== '' || searchForm.transactionDateEnd !== '' || searchForm.transactionType !== ''
  })

  interface Rules {
    transactionDateStartRule: ((v: string) => boolean | string)[]
    transactionDateEndRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    transactionDateStartRule: [v => {
      if (!v || !searchForm.transactionDateEnd) return true

      const start = new Date(v)
      const end = new Date(searchForm.transactionDateEnd)
      if (!start || !end) return true
      return !isAfter(start, end) || '開狀起始日期不能晚於結束日期'
    }],
    transactionDateEndRule: [v => {
      if (!v || !searchForm.transactionDateStart) return true

      const end = new Date(v)
      const start = new Date(searchForm.transactionDateStart)
      if (!start || !end) return true
      return !isBefore(end, start) || '開狀結束日期不能早於起始日期'
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
