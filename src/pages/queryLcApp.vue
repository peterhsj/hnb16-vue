<template>
  <div>
    <!-- 查詢開狀申請書 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div>
        <h2 class="mx-4 hnb16__title">查詢開狀申請書</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="searchHandler">
            <div class="py-1">
              <v-radio-group
                v-model="searchMode"
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
                      v-model.trim="lcNo"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      :disabled="searchMode !== 'lcNo'"
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
                      value="appNo"
                    />
                  </v-col>

                  <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                    <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">開狀申請書號碼</div>

                    <v-text-field
                      v-model.trim="appNo"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      :disabled="searchMode !== 'appNo'"
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
                      value="advanced"
                    />
                  </v-col>

                  <v-col class="pa-0">
                    <v-row class="flex-grow-1 align-center ma-0">
                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">申請人統編</div>

                        <v-text-field
                          v-model.trim="appTaxId"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchMode !== 'advanced'"
                          hide-details="auto"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人統編</div>

                        <v-text-field
                          v-model.trim="beneTaxId"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchMode !== 'advanced'"
                          hide-details="auto"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">分行</div>

                        <v-text-field
                          v-model.trim="bank"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchMode !== 'advanced'"
                          hide-details="auto"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-center ga-4" cols="12" lg="5" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">狀態</div>

                        <v-select
                          v-model="statusList"
                          bg-color="white"
                          chips
                          closable-chips
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchMode !== 'advanced'"
                          hide-details
                          item-title="title"
                          item-value="value"
                          :items="[...LC_STATUS_ITEMS]"
                          multiple
                          placeholder="請選擇"
                          variant="outlined"
                        >
                          <template #item="{ props }">
                            <v-list-item v-bind="props">
                              <template #prepend />
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>

                      <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">信用狀類別</div>

                        <v-select
                          v-model="lcTypeList"
                          bg-color="white"
                          clearable
                          closable-chips
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchMode !== 'advanced'"
                          hide-details
                          item-title="title"
                          item-value="value"
                          :items="[...LC_TYPE_ITEMS]"
                          multiple
                          placeholder="請選擇"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col class="d-flex align-start ga-4" cols="12" lg="5" md="6">
                        <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label pt-2">開狀日期</div>

                        <v-date-input
                          v-model="dateStart"
                          append-inner-icon="mdi-calendar"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchMode !== 'advanced'"
                          hide-details="auto"
                          placeholder="申請起日"
                          prepend-icon=""
                          :rules="rules.dateStartRule"
                          variant="outlined"
                        />

                        <div class="text-body-1 font-weight-medium pt-2">~</div>

                        <v-date-input
                          v-model="dateEnd"
                          append-inner-icon="mdi-calendar"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          :disabled="searchMode !== 'advanced'"
                          hide-details="auto"
                          placeholder="申請訖日"
                          prepend-icon=""
                          :rules="rules.dateEndRule"
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
                  @click="resetHandler"
                >
                  重設
                </v-btn>

                <v-btn
                  class="hnb__btn--default mx-1"
                  :disabled="!searchMode"
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
      <div v-if="showResult" class="mt-4 mx-4">
        <h2 class="hnb16__title">
          開狀申請書清冊
        </h2>

        <QueryLcAppList
          :list-loading="loading"
          :page-options="pageOptions"
          :table-items="tableItems"
          :total-amount="totalAmount"
          :total-count="totalCount"
          :total-pages="totalPages"
          @update:items-per-page="handleItemsPerPageChange"
          @update:page="handlePageChange"
        />
      </div>

      <CommonOverlay :overlay="loading" />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { useQueryLcApp } from '@/composables/useQueryLcApp'
  import {
    LC_STATUS_ITEMS,
    LC_TYPE_ITEMS,
  } from '@/types/lcApp'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '查詢作業' },
    { title: '開狀申請書', disabled: true },
  ]
  const {
    searchMode,
    searchFormRef,
    loading,
    showResult,
    lcNo,
    appNo,
    appTaxId,
    beneTaxId,
    bank,
    statusList,
    lcTypeList,
    dateStart,
    dateEnd,
    rules,
    tableItems,
    totalCount,
    totalAmount,
    pageOptions,
    totalPages,
    searchHandler,
    resetHandler,
    handleItemsPerPageChange,
    handlePageChange,
  } = useQueryLcApp()
</script>
