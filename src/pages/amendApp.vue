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

        <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
          <v-form ref="typeFormRef" @submit.prevent="sendTypeForm">
            <v-row align="center">
              <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人類別</div>

                <v-select
                  v-model="form.beneType"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="[...BENE_TYPE_ITEMS]"
                  placeholder="請選擇受益人類別"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-divider class="my-1" />

            <div class="d-flex py-1">
              <div class="pt-2 flex-shrink-0" style="width: 25px">
                <v-radio-group
                  v-model="form.queryMode"
                  density="compact"
                  hide-details
                >
                  <v-radio class="ma-0" value="lcNo" />
                </v-radio-group>
              </div>

              <v-row class="flex-grow-1 mx-0" dense>
                <v-col cols="12" lg="4" md="6">
                  <v-row align="center" dense>
                    <v-col class="text-md-end text-no-wrap" cols="4" md="3">
                      <label class="text-body-1" for="amend-lc-no">信用狀號碼</label>
                    </v-col>

                    <v-col cols="8" md="9">
                      <v-text-field
                        id="amend-lc-no"
                        v-model="form.lcNo"
                        density="compact"
                        hide-details="auto"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>

            <v-divider class="my-1" />

            <div class="d-flex py-1">
              <div class="pt-2 flex-shrink-0" style="width: 25px">
                <v-radio-group
                  v-model="form.queryMode"
                  density="compact"
                  hide-details
                >
                  <v-radio class="ma-0" value="criteria" />
                </v-radio-group>
              </div>

              <v-row class="flex-grow-1 mx-0" dense>
                <v-col cols="12" lg="4" md="6">
                  <v-row align="center" dense>
                    <v-col class="text-md-end text-no-wrap" cols="4" md="3">
                      <label class="text-body-1" for="amend-applicant-loan">申請人放款戶號</label>
                    </v-col>

                    <v-col cols="8" md="9">
                      <v-text-field
                        id="amend-applicant-loan"
                        v-model="form.applicantLoanAccount"
                        density="compact"
                        hide-details="auto"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" lg="4" md="6">
                  <v-row align="center" dense>
                    <v-col class="text-md-end text-no-wrap" cols="4" md="3">
                      <label class="text-body-1" for="amend-bene-tax-id">受益人統編</label>
                    </v-col>

                    <v-col cols="8" md="9">
                      <v-text-field
                        id="amend-bene-tax-id"
                        v-model="form.beneficiaryTaxId"
                        density="compact"
                        hide-details="auto"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" lg="4" md="6">
                  <v-row align="center" dense>
                    <v-col class="text-md-end text-no-wrap" cols="4" md="3">
                      <label class="text-body-1" for="amend-lc-status">信用狀狀態</label>
                    </v-col>

                    <v-col cols="8" md="9">
                      <v-select
                        id="amend-lc-status"
                        v-model="form.lcStatus"
                        clearable
                        density="compact"
                        hide-details="auto"
                        item-title="title"
                        item-value="value"
                        :items="[...LC_STATUS_ITEMS]"
                        placeholder="= 請選擇 ="
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" lg="4" md="6">
                  <v-row align="center" dense>
                    <v-col class="text-md-end text-no-wrap" cols="4" md="3">
                      <span class="text-body-1">開狀日期</span>
                    </v-col>

                    <v-col cols="8" md="9">
                      <div class="d-flex align-center flex-wrap">
                        <v-text-field
                          v-model="form.issueDateStart"
                          class="flex-grow-1"
                          density="compact"
                          hide-details="auto"
                          placeholder="請點選起日"
                          prepend-inner-icon="mdi-calendar"
                          style="min-width: 140px"
                          type="datetime-local"
                          variant="outlined"
                          @update:model-value="onDateChange"
                        />

                        <span class="px-2">~</span>

                        <v-text-field
                          v-model="form.issueDateEnd"
                          class="flex-grow-1"
                          density="compact"
                          hide-details="auto"
                          placeholder="請點選訖日"
                          prepend-inner-icon="mdi-calendar"
                          style="min-width: 140px"
                          type="datetime-local"
                          variant="outlined"
                          @update:model-value="onDateChange"
                        />
                      </div>

                      <div
                        v-if="dateRangeError"
                        class="pt-1 text-error text-end text-no-wrap"
                      >
                        <v-icon class="me-1" icon="mdi-close-thick" size="small" />
                        結束日期須晚於開始日期
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>

            <v-row>
              <v-col class="text-end py-1">
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
</template>

<script setup lang="ts">
  import type { AmendQueryFormPayload, BeneTypeOption } from '@/types/amendQuery'
  import { computed, reactive, ref } from 'vue'
  import {
    BENE_TYPE_ITEMS,
    createInitialAmendQueryForm,
    LC_STATUS_ITEMS,
  } from '@/types/amendQuery'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '申請作業' },
    { title: '修改申請書', disabled: true },
  ]

  const form = reactive<AmendQueryFormPayload>(createInitialAmendQueryForm())

  const dateRangeError = ref(false)

  const searchEnabled = computed(() => form.beneType !== null)

  const emit = defineEmits<{
    search: [AmendQueryFormPayload, BeneTypeOption]
    reset: []
  }>()

  function validateDateRange (): boolean {
    if (!form.issueDateStart || !form.issueDateEnd) {
      dateRangeError.value = false
      return true
    }
    const invalid = form.issueDateStart > form.issueDateEnd
    dateRangeError.value = invalid
    return !invalid
  }

  function onDateChange (): void {
    validateDateRange()
  }

  function resetForm (): void {
    Object.assign(form, createInitialAmendQueryForm())
    dateRangeError.value = false
    emit('reset')
  }

  function submitSearch (): void {
    if (!form.beneType || !searchEnabled.value) {
      return
    }
    if (form.queryMode === 'criteria' && !validateDateRange()) {
      return
    }
    emit('search', { ...form }, form.beneType)
  }

  function sendTypeForm (): void {
    submitSearch()
  }
</script>
