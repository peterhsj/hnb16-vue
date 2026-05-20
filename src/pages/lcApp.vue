<template>
  <div>
    <!-- 開狀申請書 -->
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

      <div v-if="currentView === 'selectType'">
        <h2 class="mx-4 hnb16__title">選擇開狀申請書填寫方式</h2>

        <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
          <v-form ref="typeFormRef" @submit.prevent="sendTypeForm">
            <v-row align="center">
              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人類別</div>

                <v-select
                  v-model="typeForm.beneficiaryType"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  item-title="title"
                  item-value="value"
                  :items="beneficiaryTypeOptions"
                  placeholder="請選擇受益人類別"
                  variant="outlined"
                />
              </v-col>

              <template v-if="typeForm.beneficiaryType === 'cds'">
                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人</div>

                  <v-select
                    v-model="typeForm.beneficiary"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    item-title="title"
                    item-value="value"
                    :items="beneListByType"
                    placeholder="請選擇受益人"
                    variant="outlined"
                  />
                </v-col>
              </template>

              <template v-if="typeForm.beneficiaryType === 'fpc'">
                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">集團受益人</div>

                  <v-select
                    v-model="typeForm.beneficiary"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    item-title="title"
                    item-value="value"
                    :items="beneGroupList"
                    placeholder="請選擇集團受益人"
                    variant="outlined"
                  />
                </v-col>
              </template>

              <template v-if="typeForm.beneficiaryType !== null">
                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">填寫方式</div>

                  <v-select
                    v-model="typeForm.inputType"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    item-title="title"
                    item-value="value"
                    :items="inputTypeOptions"
                    placeholder="請選擇填寫方式"
                    variant="outlined"
                  />
                </v-col>
              </template>
            </v-row>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  class="hnb__btn--default"
                  :disabled="typeForm.inputType === null"
                  type="submit"
                >
                  確定
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <div v-if="currentView === 'search'">
        <h2 class="mx-4 hnb16__title">查詢舊有開狀申請書</h2>

        <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <v-radio-group v-model="searchForm.searchType" hide-details="auto">
              <v-row class="ma-0">
                <v-col class="px-0 d-flex align-center" cols="auto">
                  <v-radio
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    value="lcNo"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">信用狀號碼</div>

                  <v-text-field
                    v-model="searchForm.lcNo"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    :disabled="searchForm.searchType !== 'lcNo'"
                    hide-details
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-1" />

              <v-row class="ma-0">
                <v-col class="px-0 d-flex align-center" cols="auto">
                  <v-radio
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    value="appNo"
                  />
                </v-col>

                <v-col class="d-flex align-center ga-4">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">開狀申請書號碼</div>

                  <v-text-field
                    v-model="searchForm.appNo"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    :disabled="searchForm.searchType !== 'appNo'"
                    hide-details
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-1" />

              <v-row class="ma-0">
                <v-col class="px-0 pt-3 d-flex align-start" cols="auto">
                  <v-radio
                    class="mt-1"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    value="advanced"
                  />
                </v-col>

                <v-col class="pa-0">
                  <v-row align="center" class="flex-grow-1 ma-0">
                    <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                      <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">申請人放款戶號</div>

                      <v-text-field
                        v-model="searchForm.beneNo"
                        bg-color="white"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="searchForm.searchType !== 'advanced'"
                        hide-details
                        variant="outlined"
                      />
                    </v-col>

                    <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                      <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人統編</div>

                      <v-text-field
                        v-model="searchForm.beneInNo"
                        bg-color="white"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="searchForm.searchType !== 'advanced'"
                        hide-details
                        variant="outlined"
                      />
                    </v-col>

                    <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                      <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">狀態</div>

                      <v-select
                        v-model="searchForm.status"
                        bg-color="white"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="searchForm.searchType !== 'advanced'"
                        hide-details
                        :items="searchStatusOptions"
                        variant="outlined"
                      />
                    </v-col>

                    <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                      <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">開狀日期</div>

                      <v-date-input
                        v-model="searchForm.startDate"
                        append-inner-icon="mdi-calendar"
                        bg-color="white"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="searchForm.searchType !== 'advanced'"
                        placeholder="起日"
                        prepend-icon=""
                        :rules="rules.startDateRule"
                        variant="outlined"
                      />

                      <div class="text-body-1 font-weight-medium pt-2">~</div>

                      <v-date-input
                        v-model="searchForm.endDate"
                        append-inner-icon="mdi-calendar"
                        bg-color="white"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="searchForm.searchType !== 'advanced'"
                        placeholder="訖日"
                        prepend-icon=""
                        :rules="rules.endDateRule"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-radio-group>

            <v-row>
              <v-col cols="6">
                <v-btn
                  class="hnb__btn--default"
                  @click="changeType"
                >
                  選擇填寫方式
                </v-btn>
              </v-col>

              <v-col class="d-flex justify-end" cols="6">
                <v-btn
                  class="hnb__btn--cancel mx-1"
                  @click="resetSearchForm"
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

      <!-- 開狀申請書清冊 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <h2 class="hnb16__title">
          開狀申請書清冊 -
          {{ typeForm.beneficiaryType === 'cds' ? 'CDS' : typeForm.beneficiaryType === 'fpc' ? '台塑 e 化平台' : '企業' }}
        </h2>

        <LcAppList :form-data="propsFormData" @on-edit="handleEdit" />

      </div>

      <!-- 填寫開狀申請書 -->
      <div v-if="isEdit">
        <!-- <h2 class="mx-4 hnb16__title">填寫開狀申請書</h2> -->
        <LcAppEditForm
          :form-data="lcAppData"
          @on-cancel="closeEditForm"
          @on-submit="submitEditForm"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { SearchForm, TypeForm } from '@/api/lcApp'
  import type { LcAppData } from '@/types/lcApplication'
  import { isAfter, isBefore } from 'date-fns'
  import { reactive, ref, watch } from 'vue'

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '申請作業' },
    { title: '開狀申請書', to: '/lcApp' },
  ]

  const beneficiaryTypeOptions = [
    { title: 'CDS 客戶 (中鋼、中鴻、中鋁、華新麗華、東和鋼鐵)', value: 'cds' },
    { title: '台塑 e 化平台客戶 (台塑集團、奇美集團)', value: 'fpc' },
    { title: '其他客戶', value: 'other' },
  ]

  const beneListByType = [
    { title: '30414175 中國鋼鐵股份有限公司', value: '30414175' },
    { title: '07838854 中鴻鋼鐵股份有限公司', value: '07838854' },
    { title: '96971313 中鋼鋁業股份有限公司', value: '96971313' },
    { title: '75460005 唐榮鐵工廠股份有限公司', value: '75460005' },
  ]

  const beneGroupList = [
    { title: '台塑集團', value: '30414175' },
    { title: '奇美集團', value: '75460005' },
  ]

  const inputTypeOptions = [
    { title: '重新填寫申請書', value: 'new' },
    { title: '舊有申請資料修改', value: 'edit' },
  ]

  const searchStatusOptions = [
    { title: '待銀行審核', value: 'pending' },
    { title: '已核准', value: 'approved' },
    { title: '已拒絕', value: 'rejected' },
  ]

  const currentView = ref('selectType')
  const isEdit = ref(false)
  const isShowList = ref(false)
  const typeFormRef = ref()
  const searchFormRef = ref()
  const lcAppData = ref<LcAppData>({ editType: '', appNo: '', beneType: '' })

  const typeForm = reactive<TypeForm>({
    beneficiaryType: null,
    beneficiary: null,
    inputType: null,
  })

  const searchForm = reactive<SearchForm>({
    searchType: 'lcNo',
    lcNo: '',
    appNo: '',
    beneNo: '',
    beneInNo: '',
    status: null,
    startDate: null,
    endDate: null,
    beneficiaryType: '',
    beneficiary: '',
  })
  const propsFormData = ref<SearchForm>({ ...searchForm })

  interface Rules {
    startDateRule: ((v: string) => boolean | string)[]
    endDateRule: ((v: string) => boolean | string)[]
  }
  const rules: Rules = {
    startDateRule: [v => {
      if (!v || !searchForm.endDate) return true

      const start = new Date(v)
      const end = new Date(searchForm.endDate)
      if (!start || !end) return true
      return !isAfter(start, end) || '起始日期不能晚於結束日期'
    }],
    endDateRule: [v => {
      if (!v || !searchForm.startDate) return true

      const end = new Date(v)
      const start = new Date(searchForm.startDate)
      if (!start || !end) return true
      return !isBefore(end, start) || '結束日期不能早於起始日期'
    }],
  }

  watch(() => typeForm.beneficiaryType, () => {
    typeForm.beneficiary = null
    typeForm.inputType = null
  })

  watch(() => typeForm.beneficiary, () => {
    typeForm.inputType = null
  })

  watch(() => searchForm.searchType, newType => {
    searchFormRef.value.reset()
    searchForm.searchType = newType
  })

  // 選擇開狀申請書填寫方式
  function changeType (): void {
    currentView.value = 'selectType'
    isShowList.value = false
    nextTick(() => {
      typeFormRef.value.SearchForm()
    })
  }

  function sendTypeForm (): void {
    console.log('送出表單', typeForm)
    const { beneficiaryType, beneficiary, inputType } = typeForm
    if (inputType === 'edit') {
      currentView.value = 'search'
    } else {
      handleEdit({ editType: 'new', appNo: '' })
      currentView.value = ''
      isEdit.value = true
    }
  }

  // 查詢舊有開狀申請書
  function sendSearchForm (): void {
    console.log('送出表單', searchForm)
    const { beneficiaryType, beneficiary } = typeForm
    isShowList.value = true
    propsFormData.value = { ...searchForm, beneficiaryType, beneficiary }
  }

  function resetSearchForm (): void {
    searchFormRef.value.reset()
    searchForm.searchType = 'lcNo'
  }

  // 編輯開狀申請書
  function handleEdit (payload: { editType: string, appNo: string }): void {
    console.log('編輯事件觸發，接收到 payload:', payload)
    // 取得 appId
    lcAppData.value = { editType: payload.editType, appNo: payload.appNo, beneType: typeForm.beneficiaryType || '' }
    currentView.value = ''
    isShowList.value = false
    isEdit.value = true
  }

  function closeEditForm (): void {
    isEdit.value = false
    currentView.value = 'selectType'
    typeForm.beneficiaryType = null
    typeForm.beneficiary = null
    typeForm.inputType = null
  }

  function submitEditForm (): void {
    // 送出編輯表單後的處理邏輯（例如刷新列表、顯示成功訊息等）
    console.log('編輯表單已送出，執行相關處理')
    // 這裡可以根據實際需求來決定是否要關閉編輯表單或是刷新列表等
    closeEditForm()
  }

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return
    if (item.title === '開狀申請書' && typeof item.to === 'string') {
      console.log('Breadcrumb clicked:', `/#${item.to}`)
      // hash router 下用 location.href 重新導向可強制整頁重整
      isEdit.value = false
      isShowList.value = false
      currentView.value = 'selectType'
      typeForm.beneficiaryType = null
      typeForm.beneficiary = null
      typeForm.inputType = null
      // window.location.href = `/#${item.to}`
    }
  }
</script>
