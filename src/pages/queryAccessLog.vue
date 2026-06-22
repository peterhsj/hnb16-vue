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

      <div v-if="currentView === 'search'">
        <h2 class="mx-4 hnb16__title">存取記錄</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <v-row align="center" class="flex-grow-1 ma-0">
              <v-col class="d-flex align-start ga-4" cols="12">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">申請日期</div>

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
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">帳號</div>

                <v-text-field
                  v-model="searchForm.beneficiaryTaxId"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  variant="outlined"
                />
              </v-col>

              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">角色</div>

                <v-select
                  v-model="searchForm.role"
                  bg-color="white"
                  clearable
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="[...ROLE_ITEMS]"
                  placeholder="請選擇"
                  variant="outlined"
                />
              </v-col>

              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">作業項目</div>

                <v-select
                  v-model="searchForm.operationItem"
                  bg-color="white"
                  clearable
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="[...OPERATION_ITEMS]"
                  placeholder="請選擇"
                  variant="outlined"
                />
              </v-col>

              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">作業結果</div>

                <v-select
                  v-model="searchForm.operationResult"
                  bg-color="white"
                  clearable
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="[...OPERATION_RESULT_ITEMS]"
                  placeholder="請選擇"
                  variant="outlined"
                />
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
                  type="submit"
                >
                  確定
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <div v-if="isShowList" class="mt-4 mx-4">
        <h2 class="hnb16__title">
          信用狀清冊
        </h2>

        <query-access-log-list :form-data="searchForm" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { QueryFormPayload } from '@/types/queryAccessLog'
  import { isAfter, isBefore } from 'date-fns'
  import { ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { createInitialQueryForm } from '@/types/queryAccessLog'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '查詢作業' },
    { title: '存取記錄', disabled: true },
  ]

  // 角色
  const ROLE_ITEMS = [
    { title: '總行', value: 'main' },
    { title: '主管', value: 'supervisor' },
    { title: '經辦', value: 'clerk' },
  ]

  // 作業項目
  const OPERATION_ITEMS = [
    { title: '登入', value: 'login' },
    { title: '登出', value: 'logout' },
  ]

  // 作業結果
  const OPERATION_RESULT_ITEMS = [
    { title: '全部', value: 'all' },
    { title: '成功', value: 'success' },
    { title: '失敗', value: 'failure' },
  ]

  const currentView = ref('search')
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = ref<QueryFormPayload>(createInitialQueryForm())

  interface Rules {
    issueDateStartRule: ((v: string) => boolean | string)[]
    issueDateEndRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    issueDateStartRule: [v => {
      if (!v || !searchForm.value.issueDateEnd) return true

      const start = new Date(v)
      const end = new Date(searchForm.value.issueDateEnd)
      if (!start || !end) return true
      return !isAfter(start, end) || '起始日期不能晚於結束日期'
    }],
    issueDateEndRule: [v => {
      if (!v || !searchForm.value.issueDateStart) return true

      const end = new Date(v)
      const start = new Date(searchForm.value.issueDateStart)
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
    // searchForm.value = createInitialQueryForm()
  }
</script>
