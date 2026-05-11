<template>
  <div>
    <!-- 開狀申請書 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div>
        <h2 class="mx-4 hnb16__title">選擇開狀申請書填寫方式</h2>

        <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
          <v-form ref="formRef" @submit.prevent="sendForm">
            <v-row align="center">
              <v-col cols="auto">
                <div class="text-body-2 font-weight-medium">受益人類別</div>
              </v-col>

              <v-col cols="12" md="3" sm="5">
                <v-select
                  v-model="form.beneficiaryType"
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

              <template v-if="form.beneficiaryType === '1'">
                <v-col cols="auto">
                  <div class="text-body-2 font-weight-medium">受益人</div>
                </v-col>

                <v-col cols="12" md="3" sm="5">
                  <v-select
                    v-model="form.beneficiary"
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

              <template v-if="form.beneficiaryType === '2'">
                <v-col cols="auto">
                  <div class="text-body-2 font-weight-medium">集團受益人</div>
                </v-col>

                <v-col cols="12" md="3" sm="5">
                  <v-select
                    v-model="form.beneficiary"
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

              <template v-if="form.beneficiaryType !== null">
                <v-col cols="auto">
                  <div class="text-body-2 font-weight-medium">填寫方式</div>
                </v-col>

                <v-col cols="12" md="3" sm="5">
                  <v-select
                    v-model="form.inputType"
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
                  density="compact"
                  :disabled="form.inputType === null"
                  type="submit"
                >
                  確認
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <div v-if="form.inputType === 'edit'" class="mt-4">
        <h2 class="mx-4 hnb16__title">查詢舊有開狀申請書</h2>

        <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendForm">
            <v-radio-group v-model="searchForm.searchType">
              <v-row class="ma-0" no-gutters>
                <v-col class="px-0 py-1 d-flex align-center" cols="auto">
                  <v-radio
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    value="lcNo"
                  />
                </v-col>

                <v-col>
                  <v-row align="center" class="flex-grow-1 ma-0">
                    <v-col cols="auto">
                      <div class="text-body-2 font-weight-medium">信用狀號碼</div>
                    </v-col>

                    <v-col cols="12" lg="3" md="6">
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
                </v-col>
              </v-row>

              <v-divider class="my-1" />

              <v-row class="ma-0" no-gutters>
                <v-col class="px-0 py-1 d-flex align-center" cols="auto">
                  <v-radio
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    value="appNo"
                  />
                </v-col>

                <v-col>
                  <v-row align="center" class="flex-grow-1 ma-0">
                    <v-col cols="auto">
                      <div class="text-body-2 font-weight-medium">開狀申請書號碼</div>
                    </v-col>

                    <v-col cols="12" lg="3" md="6">
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
                </v-col>
              </v-row>

              <v-divider class="my-1" />

              <v-row class="ma-0" no-gutters>
                <v-col class="px-0 py-1 d-flex align-start" cols="auto">
                  <v-radio
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    value="advanced"
                  />
                </v-col>

                <v-col>
                  <v-row align="center" class="flex-grow-1 ma-0">
                    <v-col cols="auto">
                      <div class="text-body-2 font-weight-medium">申請人放款戶號</div>
                    </v-col>

                    <v-col cols="12" lg="3" md="6">
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

                    <v-col cols="auto">
                      <div class="text-body-2 font-weight-medium">受益人統編</div>
                    </v-col>

                    <v-col cols="12" lg="3" md="6">
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

                    <v-col cols="auto">
                      <div class="text-body-2 font-weight-medium">狀態</div>
                    </v-col>

                    <v-col cols="12" lg="3" md="6">
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

                    <v-col class="pa-0" cols="12">
                      <v-row align="start" class="ma-0">
                        <v-col cols="auto">
                          <div class="text-body-2 font-weight-medium">開狀日期</div>
                        </v-col>

                        <v-col class="px-0 px-md-2 py-1" cols="12" lg="3" md="4">
                          <v-date-input
                            v-model="searchForm.startDate"
                            append-inner-icon="mdi-calendar"
                            bg-color="white"
                            color="teal-darken-2"
                            density="compact"
                            :disabled="searchForm.searchType !== 'advanced'"
                            placeholder="起日：2026/01/01"
                            prepend-icon=""
                            required
                            variant="outlined"
                          />
                        </v-col>

                        <v-col cols="auto">
                          <div class="text-body-2 font-weight-medium">~</div>
                        </v-col>

                        <v-col class="px-0 px-md-2 py-1" cols="12" lg="3" md="4">
                          <v-date-input
                            v-model="searchForm.endDate"
                            append-inner-icon="mdi-calendar"
                            bg-color="white"
                            color="teal-darken-2"
                            density="compact"
                            :disabled="searchForm.searchType !== 'advanced'"
                            placeholder="訖日：2026/01/01"
                            prepend-icon=""
                            required
                            variant="outlined"
                          />
                        </v-col>
                      </v-row>

                      <v-alert
                        v-if="isDateRangeInvalid"
                        class="mt-1"
                        density="compact"
                        type="error"
                        variant="tonal"
                      >
                        結束日期須晚於開始日期
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-form>
        </v-card>

      </div>

      <div>
        <h2 class="mx-4 hnb16__title">填寫開狀申請書</h2>
        <!-- 填寫開狀申請書-CDS -->
        <!-- <LcForCDS v-if="form.inputType === 'new' && form.beneficiaryType === '1'" /> -->

      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '申請作業' },
    { title: '開狀申請書', disabled: true },
  ]

  const formRef = ref()
  const searchFormRef = ref()

  interface Form {
    beneficiaryType: string | null
    beneficiary: string | null
    inputType: string | null
  }
  const form = reactive<Form>({
    beneficiaryType: null,
    beneficiary: null,
    inputType: null,
  })

  const beneficiaryTypeOptions = [
    { title: 'CDS 客戶 (中鋼、中鴻、中鋁、華新麗華、東和鋼鐵)', value: '1' },
    { title: '台塑 e 化平台客戶 (台塑集團、奇美集團)', value: '2' },
    { title: '其他客戶', value: '3' },
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

  interface SearchForm {
    searchType: 'lcNo' | 'appNo' | 'advanced'
    lcNo: string
    appNo: string
    beneNo: string
    beneInNo: string
    status: string | null
    startDate: string | null
    endDate: string | null
  }

  const searchForm = reactive<SearchForm>({
    searchType: 'lcNo',
    lcNo: '',
    appNo: '',
    beneNo: '',
    beneInNo: '',
    status: null,
    startDate: null,
    endDate: null,
  })

  const searchStatusOptions = [
    { title: '待銀行審核', value: 'pending' },
    { title: '已核准', value: 'approved' },
    { title: '已拒絕', value: 'rejected' },
  ]

  const isDateRangeInvalid = computed(() => {
    if (!searchForm.startDate || !searchForm.endDate) {
      return false
    }
    return new Date(searchForm.endDate).getTime() <= new Date(searchForm.startDate).getTime()
  })

  watch(() => form.beneficiaryType, () => {
    form.beneficiary = null
    form.inputType = null
  })

  watch(() => form.beneficiary, () => {
    form.inputType = null
  })

  function sendForm() {
    console.log('送出表單', form)
    // 在這裡可以進行表單驗證或發送 API 請求
  }
</script>
